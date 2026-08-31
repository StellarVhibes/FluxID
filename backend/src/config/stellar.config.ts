import { Networks } from '@stellar/stellar-sdk';

export type NetworkType = 'mainnet' | 'testnet';

export interface StellarConfig {
  horizonUrl: string;
  rpcUrl: string;
  networkPassphrase: string;
  contractId?: string;
}

export const STELLAR_CONFIGS: Record<NetworkType, StellarConfig> = {
  mainnet: {
    horizonUrl: process.env.MAINNET_HORIZON_URL || 'https://horizon.stellar.org',
    rpcUrl: process.env.MAINNET_RPC_URL || 'https://soroban-mainnet.stellar.org',
    networkPassphrase: Networks.PUBLIC,
    contractId: process.env.MAINNET_CONTRACT_ID,
  },
  testnet: {
    horizonUrl: process.env.TESTNET_HORIZON_URL || 'https://horizon-testnet.stellar.org',
    rpcUrl: process.env.TESTNET_RPC_URL || process.env.SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org',
    networkPassphrase: Networks.TESTNET,
    contractId: process.env.TESTNET_CONTRACT_ID,
  },
};

export function getStellarConfig(network: NetworkType = 'testnet'): StellarConfig {
  return STELLAR_CONFIGS[network];
}
