import type { NetworkType } from '../config/stellar.config.js';
import { getStellarConfig } from '../config/stellar.config.js';
import type { HorizonPayment, HorizonTransaction, PaymentData } from '../types/stellar.types.js';
import { logger } from '../utils/logger.js';
import { appConfig } from '../config/app.config.js';

export class HorizonService {
  private horizonUrl: string;

  constructor(network: NetworkType = 'testnet') {
    const config = getStellarConfig(network);
    this.horizonUrl = config.horizonUrl;
  }

  private async fetchWithRetry<T>(
    url: string,
    retries = 3,
    delayMs = 1000
  ): Promise<T> {
    let lastError: Error | null = null;
    
    for (let i = 0; i < retries; i++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), appConfig.horizonTimeout);
        
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (response.status === 429 && i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, delayMs * (i + 1)));
          continue;
        }

        if (!response.ok) {
          throw new Error(`Horizon API error: ${response.status} ${response.statusText}`);
        }

        return await response.json() as T;
      } catch (error) {
        lastError = error as Error;
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, delayMs * (i + 1)));
        }
      }
    }

    throw lastError || new Error('Failed to fetch from Horizon');
  }

  async getAccountPayments(accountId: string, limit = 200): Promise<PaymentData[]> {
    const url = `${this.horizonUrl}/accounts/${accountId}/payments?limit=${limit}&order=desc`;
    
    try {
      const data = await this.fetchWithRetry<{ _embedded: { records: HorizonPayment[] } }>(url);
      const records = data._embedded?.records || [];

      return records
        .filter((p): p is HorizonPayment & { asset_type: string } => 
          p.asset_type === 'native' || p.asset_type === 'credit_alphanum4' || p.asset_type === 'credit_alphanum12'
        )
        .map((payment) => ({
          id: payment.id,
          from: payment.from,
          to: payment.to,
          amount: parseFloat(payment.amount),
          asset: payment.asset_type === 'native' ? 'XLM' : `${payment.asset_code}:${payment.asset_issuer}`,
          timestamp: new Date(payment.created_at),
          isIncoming: payment.to === accountId,
        }));
    } catch (error) {
      logger.error({ error, accountId }, 'Failed to fetch payments');
      throw error;
    }
  }

  async getAccountTransactions(accountId: string, limit = 200): Promise<HorizonTransaction[]> {
    const url = `${this.horizonUrl}/accounts/${accountId}/transactions?limit=${limit}&order=desc`;
    
    try {
      const data = await this.fetchWithRetry<{ _embedded: { records: HorizonTransaction[] } }>(url);
      return data._embedded?.records || [];
    } catch (error) {
      logger.error({ error, accountId }, 'Failed to fetch transactions');
      throw error;
    }
  }

  async getAccountBalance(accountId: string): Promise<number> {
    const url = `${this.horizonUrl}/accounts/${accountId}`;
    
    try {
      const data = await this.fetchWithRetry<{ 
        balances: Array<{ asset_type: string; balance: string }> 
      }>(url);
      
      const xlmBalance = data.balances?.find(b => b.asset_type === 'native');
      return xlmBalance ? parseFloat(xlmBalance.balance) : 0;
    } catch (error) {
      logger.error({ error, accountId }, 'Failed to fetch account balance');
      return 0;
    }
  }
}

export function createHorizonService(network: NetworkType = 'testnet'): HorizonService {
  return new HorizonService(network);
}
