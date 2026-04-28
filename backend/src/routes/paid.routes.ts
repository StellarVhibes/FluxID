import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { createHorizonService } from '../services/horizon.service.js';
import { calculateWalletScore } from '../services/scoring.service.js';
import { cacheService } from '../services/cache.service.js';
import { paymentService } from '../services/payment.service.js';
import { createContractService } from '../services/contract.service.js';
import { appendWalletHistory } from '../services/history.service.js';
import { generateExplanation } from '../services/explainability/index.js';
import { validateAccountId, validateNetwork } from '../utils/validators.js';
import { logger } from '../utils/logger.js';
import type { PaymentChallenge } from '../types/payment.types.js';
import { appConfig } from '../config/app.config.js';

const DEFAULT_NETWORK = appConfig.stellarNetwork;

interface PaidScoreParams {
  accountId: string;
}

interface PaidScoreQuery {
  network?: string;
  requestId?: string;
  sync?: string;
}

function buildChallenge(
  request: ReturnType<typeof paymentService.createRequest>,
  accountId: string
): PaymentChallenge {
  return {
    status: 'payment_required',
    requestId: request.requestId,
    payTo: request.payTo,
    amount: request.amountXLM.toString(),
    asset: 'XLM',
    memo: request.memo,
    network: request.network,
    expiresAt: request.expiresAt.toISOString(),
    retryUrl: `/paid/wallet/${accountId}?requestId=${request.requestId}&network=${request.network}`,
    instructions:
      `Send ${request.amountXLM} XLM to ${request.payTo} with text memo "${request.memo}" ` +
      `on the ${request.network} network, then GET the retryUrl to receive the score.`,
  };
}

export async function paidScoreRoute(
  request: FastifyRequest<{ Params: PaidScoreParams; Querystring: PaidScoreQuery }>,
  reply: FastifyReply
) {
  const { accountId } = request.params;
  const { network = DEFAULT_NETWORK, requestId, sync = 'false' } = request.query;

  try {
    const validatedAccountId = validateAccountId(accountId);
    const validatedNetwork = validateNetwork(network);

    if (!paymentService.isConfigured()) {
      return reply.code(503).send({
        success: false,
        error:
          'Payment gateway not configured. Set PAYMENT_RECEIVE_ADDRESS or ADMIN_SECRET_KEY.',
      });
    }

    // BK-10: retry flow — if requestId provided, verify the payment
    if (requestId) {
      const existing = paymentService.get(requestId);
      if (!existing) {
        return reply.code(404).send({
          success: false,
          error: 'Unknown or expired requestId. Request a new payment challenge.',
        });
      }

      if (existing.accountId !== validatedAccountId || existing.network !== validatedNetwork) {
        return reply.code(400).send({
          success: false,
          error: 'requestId does not match the wallet or network in the URL.',
        });
      }

      if (existing.status === 'paid') {
        // Payment already settled — return cached score if available, else compute
        const cached = cacheService.get(validatedAccountId, validatedNetwork);
        const result =
          cached ??
          (await calculateWalletScore(
            validatedAccountId,
            validatedNetwork,
            createHorizonService(validatedNetwork)
          ));
        if (!cached) cacheService.set(validatedAccountId, validatedNetwork, result);
        const explanation = await generateExplanation(result);
        return reply.send({
          success: true,
          data: {
            ...result,
            explanation,
            payment: { status: 'paid', txHash: existing.txHash, requestId: existing.requestId },
          },
        });
      }

      if (existing.status === 'expired') {
        return reply.code(410).send({
          success: false,
          error: 'Payment request expired. Request a new challenge.',
        });
      }

      const verification = await paymentService.verify(requestId);

      if (verification.status === 'pending') {
        const challenge = buildChallenge(existing, validatedAccountId);
        return reply.code(402).send({
          success: false,
          data: { ...challenge, reason: 'Payment not yet detected on-chain.' },
        });
      }

      if (verification.status === 'expired') {
        return reply.code(410).send({
          success: false,
          error: 'Payment request expired.',
        });
      }

      // status === 'paid' — compute the score
      const cached = cacheService.get(validatedAccountId, validatedNetwork);
      const result =
        cached ??
        (await calculateWalletScore(
          validatedAccountId,
          validatedNetwork,
          createHorizonService(validatedNetwork)
        ));
      if (!cached) {
        cacheService.set(validatedAccountId, validatedNetwork, result);
        void appendWalletHistory({
          wallet: validatedAccountId,
          network: validatedNetwork,
          score: result.score,
          risk: result.risk,
          timestamp: Date.now(),
        });
      }

      // SC-7: optionally sync score to contract after payment verification
      let onChain: { synced: boolean; txHash?: string; error?: string } | undefined;
      if (sync === 'true') {
        const contractService = createContractService(validatedNetwork);
        const syncResult = await contractService.syncScore(
          validatedAccountId,
          result.score,
          result.risk
        );
        onChain = {
          synced: syncResult.success,
          txHash: syncResult.txHash,
          error: syncResult.error,
        };
      }

      const explanation = await generateExplanation(result);

      return reply.send({
        success: true,
        data: {
          ...result,
          explanation,
          payment: {
            status: 'paid',
            txHash: verification.txHash,
            requestId: existing.requestId,
          },
          onChain,
        },
      });
    }

    // BK-8: no requestId — return 402 with payment challenge
    const newRequest = paymentService.createRequest(validatedAccountId, validatedNetwork);
    const challenge = buildChallenge(newRequest, validatedAccountId);
    return reply.code(402).send({ success: false, data: challenge });
  } catch (error) {
    const err = error as Error;
    logger.error({ error: err, accountId }, 'Paid score route failed');

    if (err.message.includes('Invalid Stellar')) {
      return reply.code(400).send({ success: false, error: 'Invalid account ID format' });
    }

    return reply.code(503).send({ success: false, error: err.message });
  }
}

export async function registerPaidRoutes(fastify: FastifyInstance) {
  fastify.get('/paid/wallet/:accountId', paidScoreRoute);
}
