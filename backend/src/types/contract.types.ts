import type { NetworkType } from '../config/stellar.config.js';

export interface ContractConfig {
  network: NetworkType;
  contractId: string;
}

export interface ContractScorePayload {
  wallet: string;
  score: number;
  risk: 'Low' | 'Medium' | 'High';
}

export interface ContractSyncResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

export interface OnChainWalletInfo {
  wallet: string;
  score: number;
  risk: 'Low' | 'Medium' | 'High';
  lastUpdated: number;
  onChain: true;
}
