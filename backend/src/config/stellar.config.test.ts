import { describe, it, expect } from 'vitest';
import { getStellarConfig, STELLAR_CONFIGS } from './stellar.config.js';

describe('Stellar Config', () => {
  it('should use valid soroban RPC endpoints for testnet and mainnet', () => {
    const testnetConfig = getStellarConfig('testnet');
    expect(testnetConfig.rpcUrl).toContain('soroban-testnet.stellar.org');

    const mainnetConfig = getStellarConfig('mainnet');
    expect(mainnetConfig.rpcUrl).toContain('soroban-mainnet.stellar.org');
  });

  it('should not contain dead rpc.testnet or rpc.mainnet hostnames', () => {
    expect(STELLAR_CONFIGS.testnet.rpcUrl).not.toBe('https://rpc.testnet.stellar.org');
    expect(STELLAR_CONFIGS.mainnet.rpcUrl).not.toBe('https://rpc.mainnet.stellar.org');
  });
});
