import type { NetworkType } from '../config/stellar.config.js';
import type { ContractSyncResult } from '../types/contract.types.js';
import { logger } from '../utils/logger.js';

export class ContractService {
  private network: NetworkType;

  constructor(network: NetworkType = 'testnet') {
    this.network = network;
    logger.info({ network }, 'Contract service initialized (stub mode - no actual blockchain interaction)');
  }

  async syncScore(_wallet: string, _score: number, _risk: 'Low' | 'Medium' | 'High'): Promise<ContractSyncResult> {
    logger.info({ wallet: _wallet, score: _score, risk: _risk }, 'Contract sync called (stub)');
    
    return {
      success: true,
      txHash: undefined,
    };
  }
}

export function createContractService(network: NetworkType = 'testnet'): ContractService {
  return new ContractService(network);
}
