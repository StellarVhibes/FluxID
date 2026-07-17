.PHONY: build test fmt clean deploy-testnet deploy-mainnet init-testnet init-mainnet

build:
	rustup target add wasm32v1-none
	cargo build --target wasm32v1-none --release

test:
	cargo test

fmt:
	cargo fmt

clean:
	cargo clean

# Deploy to Testnet
deploy-testnet:
	@echo "Deploying to Testnet..."
	/tmp/stellar contract deploy \
		--wasm target/wasm32v1-none/release/liquidity_identity.wasm \
		--source fluxid-admin \
		--network testnet \
		--rpc-url "https://soroban-testnet.stellar.org" \
		--network-passphrase "Test SDF Network ; September 2015"

# Deploy to Mainnet
deploy-mainnet:
	@echo "Deploying to Mainnet..."
	/tmp/stellar contract deploy \
		--wasm target/wasm32v1-none/release/liquidity_identity.wasm \
		--source fluxid-admin \
		--network mainnet \
		--rpc-url "https://soroban-rpc.mainnet.stellar.org" \
		--network-passphrase "Public Global Stellar Network ; September 2015"

# Initialize contract on Testnet (replace CONTRACT_ID)
init-testnet:
	/tmp/stellar contract invoke \
		--id CONTRACT_ID \
		--source fluxid-admin \
		--network testnet \
		--rpc-url "https://soroban-testnet.stellar.org" \
		--network-passphrase "Test SDF Network ; September 2015" \
		-- init \
		--admin GBACI4PCHZQXZFAADCMG4TICARUDZAGF5CI3A4RPTD7SOSW2VPKLGDCX \
		--network testnet

# Initialize contract on Mainnet
init-mainnet:
	/tmp/stellar contract invoke \
		--id CONTRACT_ID \
		--source fluxid-admin \
		--network mainnet \
		--rpc-url "https://rpc.lightsail.network/" \
		--network-passphrase "Public Global Stellar Network ; September 2015" \
		-- init \
		--admin GBACI4PCHZQXZFAADCMG4TICARUDZAGF5CI3A4RPTD7SOSW2VPKLGDCX \
		--network mainnet
