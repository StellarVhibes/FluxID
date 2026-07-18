#!/bin/bash
set -e

# FluxID Testnet Automated Deployment Script
# This script compiles, deploys, and initializes both the OracleRegistry
# and LiquidityIdentity contracts sequentially to the Stellar Testnet.

# Ensure we are in the correct directory
cd "$(dirname "$0")"

echo "=========================================="
echo "🚀 FluxID Smart Contract Deployer"
echo "=========================================="

echo "[1/6] Adding WebAssembly target..."
rustup target add wasm32v1-none

echo "[2/6] Compiling contracts..."
cargo build --target wasm32v1-none --release

echo "[3/6] Deploying OracleRegistry to Testnet..."
ORACLE_REGISTRY_ID=$(stellar contract deploy \
  --wasm target/wasm32v1-none/release/oracle_registry.wasm \
  --source fluxid-admin \
  --network testnet)
echo "✅ OracleRegistry deployed at: $ORACLE_REGISTRY_ID"

echo "[4/6] Deploying LiquidityIdentity to Testnet..."
LIQUIDITY_IDENTITY_ID=$(stellar contract deploy \
  --wasm target/wasm32v1-none/release/liquidity_identity.wasm \
  --source fluxid-admin \
  --network testnet)
echo "✅ LiquidityIdentity deployed at: $LIQUIDITY_IDENTITY_ID"

# Get the admin's public key
ADMIN_PUBKEY=$(stellar keys address fluxid-admin)

echo "[5/6] Initializing Contracts..."
# Initialize Oracle Registry
stellar contract invoke \
  --id "$ORACLE_REGISTRY_ID" \
  --source fluxid-admin \
  --network testnet \
  -- init \
  --admin "$ADMIN_PUBKEY"

# Initialize Liquidity Identity
stellar contract invoke \
  --id "$LIQUIDITY_IDENTITY_ID" \
  --source fluxid-admin \
  --network testnet \
  -- init \
  --admin "$ADMIN_PUBKEY" \
  --network testnet

echo "[6/6] Linking Contracts & Whitelisting Oracles..."
# Link the OracleRegistry to LiquidityIdentity
stellar contract invoke \
  --id "$LIQUIDITY_IDENTITY_ID" \
  --source fluxid-admin \
  --network testnet \
  -- set_oracle_registry \
  --admin "$ADMIN_PUBKEY" \
  --registry_id "$ORACLE_REGISTRY_ID"

# Whitelist the backend wallet as an authorized oracle
stellar contract invoke \
  --id "$ORACLE_REGISTRY_ID" \
  --source fluxid-admin \
  --network testnet \
  -- add_oracle \
  --admin "$ADMIN_PUBKEY" \
  --oracle "$ADMIN_PUBKEY"

echo "=========================================="
echo "🎉 Deployment Complete!"
echo "OracleRegistry: $ORACLE_REGISTRY_ID"
echo "LiquidityIdentity: $LIQUIDITY_IDENTITY_ID"
echo "=========================================="
