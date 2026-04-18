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
