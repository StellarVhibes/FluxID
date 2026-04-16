import { StrKey } from '@stellar/stellar-sdk';

export function isValidStellarPublicKey(publicKey: string): boolean {
  try {
    return StrKey.isValidEd25519PublicKey(publicKey);
  } catch {
    return false;
  }
}

export function isValidNetwork(network: string): network is 'mainnet' | 'testnet' {
  return network === 'mainnet' || network === 'testnet';
}

export function validateAccountId(accountId: unknown): string {
  if (typeof accountId !== 'string') {
    throw new Error('accountId must be a string');
  }
  if (!isValidStellarPublicKey(accountId)) {
    throw new Error('Invalid Stellar public key format');
  }
  return accountId;
}

export function validateNetwork(network: unknown): 'mainnet' | 'testnet' {
  if (typeof network !== 'string') {
    return 'testnet';
  }
  if (!isValidNetwork(network)) {
    throw new Error('Invalid network. Must be "mainnet" or "testnet"');
  }
  return network;
}
