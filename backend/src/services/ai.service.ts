import type { ScoreResult } from '../types/scoring.types.js';
import { logger } from '../utils/logger.js';

export interface AiAugmentation {
  insight: string;
  suggestions: string[];
  model: string;
}

interface AnthropicMessage {
  role: 'user';
  content: string;
}

interface AnthropicResponse {
  content?: Array<{ type: string; text?: string }>;
  error?: { message?: string };
}

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';
const DEFAULT_MODEL = 'claude-haiku-4-5-20251001';
const ANTHROPIC_VERSION = '2023-06-01';
const REQUEST_TIMEOUT_MS = 8_000;

function buildPrompt(score: ScoreResult): string {
  const m = score.metrics;
  return [
    `You are rewriting a wallet trust-score report in clear, neutral language for a non-technical reader.`,
    `Score: ${score.score}/100 (risk: ${score.risk})`,
    `Rule-based insight: "${score.insight}"`,
    `Rule-based suggestion: "${score.suggestion}"`,
    `Sub-scores: inflow ${m.inflowScore}, outflow ${m.outflowScore}, frequency ${m.frequencyScore}, diversity ${m.diversityScore}, flow stability ${m.flowStabilityScore}, volume ${m.volumeScore}`,
    `Raw stats: ${m.transactionCount} txns, ${m.inflowCount} in / ${m.outflowCount} out, ${m.uniqueCounterparties} unique counterparties, total volume ${m.totalVolumeXLM.toFixed(2)} XLM.`,
    ``,
    `Respond with STRICT JSON only, no prose before or after:`,
    `{`,
    `  "insight": "one plain-English sentence (max 25 words) summarizing what this wallet's behavior actually looks like, grounded in the sub-scores",`,
    `  "suggestions": ["1 to 2 short actionable suggestions (max 15 words each), phrased positively, tailored to the weakest sub-scores"]`,
    `}`,
    `Do not mention score numbers. Do not add markdown.`,
  ].join('\n');
}

function parseAiResponse(raw: string): { insight: string; suggestions: string[] } | null {
  const trimmed = raw.trim();
  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start === -1 || end === -1) return null;
  try {
    const obj = JSON.parse(trimmed.slice(start, end + 1)) as {
      insight?: unknown;
      suggestions?: unknown;
    };
    if (typeof obj.insight !== 'string') return null;
    if (!Array.isArray(obj.suggestions)) return null;
    const suggestions = obj.suggestions
      .filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
      .slice(0, 2);
    if (suggestions.length === 0) return null;
    return { insight: obj.insight.trim(), suggestions };
  } catch {
    return null;
  }
}

export async function generateAiAugmentation(score: ScoreResult): Promise<AiAugmentation | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const model = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;

  const body = {
    model,
    max_tokens: 300,
    messages: [{ role: 'user', content: buildPrompt(score) } as AnthropicMessage],
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(ANTHROPIC_API, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': ANTHROPIC_VERSION,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      logger.warn({ status: res.status, body: errText.slice(0, 300) }, 'Anthropic API returned non-200');
      return null;
    }

    const data = (await res.json()) as AnthropicResponse;
    const text = data.content?.find((b) => b.type === 'text')?.text || '';
    const parsed = parseAiResponse(text);
    if (!parsed) {
      logger.warn({ raw: text.slice(0, 300) }, 'Could not parse AI response as JSON');
      return null;
    }

    return { ...parsed, model };
  } catch (err) {
    const e = err as Error;
    if (e.name === 'AbortError') {
      logger.warn('AI augmentation request timed out');
    } else {
      logger.warn({ error: e.message }, 'AI augmentation failed');
    }
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
