import fs from 'node:fs/promises';
import path from 'node:path';
import { logger } from '../utils/logger.js';
import type { NetworkType } from '../config/stellar.config.js';

export interface ScoreHistoryEntry {
  wallet: string;
  network: NetworkType;
  score: number;
  risk: 'Low' | 'Medium' | 'High';
  timestamp: number;
}

const DATA_DIR = process.env.FLUXID_DATA_DIR || path.join(process.cwd(), 'data');
const HISTORY_FILE = path.join(DATA_DIR, 'score_history.jsonl');

let dirEnsured = false;
async function ensureDataDir(): Promise<void> {
  if (dirEnsured) return;
  await fs.mkdir(DATA_DIR, { recursive: true });
  dirEnsured = true;
}

export async function appendScoreHistory(entry: ScoreHistoryEntry): Promise<void> {
  try {
    await ensureDataDir();
    // fs.appendFile is atomic per-call for writes under PIPE_BUF (4096B) on POSIX;
    // JSONL entries are well under that, so concurrent callers don't interleave bytes.
    await fs.appendFile(HISTORY_FILE, JSON.stringify(entry) + '\n', 'utf8');
  } catch (err) {
    const e = err as Error;
    logger.warn({ error: e.message, wallet: entry.wallet }, 'Failed to append score history');
  }
}

export interface HistoryQueryOptions {
  limit?: number;
  network?: NetworkType;
  since?: number;
}

export async function getScoreHistory(
  wallet: string,
  options: HistoryQueryOptions = {}
): Promise<ScoreHistoryEntry[]> {
  const { limit = 100, network, since } = options;

  try {
    const content = await fs.readFile(HISTORY_FILE, 'utf8');
    const lines = content.split('\n');
    const entries: ScoreHistoryEntry[] = [];

    for (const line of lines) {
      if (!line) continue;
      try {
        const entry = JSON.parse(line) as ScoreHistoryEntry;
        if (entry.wallet !== wallet) continue;
        if (network && entry.network !== network) continue;
        if (since && entry.timestamp < since) continue;
        entries.push(entry);
      } catch {
        // malformed line — skip silently
      }
    }

    entries.sort((a, b) => b.timestamp - a.timestamp);
    return entries.slice(0, limit);
  } catch (err) {
    const e = err as NodeJS.ErrnoException;
    if (e.code === 'ENOENT') return [];
    logger.warn({ error: e.message, wallet }, 'Failed to read score history');
    return [];
  }
}
