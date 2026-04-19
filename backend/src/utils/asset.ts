export type AssetKind = 'XLM' | 'USDC' | 'OTHER';

export interface ClassifiedAsset {
  kind: AssetKind;
  code: string;
  issuer?: string;
  label: string;
}

// Canonical Circle/Centre USDC issuer on Stellar mainnet.
// On testnet, USDC issuers vary (SDF test issuer), so we fall back to matching by code.
export const MAINNET_USDC_ISSUER = 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN';

export function classifyAsset(assetString: string): ClassifiedAsset {
  if (!assetString || assetString === 'XLM' || assetString === 'native') {
    return { kind: 'XLM', code: 'XLM', label: 'XLM' };
  }

  const [code, issuer] = assetString.split(':');

  if (code === 'USDC') {
    return {
      kind: 'USDC',
      code,
      issuer,
      label: 'USDC',
    };
  }

  return {
    kind: 'OTHER',
    code,
    issuer,
    label: issuer ? `${code}:${issuer.slice(0, 4)}…${issuer.slice(-4)}` : code,
  };
}
