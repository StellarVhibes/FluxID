import dotenv from 'dotenv';

dotenv.config();

export const appConfig = {
  port: parseInt(process.env.PORT || '8000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  stellarNetwork: (process.env.STELLAR_NETWORK || 'testnet') as 'mainnet' | 'testnet',
  cacheTtlSeconds: parseInt(process.env.CACHE_TTL_SECONDS || '60', 10),
  horizonTimeout: parseInt(process.env.HORIZON_TIMEOUT || '30000', 10),
};
