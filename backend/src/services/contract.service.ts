import {
  Address,
  Contract,
  Keypair,
  Networks,
  Operation,
  TransactionBuilder,
  nativeToScVal,
  xdr,
  rpc,
  BASE_FEE,
} from '@stellar/stellar-sdk';
import type { NetworkType } from '../config/stellar.config.js';
import { getStellarConfig } from '../config/stellar.config.js';
import type { ContractSyncResult } from '../types/contract.types.js';
import { logger } from '../utils/logger.js';

const RISK_VARIANT: Record<'Low' | 'Medium' | 'High', string> = {
  Low: 'Low',
  Medium: 'Medium',
  High: 'High',
};

function riskToScVal(risk: 'Low' | 'Medium' | 'High'): xdr.ScVal {
  return xdr.ScVal.scvVec([xdr.ScVal.scvSymbol(RISK_VARIANT[risk])]);
}

export class ContractService {
  private network: NetworkType;
  private networkPassphrase: string;
  private rpcUrl: string;
  private contractId?: string;
  private adminSecret?: string;

  constructor(network: NetworkType = 'testnet') {
    const config = getStellarConfig(network);
    this.network = network;
    this.networkPassphrase = config.networkPassphrase;
    this.rpcUrl = config.rpcUrl;
    this.contractId = config.contractId;
    this.adminSecret = process.env.ADMIN_SECRET_KEY;
  }

  private isConfigured(): boolean {
    return Boolean(this.contractId && this.adminSecret);
  }

  async syncScore(
    wallet: string,
    score: number,
    risk: 'Low' | 'Medium' | 'High'
  ): Promise<ContractSyncResult> {
    if (!this.isConfigured()) {
      logger.info(
        { wallet, score, risk, network: this.network },
        'Contract sync skipped (contractId or ADMIN_SECRET_KEY not configured)'
      );
      return { success: false, error: 'Contract not configured' };
    }

    try {
      const server = new rpc.Server(this.rpcUrl, { allowHttp: this.rpcUrl.startsWith('http://') });
      const admin = Keypair.fromSecret(this.adminSecret as string);
      const contract = new Contract(this.contractId as string);

      const account = await server.getAccount(admin.publicKey());

      const args: xdr.ScVal[] = [
        new Address(admin.publicKey()).toScVal(),
        new Address(wallet).toScVal(),
        nativeToScVal(score, { type: 'u32' }),
        riskToScVal(risk),
      ];

      const baseTx = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(contract.call('set_score', ...args))
        .setTimeout(60)
        .build();

      const prepared = await server.prepareTransaction(baseTx);
      prepared.sign(admin);

      const sendResult = await server.sendTransaction(prepared);

      if (sendResult.status === 'ERROR') {
        const errMsg = JSON.stringify(sendResult.errorResult ?? sendResult);
        logger.error({ wallet, errMsg }, 'Contract sync send failed');
        return { success: false, error: `Send failed: ${errMsg}` };
      }

      let status = sendResult.status as string;
      let attempts = 0;
      let getResult: Awaited<ReturnType<typeof server.getTransaction>> | null = null;
      while (status === 'PENDING' && attempts < 20) {
        await new Promise((r) => setTimeout(r, 1500));
        getResult = await server.getTransaction(sendResult.hash);
        status = getResult.status;
        attempts += 1;
      }

      if (status === 'SUCCESS') {
        logger.info({ wallet, score, risk, txHash: sendResult.hash }, 'Contract score synced');
        return { success: true, txHash: sendResult.hash };
      }

      logger.warn({ wallet, status, txHash: sendResult.hash }, 'Contract sync did not confirm');
      return { success: false, txHash: sendResult.hash, error: `Final status: ${status}` };
    } catch (error) {
      const err = error as Error;
      logger.error({ error: err.message, wallet }, 'Contract sync threw');
      return { success: false, error: err.message };
    }
  }
}

export function createContractService(network: NetworkType = 'testnet'): ContractService {
  return new ContractService(network);
}
