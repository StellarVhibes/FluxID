import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { createHorizonService } from '../services/horizon.service.js';
import { validateAccountId, validateNetwork } from '../utils/validators.js';

interface PaymentParams {
  accountId: string;
}

interface PaymentQuery {
  network?: string;
  limit?: string;
}

interface TransactionParams {
  accountId: string;
}

interface TransactionQuery {
  network?: string;
  limit?: string;
}

export async function paymentsRoute(request: FastifyRequest<{ Params: PaymentParams; Querystring: PaymentQuery }>, reply: FastifyReply) {
  const { accountId } = request.params;
  const { network = 'testnet', limit = '200' } = request.query;

  try {
    const validatedAccountId = validateAccountId(accountId);
    const validatedNetwork = validateNetwork(network);
    const limitNum = Math.min(parseInt(limit, 10) || 200, 200);

    const horizonService = createHorizonService(validatedNetwork);
    const payments = await horizonService.getAccountPayments(validatedAccountId, limitNum);

    return reply.send({
      success: true,
      data: {
        accountId: validatedAccountId,
        payments,
        count: payments.length,
      },
    });
  } catch (error) {
    const err = error as Error;
    if (err.message.includes('Invalid Stellar')) {
      return reply.code(400).send({
        success: false,
        error: 'Invalid account ID format',
      });
    }

    return reply.code(503).send({
      success: false,
      error: 'Failed to fetch payments from Stellar network',
    });
  }
}

export async function transactionsRoute(request: FastifyRequest<{ Params: TransactionParams; Querystring: TransactionQuery }>, reply: FastifyReply) {
  const { accountId } = request.params;
  const { network = 'testnet', limit = '200' } = request.query;

  try {
    const validatedAccountId = validateAccountId(accountId);
    const validatedNetwork = validateNetwork(network);
    const limitNum = Math.min(parseInt(limit, 10) || 200, 200);

    const horizonService = createHorizonService(validatedNetwork);
    const transactions = await horizonService.getAccountTransactions(validatedAccountId, limitNum);

    return reply.send({
      success: true,
      data: {
        accountId: validatedAccountId,
        transactions,
        count: transactions.length,
      },
    });
  } catch (error) {
    const err = error as Error;
    if (err.message.includes('Invalid Stellar')) {
      return reply.code(400).send({
        success: false,
        error: 'Invalid account ID format',
      });
    }

    return reply.code(503).send({
      success: false,
      error: 'Failed to fetch transactions from Stellar network',
    });
  }
}

export async function registerPaymentRoutes(fastify: FastifyInstance) {
  fastify.get('/payments/:accountId', paymentsRoute);
  fastify.get('/transactions/:accountId', transactionsRoute);
}
