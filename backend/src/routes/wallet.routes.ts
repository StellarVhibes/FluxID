import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { createHorizonService } from '../services/horizon.service.js';
import { calculateWalletScore } from '../services/scoring.service.js';
import { cacheService } from '../services/cache.service.js';
import { createContractService } from '../services/contract.service.js';
import { appendWalletHistory, getWalletHistory } from '../services/history.service.js';
import { generateExplanation } from '../services/explainability/index.js';
import { validateAccountId, validateNetwork } from '../utils/validators.js';
import { logger } from '../utils/logger.js';
import { appConfig } from '../config/app.config.js';

const DEFAULT_NETWORK = appConfig.stellarNetwork;

interface WalletParams {
  accountId: string;
}

interface WalletQuery {
  network?: string;
  refresh?: string;
  sync?: string;
}

interface SyncBody {
  network?: string;
}

export async function walletScoreRoute(request: FastifyRequest<{ Params: WalletParams; Querystring: WalletQuery }>, reply: FastifyReply) {
  const { accountId } = request.params;
  const { network = DEFAULT_NETWORK, refresh = 'false', sync = 'false' } = request.query;

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

    // Per-wallet history only. Protocol intelligence reads from a separate
    // store populated by deliberate protocol operations, so wallet analyses
    // never bleed into protocol-level aggregations.
    void appendWalletHistory({
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
    // POST /wallet/:accountId/sync endpoint. Reads never trigger writes implicitly.
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
    logger.error({ error: err, accountId }, 'Failed to get wallet score');

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

export async function walletSyncRoute(
  request: FastifyRequest<{ Params: WalletParams; Body: SyncBody }>,
  reply: FastifyReply
) {
  const { accountId } = request.params;
  const { network = DEFAULT_NETWORK } = request.body || {};

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
    logger.error({ error: err, accountId }, 'Failed to sync wallet score to contract');

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

export async function walletHistoryRoute(
  request: FastifyRequest<{ Params: WalletParams; Querystring: HistoryQuery }>,
  reply: FastifyReply
) {
  const { accountId } = request.params;
  const { limit = '100', network = DEFAULT_NETWORK, since } = request.query;

  try {
    const validatedAccountId = validateAccountId(accountId);
    const validatedNetwork = validateNetwork(network);
    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 100, 1), 1000);
    const parsedSince = since ? parseInt(since, 10) : undefined;

    const entries = await getWalletHistory(validatedAccountId, {
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
    logger.error({ error: err, accountId }, 'Failed to read wallet history');
    if (err.message.includes('Invalid Stellar')) {
      return reply.code(400).send({ success: false, error: 'Invalid account ID format' });
    }
    return reply.code(503).send({ success: false, error: err.message });
  }
}

export async function registerWalletRoutes(fastify: FastifyInstance) {
  fastify.get('/wallet/:accountId', walletScoreRoute);
  fastify.post('/wallet/:accountId/sync', walletSyncRoute);
  fastify.get('/wallet/:accountId/history', walletHistoryRoute);
}
