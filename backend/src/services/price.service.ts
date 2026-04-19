import { logger } from '../utils/logger.js';

export interface PriceQuote {
  usd: number;
  source: string;
  fetchedAt: string;
}

interface CachedPrice {
  quote: PriceQuote;
  expiresAt: number;
}

const COINGECKO_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=usd';
const CACHE_TTL_MS = 5 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 4_000;

let cached: CachedPrice | null = null;
let inFlight: Promise<PriceQuote | null> | null = null;

async function fetchFromCoinGecko(): Promise<PriceQuote | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(COINGECKO_URL, {
      headers: { accept: 'application/json' },
      signal: controller.signal,
    });
    if (!res.ok) {
      logger.warn({ status: res.status }, 'CoinGecko XLM price: non-200');
      return null;
    }
    const data = (await res.json()) as { stellar?: { usd?: number } };
    const usd = data?.stellar?.usd;
    if (typeof usd !== 'number' || !Number.isFinite(usd) || usd <= 0) {
      logger.warn({ data }, 'CoinGecko returned unexpected shape');
      return null;
    }
    return {
      usd,
      source: 'coingecko',
      fetchedAt: new Date().toISOString(),
    };
  } catch (err) {
    const e = err as Error;
    if (e.name === 'AbortError') {
      logger.warn('CoinGecko XLM price: timeout');
    } else {
      logger.warn({ error: e.message }, 'CoinGecko XLM price: fetch failed');
    }
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function getXlmUsdPrice(): Promise<PriceQuote | null> {
  const now = Date.now();
  if (cached && cached.expiresAt > now) return cached.quote;

  // De-duplicate concurrent callers during a cache miss.
  if (inFlight) return inFlight;

  inFlight = (async () => {
    const quote = await fetchFromCoinGecko();
    if (quote) cached = { quote, expiresAt: now + CACHE_TTL_MS };
    return quote;
  })();

  try {
    return await inFlight;
  } finally {
    inFlight = null;
  }
}

export function _resetPriceCacheForTests(): void {
  cached = null;
  inFlight = null;
}
