export const STELLAR_CONFIG = {
  HORIZON_URL: "https://horizon-testnet.stellar.org",
  SOROBAN_RPC_URL: "https://soroban-testnet.stellar.org",
  NETWORK_PASSPHRASE: "Test SDF Network ; September 2015",
};

// Deployer / admin wallet. Gates the /dashboard/admin page and its sidebar link.
// Overridable per-environment via NEXT_PUBLIC_ADMIN_ADDRESS.
export const ADMIN_ADDRESS =
  process.env.NEXT_PUBLIC_ADMIN_ADDRESS ||
  "GCSRZYJFQM52LSIJ4QSDK4IOHMW7PYGMUQBGWZGZSPCSIV2Y7MTVA2V3";

