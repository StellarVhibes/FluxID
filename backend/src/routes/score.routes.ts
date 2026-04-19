import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { createHorizonService } from '../services/horizon.service.js';
import { calculateWalletScore } from '../services/scoring.service.js';
import { cacheService } from '../services/cache.service.js';
import { createContractService } from '../services/contract.service.js';
import { appendScoreHistory, getScoreHistory } from '../services/history.service.js';
import { generateExplanation } from '../services/explainability/index.js';
import { validateAccountId, validateNetwork } from '../utils/validators.js';
import { logger } from '../utils/logger.js';

interface ScoreParams {
  accountId: string;
}

interface ScoreQuery {
  network?: string;
  refresh?: string;
  sync?: string;
}

interface SyncBody {
  network?: string;
}

export async function scoreRoute(request: FastifyRequest<{ Params: ScoreParams; Querystring: ScoreQuery }>, reply: FastifyReply) {
  const { accountId } = request.params;
  const { network = 'testnet', refresh = 'false', sync = 'false' } = request.query;

  try {
    const validatedAccountId = validateAccountId(accountId);
    const validatedNetwork = validateNetwork(network);
    const shouldRefresh = refresh === 'true';
    const shouldSync = sync === 'true';

    if (!shouldRefresh) {
      const cached = cacheService.get(validatedAccountId, validatedNetwork);
      if (cached) {
        // Cache holds the deterministic ScoreResult (score, risk, metrics, assets, usd).
        // The Explanation is always regenerated so consumers never see a missing field
        // and the LLM layer stays in the loop even on cached reads.
        const explanation = await generateExplanation(cached);
        return reply.send({
          success: true,
          data: { ...cached, cached: true, explanation },
        });
      }
    }

    const horizonService = createHorizonService(validatedNetwork);
    const result = await calculateWalletScore(validatedAccountId, validatedNetwork, horizonService);

    cacheService.set(validatedAccountId, validatedNetwork, result);

    // Append to history on every fresh compute (cache hits return early above, so no duplicates).
    void appendScoreHistory({
      wallet: validatedAccountId,
      network: validatedNetwork,
      score: result.score,
      risk: result.risk,
      timestamp: Date.now(),
    });

    // AI Explainability Layer (BK-AI-1 / BK-AI-2).
    // LLM primary when ANTHROPIC_API_KEY is set; deterministic rule-based
    // fallback otherwise. Always returns a populated Explanation whose
    // `source` field tells the consumer which layer produced it.
    const explanation = await generateExplanation(result);

    // On-chain sync only fires on explicit opt-in via ?sync=true or the dedicated
    // POST /score/:accountId/sync endpoint. Reads never trigger writes implicitly.
    let onChain: { synced: boolean; txHash?: string; error?: string } | undefined;
    if (shouldSync) {
      const contractService = createContractService(validatedNetwork);
      const syncResult = await contractService.syncScore(
        validatedAccountId,
        result.score,
        result.risk
      );
      onChain = { synced: syncResult.success, txHash: syncResult.txHash, error: syncResult.error };
    }

    return reply.send({
      success: true,
      data: {
        ...result,
        cached: false,
        onChain,
        explanation,
      },
    });
  } catch (error) {
    const err = error as Error;
    logger.error({ error: err, accountId }, 'Failed to get score');

    if (err.message.includes('Invalid Stellar')) {
      return reply.code(400).send({
        success: false,
        error: 'Invalid account ID format',
      });
    }

    if (err.message.includes('Horizon API error: 404')) {
      return reply.code(404).send({
        success: false,
        error: 'Account not found on Stellar network',
      });
    }

    return reply.code(503).send({
      success: false,
      error: 'Failed to fetch data from Stellar network',
    });
  }
}

export async function syncScoreRoute(
  request: FastifyRequest<{ Params: ScoreParams; Body: SyncBody }>,
  reply: FastifyReply
) {
  const { accountId } = request.params;
  const { network = 'testnet' } = request.body || {};

  try {
    const validatedAccountId = validateAccountId(accountId);
    const validatedNetwork = validateNetwork(network);

    const cached = cacheService.get(validatedAccountId, validatedNetwork);
    const result =
      cached ??
      (await calculateWalletScore(
        validatedAccountId,
        validatedNetwork,
        createHorizonService(validatedNetwork)
      ));
    if (!cached) cacheService.set(validatedAccountId, validatedNetwork, result);

    const contractService = createContractService(validatedNetwork);
    const syncResult = await contractService.syncScore(
      validatedAccountId,
      result.score,
      result.risk
    );

    return reply.send({
      success: syncResult.success,
      data: {
        accountId: validatedAccountId,
        score: result.score,
        risk: result.risk,
        txHash: syncResult.txHash,
        error: syncResult.error,
      },
    });
  } catch (error) {
    const err = error as Error;
    logger.error({ error: err, accountId }, 'Failed to sync score to contract');

    if (err.message.includes('Invalid Stellar')) {
      return reply.code(400).send({ success: false, error: 'Invalid account ID format' });
    }

    return reply.code(503).send({ success: false, error: err.message });
  }
}

interface HistoryQuery {
  limit?: string;
  network?: string;
  since?: string;
}

export async function scoreHistoryRoute(
  request: FastifyRequest<{ Params: ScoreParams; Querystring: HistoryQuery }>,
  reply: FastifyReply
) {
  const { accountId } = request.params;
  const { limit = '100', network = 'testnet', since } = request.query;

  try {
    const validatedAccountId = validateAccountId(accountId);
    const validatedNetwork = validateNetwork(network);
    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 100, 1), 1000);
    const parsedSince = since ? parseInt(since, 10) : undefined;

    const entries = await getScoreHistory(validatedAccountId, {
      limit: parsedLimit,
      network: validatedNetwork,
      since: Number.isFinite(parsedSince) ? parsedSince : undefined,
    });

    return reply.send({
      success: true,
      data: {
        wallet: validatedAccountId,
        network: validatedNetwork,
        count: entries.length,
        entries,
      },
    });
  } catch (error) {
    const err = error as Error;
    logger.error({ error: err, accountId }, 'Failed to read score history');
    if (err.message.includes('Invalid Stellar')) {
      return reply.code(400).send({ success: false, error: 'Invalid account ID format' });
    }
    return reply.code(503).send({ success: false, error: err.message });
  }
}

export async function registerScoreRoutes(fastify: FastifyInstance) {
  fastify.get('/score/:accountId', scoreRoute);
  fastify.post('/score/:accountId/sync', syncScoreRoute);
  fastify.get('/score/:accountId/history', scoreHistoryRoute);
}
