import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { createHorizonService } from '../services/horizon.service.js';
import { calculateWalletScore } from '../services/scoring.service.js';
import { cacheService } from '../services/cache.service.js';
import { generateExplanation } from '../services/explainability/index.js';
import { validateAccountId, validateNetwork } from '../utils/validators.js';
import { logger } from '../utils/logger.js';

const ANALYZE_WALLET_TOOL = {
  name: 'analyze_wallet',
  description:
    'Analyze a Stellar wallet and return its FluxID liquidity score (0-100), ' +
    'risk level (Low/Medium/High), human-readable explanation (insight + suggestions), ' +
    'and full metrics. Use this to assess a wallet\'s financial reliability.',
  input_schema: {
    type: 'object',
    properties: {
      wallet_address: {
        type: 'string',
        description: 'Stellar public key (starts with G, 56 characters).',
      },
      network: {
        type: 'string',
        enum: ['testnet', 'mainnet'],
        description: 'Stellar network to query. Defaults to testnet.',
      },
    },
    required: ['wallet_address'],
  },
};

interface AnalyzeWalletBody {
  wallet_address?: string;
  network?: string;
}

interface ToolCallBody {
  name?: string;
  arguments?: AnalyzeWalletBody;
}

async function analyzeWallet(body: AnalyzeWalletBody) {
  const accountId = validateAccountId(body.wallet_address);
  const network = validateNetwork(body.network ?? 'testnet');

  const cached = cacheService.get(accountId, network);
  const result =
    cached ??
    (await (async () => {
      const horizonService = createHorizonService(network);
      const r = await calculateWalletScore(accountId, network, horizonService);
      cacheService.set(accountId, network, r);
      return r;
    })());

  const explanation = await generateExplanation(result);
  return { ...result, explanation };
}

export async function mcpToolsRoute(_request: FastifyRequest, reply: FastifyReply) {
  return reply.send({
    tools: [ANALYZE_WALLET_TOOL],
  });
}

export async function mcpAnalyzeWalletRoute(
  request: FastifyRequest<{ Body: AnalyzeWalletBody }>,
  reply: FastifyReply
) {
  try {
    const result = await analyzeWallet(request.body || {});
    return reply.send({
      success: true,
      tool: 'analyze_wallet',
      result,
    });
  } catch (error) {
    const err = error as Error;
    logger.error({ error: err }, 'MCP analyze_wallet failed');

    if (err.message.includes('Invalid Stellar') || err.message.includes('accountId must be')) {
      return reply.code(400).send({
        success: false,
        tool: 'analyze_wallet',
        error: err.message,
      });
    }

    if (err.message.includes('Horizon API error: 404')) {
      return reply.code(404).send({
        success: false,
        tool: 'analyze_wallet',
        error: 'Account not found on Stellar network',
      });
    }

    return reply.code(503).send({
      success: false,
      tool: 'analyze_wallet',
      error: err.message,
    });
  }
}

// Generic tool dispatcher — lets agents call /mcp/tools/call with { name, arguments }
export async function mcpCallRoute(
  request: FastifyRequest<{ Body: ToolCallBody }>,
  reply: FastifyReply
) {
  const { name, arguments: args } = request.body || {};

  if (name !== 'analyze_wallet') {
    return reply.code(404).send({
      success: false,
      error: `Unknown tool: ${name}. Available: analyze_wallet.`,
    });
  }

  try {
    const result = await analyzeWallet(args || {});
    return reply.send({ success: true, tool: name, result });
  } catch (error) {
    const err = error as Error;
    if (err.message.includes('Invalid Stellar') || err.message.includes('accountId must be')) {
      return reply.code(400).send({ success: false, tool: name, error: err.message });
    }
    return reply.code(503).send({ success: false, tool: name, error: err.message });
  }
}

export async function registerMcpRoutes(fastify: FastifyInstance) {
  fastify.get('/mcp/tools', mcpToolsRoute);
  fastify.post('/mcp/tools/analyze_wallet', mcpAnalyzeWalletRoute);
  fastify.post('/mcp/tools/call', mcpCallRoute);
}
