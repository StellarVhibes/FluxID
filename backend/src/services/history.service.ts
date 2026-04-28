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
const WALLET_HISTORY_FILE = path.join(DATA_DIR, 'wallet_history.jsonl');
const PROTOCOL_HISTORY_FILE = path.join(DATA_DIR, 'protocol_history.jsonl');
const LEGACY_HISTORY_FILE = path.join(DATA_DIR, 'score_history.jsonl');

let dirEnsured = false;
async function ensureDataDir(): Promise<void> {
  if (dirEnsured) return;
  await fs.mkdir(DATA_DIR, { recursive: true });
  // Migrate the legacy combined log: pre-split, every wallet analysis appended
  // here and the protocol layer read from the same file. Rename it once into
  // the wallet store so existing per-wallet history surfaces don't go blank.
  // Protocol history starts empty by design — only deliberate protocol
  // operations write to it from here on.
  try {
    await fs.access(LEGACY_HISTORY_FILE);
    try {
      await fs.access(WALLET_HISTORY_FILE);
    } catch {
      await fs.rename(LEGACY_HISTORY_FILE, WALLET_HISTORY_FILE);
      logger.info('Migrated score_history.jsonl → wallet_history.jsonl');
    }
  } catch {
    // no legacy file — fresh install
  }
  dirEnsured = true;
}

async function appendEntry(file: string, entry: ScoreHistoryEntry): Promise<void> {
  try {
    await ensureDataDir();
    // fs.appendFile is atomic per-call for writes under PIPE_BUF (4096B) on POSIX;
    // JSONL entries are well under that, so concurrent callers don't interleave bytes.
    await fs.appendFile(file, JSON.stringify(entry) + '\n', 'utf8');
  } catch (err) {
    const e = err as Error;
    logger.warn({ error: e.message, wallet: entry.wallet, file }, 'Failed to append history entry');
  }
}

async function readEntries(file: string): Promise<ScoreHistoryEntry[]> {
  try {
    await ensureDataDir();
    const content = await fs.readFile(file, 'utf8');
    const lines = content.split('\n');
    const entries: ScoreHistoryEntry[] = [];
    for (const line of lines) {
      if (!line) continue;
      try {
        entries.push(JSON.parse(line) as ScoreHistoryEntry);
      } catch {
        // malformed line — skip silently
      }
    }
    return entries;
  } catch (err) {
    const e = err as NodeJS.ErrnoException;
    if (e.code === 'ENOENT') return [];
    logger.warn({ error: e.message, file }, 'Failed to read history file');
    return [];
  }
}

export interface HistoryQueryOptions {
  limit?: number;
  network?: NetworkType;
  since?: number;
}

export async function appendWalletHistory(entry: ScoreHistoryEntry): Promise<void> {
  await appendEntry(WALLET_HISTORY_FILE, entry);
}

export async function getWalletHistory(
  wallet: string,
  options: HistoryQueryOptions = {}
): Promise<ScoreHistoryEntry[]> {
  const { limit = 100, network, since } = options;
  const all = await readEntries(WALLET_HISTORY_FILE);
  const filtered = all.filter((entry) => {
    if (entry.wallet !== wallet) return false;
    if (network && entry.network !== network) return false;
    if (since && entry.timestamp < since) return false;
    return true;
  });
  filtered.sort((a, b) => b.timestamp - a.timestamp);
  return filtered.slice(0, limit);
}

export interface AllHistoryQueryOptions {
  network?: NetworkType;
  since?: number;
}

export async function appendProtocolHistory(entry: ScoreHistoryEntry): Promise<void> {
  await appendEntry(PROTOCOL_HISTORY_FILE, entry);
}

export async function getAllProtocolHistory(
  options: AllHistoryQueryOptions = {}
): Promise<ScoreHistoryEntry[]> {
  const { network, since } = options;
  const all = await readEntries(PROTOCOL_HISTORY_FILE);
  return all.filter((entry) => {
    if (network && entry.network !== network) return false;
    if (since && entry.timestamp < since) return false;
    return true;
  });
}
