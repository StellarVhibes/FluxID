import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { HorizonService, createHorizonService } from '../services/horizon.service.js';
import { calculateWalletScore } from '../services/scoring.service.js';
import { cacheService } from '../services/cache.service.js';
import { validateAccountId, validateNetwork } from '../utils/validators.js';
import { logger } from '../utils/logger.js';
import type { NetworkType } from '../config/stellar.config.js';

interface ScoreParams {
  accountId: string;
}

interface ScoreQuery {
  network?: string;
  refresh?: string;
}

export async function scoreRoute(request: FastifyRequest<{ Params: ScoreParams; Querystring: ScoreQuery }>, reply: FastifyReply) {
  const { accountId } = request.params;
  const { network = 'testnet', refresh = 'false' } = request.query;

  try {
    const validatedAccountId = validateAccountId(accountId);
    const validatedNetwork = validateNetwork(network);
    const shouldRefresh = refresh === 'true';

    if (!shouldRefresh) {
      const cached = cacheService.get(validatedAccountId, validatedNetwork);
      if (cached) {
        return reply.send({
          success: true,
          data: { ...cached, cached: true },
        });
      }
    }

    const horizonService = createHorizonService(validatedNetwork);
    const result = await calculateWalletScore(validatedAccountId, validatedNetwork, horizonService);

    cacheService.set(validatedAccountId, validatedNetwork, result);

    return reply.send({
      success: true,
      data: { ...result, cached: false },
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

export async function registerScoreRoutes(fastify: FastifyInstance) {
  fastify.get('/score/:accountId', scoreRoute);
}
