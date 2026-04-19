import Fastify from 'fastify';
import cors from '@fastify/cors';
import { appConfig } from './config/app.config.js';
import { healthRoute } from './routes/health.routes.js';
import { registerScoreRoutes } from './routes/score.routes.js';
import { registerPaymentRoutes } from './routes/contract.routes.js';
import { registerPaidRoutes } from './routes/paid.routes.js';
import { registerMcpRoutes } from './routes/mcp.routes.js';
import { registerOnChainRoutes } from './routes/onchain.routes.js';
import { logger } from './utils/logger.js';

export async function buildServer() {
  const fastify = Fastify({
    logger: false,
  });

  await fastify.register(cors, {
    origin: true,
  });

  fastify.get('/', async () => ({
    name: 'FluxID Backend',
    description: 'Liquidity Identity scoring service — turn any Stellar wallet into a trust score.',
    status: 'ok',
    network: appConfig.stellarNetwork,
    endpoints: {
      health: 'GET /health',
      score: 'GET /score/:accountId?network=&refresh=&sync=',
      syncScore: 'POST /score/:accountId/sync',
      scoreHistory: 'GET /score/:accountId/history?limit=&since=',
      onChainScore: 'GET /onchain/score/:wallet',
      onChainBatch: 'POST /onchain/batch  body: { wallets: string[], mode?: "per-wallet" | "contract" }',
      paidScore: 'GET /paid/score/:accountId?requestId=',
      mcpTools: 'GET /mcp/tools',
      mcpInvoke: 'POST /mcp/tools/call  body: { name, arguments }',
    },
    docs: 'See README.md and docs/ in the repo for full usage.',
  }));

  fastify.get('/health', healthRoute);
  await registerScoreRoutes(fastify);
  await registerPaymentRoutes(fastify);
  await registerPaidRoutes(fastify);
  await registerMcpRoutes(fastify);
  await registerOnChainRoutes(fastify);

  fastify.setErrorHandler((error, _request, reply) => {
    logger.error({ error }, 'Unhandled error');

    const statusCode = error.statusCode || 500;
    reply.code(statusCode).send({
      success: false,
      error: statusCode === 500 ? 'Internal server error' : error.message,
    });
  });

  return fastify;
}

export async function startServer() {
  const fastify = await buildServer();

  try {
    await fastify.listen({ port: appConfig.port, host: '0.0.0.0' });
    logger.info(`FluxID Backend running on http://0.0.0.0:${appConfig.port}`);
    logger.info(`Network: ${appConfig.stellarNetwork}`);
  } catch (err) {
    logger.error(err, 'Failed to start server');
    process.exit(1);
  }

  return fastify;
}

startServer().catch((err) => {
  logger.error(err, 'Failed to start server');
  process.exit(1);
});
