import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { createContractService } from '../services/contract.service.js';
import { validateAccountId, validateNetwork } from '../utils/validators.js';
import { logger } from '../utils/logger.js';

interface OnChainParams {
  wallet: string;
}

interface OnChainQuery {
  network?: string;
}

interface BatchBody {
  wallets?: unknown;
  network?: string;
  mode?: 'per-wallet' | 'contract';
}

const MAX_BATCH_SIZE = 50;

export async function onChainScoreRoute(
  request: FastifyRequest<{ Params: OnChainParams; Querystring: OnChainQuery }>,
  reply: FastifyReply
) {
  const { wallet } = request.params;
  const { network = 'testnet' } = request.query;

  try {
    const validatedWallet = validateAccountId(wallet);
    const validatedNetwork = validateNetwork(network);

    const contractService = createContractService(validatedNetwork);
    const info = await contractService.getWalletInfo(validatedWallet);

    if (!info) {
      return reply.code(404).send({
        success: false,
        error: 'No on-chain score for this wallet. It may not have been synced yet.',
        data: { wallet: validatedWallet, onChain: false },
      });
    }

    return reply.send({ success: true, data: info });
  } catch (error) {
    const err = error as Error;
    logger.error({ error: err, wallet }, 'Failed to read on-chain score');

    if (err.message.includes('Invalid Stellar')) {
      return reply.code(400).send({ success: false, error: 'Invalid wallet address format' });
    }
    return reply.code(503).send({ success: false, error: err.message });
  }
}

export async function onChainBatchRoute(
  request: FastifyRequest<{ Body: BatchBody }>,
  reply: FastifyReply
) {
  const { wallets, network = 'testnet', mode = 'per-wallet' } = request.body || {};

  if (!Array.isArray(wallets) || wallets.length === 0) {
    return reply.code(400).send({
      success: false,
      error: 'Body must include a non-empty "wallets" array of Stellar addresses.',
    });
  }

  if (wallets.length > MAX_BATCH_SIZE) {
    return reply.code(400).send({
      success: false,
      error: `Batch size cannot exceed ${MAX_BATCH_SIZE} wallets per request.`,
    });
  }

  try {
    const validatedNetwork = validateNetwork(network);
    const validated: string[] = [];
    const invalid: string[] = [];
    for (const w of wallets) {
      if (typeof w !== 'string') {
        invalid.push(String(w));
        continue;
      }
      try {
        validated.push(validateAccountId(w));
      } catch {
        invalid.push(w);
      }
    }

    if (validated.length === 0) {
      return reply.code(400).send({
        success: false,
        error: 'No valid Stellar addresses provided.',
        data: { invalid },
      });
    }

    const contractService = createContractService(validatedNetwork);

    if (mode === 'contract') {
      // Single-RPC path via the contract's get_all_wallets_with_scores.
      // Results lack wallet-address mapping, so we cannot identify which wallets
      // from the input are missing. Use per-wallet mode when that matters.
      const raw = await contractService.getAllWalletsWithScoresRaw(validated);
      return reply.send({
        success: true,
        data: {
          network: validatedNetwork,
          mode: 'contract',
          requested: validated.length,
          foundCount: raw.length,
          invalidCount: invalid.length,
          results: raw,
          invalid,
          note:
            'Mode "contract" uses the on-chain batch function. Results lack per-wallet mapping; wallets without data are silently omitted.',
        },
      });
    }

    const results = await contractService.getBatchWalletScores(validated);
    const found = results.filter((r) => r.info !== null);
    const missing = results.filter((r) => r.info === null).map((r) => r.wallet);

    return reply.send({
      success: true,
      data: {
        network: validatedNetwork,
        mode: 'per-wallet',
        requested: validated.length,
        foundCount: found.length,
        missingCount: missing.length,
        invalidCount: invalid.length,
        results: found.map((r) => r.info),
        missing,
        invalid,
      },
    });
  } catch (error) {
    const err = error as Error;
    logger.error({ error: err }, 'Failed batch on-chain read');
    return reply.code(503).send({ success: false, error: err.message });
  }
}

export async function registerOnChainRoutes(fastify: FastifyInstance) {
  fastify.get('/onchain/score/:wallet', onChainScoreRoute);
  fastify.post('/onchain/batch', onChainBatchRoute);
}
