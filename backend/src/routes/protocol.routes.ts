import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { appConfig } from '../config/app.config.js';
import { validateNetwork } from '../utils/validators.js';
import { logger } from '../utils/logger.js';
import {
  getAlerts,
  getCohorts,
  getHealthMetrics,
  getRiskHeatmap,
} from '../services/protocol.service.js';

const DEFAULT_NETWORK = appConfig.stellarNetwork;

interface ProtocolQuery {
  network?: string;
  windowHours?: string;
  lookbackHours?: string;
}

function parsePositiveInt(input: string | undefined, fallback: number, max = 24 * 365): number {
  if (!input) return fallback;
  const n = parseInt(input, 10);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.min(n, max);
}

export async function registerProtocolRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/protocol/health',
    async (request: FastifyRequest<{ Querystring: ProtocolQuery }>, reply: FastifyReply) => {
      try {
        const network = validateNetwork(request.query.network ?? DEFAULT_NETWORK);
        const windowHours = parsePositiveInt(request.query.windowHours, 24 * 30);
        const data = await getHealthMetrics(network, windowHours);
        return reply.send({ success: true, data });
      } catch (error) {
        const err = error as Error;
        logger.error({ error: err }, 'Protocol health route failed');
        return reply.code(400).send({ success: false, error: err.message });
      }
    }
  );

  fastify.get(
    '/protocol/cohorts',
    async (request: FastifyRequest<{ Querystring: ProtocolQuery }>, reply: FastifyReply) => {
      try {
        const network = validateNetwork(request.query.network ?? DEFAULT_NETWORK);
        const data = await getCohorts(network);
        return reply.send({ success: true, data });
      } catch (error) {
        const err = error as Error;
        logger.error({ error: err }, 'Protocol cohorts route failed');
        return reply.code(400).send({ success: false, error: err.message });
      }
    }
  );

  fastify.get(
    '/protocol/risk-heatmap',
    async (request: FastifyRequest<{ Querystring: ProtocolQuery }>, reply: FastifyReply) => {
      try {
        const network = validateNetwork(request.query.network ?? DEFAULT_NETWORK);
        const data = await getRiskHeatmap(network);
        return reply.send({ success: true, data });
      } catch (error) {
        const err = error as Error;
        logger.error({ error: err }, 'Protocol risk-heatmap route failed');
        return reply.code(400).send({ success: false, error: err.message });
      }
    }
  );

  fastify.get(
    '/protocol/alerts',
    async (request: FastifyRequest<{ Querystring: ProtocolQuery }>, reply: FastifyReply) => {
      try {
        const network = validateNetwork(request.query.network ?? DEFAULT_NETWORK);
        const lookbackHours = parsePositiveInt(request.query.lookbackHours, 24);
        const data = await getAlerts(network, lookbackHours);
        return reply.send({ success: true, data });
      } catch (error) {
        const err = error as Error;
        logger.error({ error: err }, 'Protocol alerts route failed');
        return reply.code(400).send({ success: false, error: err.message });
      }
    }
  );
}
