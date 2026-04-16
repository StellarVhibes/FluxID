#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Symbol, Vec};

#[contracttype]
pub enum DataKey {
    Admin,
    Network,
    Score(Address),
    LastUpdated(Address),
    RiskLevel(Address),
}

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
#[contracttype]
pub enum RiskLevel {
    Low,
    Medium,
    High,
}

#[contracttype]
pub struct WalletScore {
    pub score: u32,
    pub risk: RiskLevel,
    pub last_updated: u64,
}

#[contract]
pub struct LiquidityIdentity;

#[contractimpl]
impl LiquidityIdentity {
    pub fn init(env: Env, admin: Address, network: Symbol) {
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Network, &network);
    }

    pub fn set_score(env: Env, admin: Address, wallet: Address, score: u32, risk: RiskLevel) {
        admin.require_auth();

        let stored_admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .unwrap_or_else(|| panic!("Admin not set"));

        if admin != stored_admin {
            panic!("Unauthorized: only admin can set scores");
        }

        if score > 100 {
            panic!("Score must be between 0 and 100");
        }

        let timestamp = env.ledger().timestamp();

        env.storage()
            .persistent()
            .set(&DataKey::Score(wallet.clone()), &score);
        env.storage()
            .persistent()
            .set(&DataKey::RiskLevel(wallet.clone()), &risk);
        env.storage()
            .persistent()
            .set(&DataKey::LastUpdated(wallet.clone()), &timestamp);
    }

    pub fn get_score(env: Env, wallet: Address) -> u32 {
        env.storage()
            .persistent()
            .get(&DataKey::Score(wallet))
            .unwrap_or(0)
    }

    pub fn get_risk(env: Env, wallet: Address) -> Option<RiskLevel> {
        env.storage().persistent().get(&DataKey::RiskLevel(wallet))
    }

    pub fn get_wallet_info(env: Env, wallet: Address) -> Option<WalletScore> {
        let score: Option<u32> = env
            .storage()
            .persistent()
            .get(&DataKey::Score(wallet.clone()));
        let risk: Option<RiskLevel> = env
            .storage()
            .persistent()
            .get(&DataKey::RiskLevel(wallet.clone()));
        let last_updated: Option<u64> = env
            .storage()
            .persistent()
            .get(&DataKey::LastUpdated(wallet));

        match (score, risk, last_updated) {
            (Some(s), Some(r), Some(t)) => Some(WalletScore {
                score: s,
                risk: r,
                last_updated: t,
            }),
            _ => None,
        }
    }

    pub fn get_last_updated(env: Env, wallet: Address) -> Option<u64> {
        env.storage()
            .persistent()
            .get(&DataKey::LastUpdated(wallet))
    }

    pub fn get_admin(env: Env) -> Address {
        env.storage()
            .instance()
            .get(&DataKey::Admin)
            .unwrap_or_else(|| panic!("Admin not set"))
    }

    pub fn get_network(env: Env) -> Symbol {
        env.storage()
            .instance()
            .get(&DataKey::Network)
            .unwrap_or_else(|| panic!("Network not set"))
    }

    pub fn transfer_admin(env: Env, admin: Address, new_admin: Address) {
        admin.require_auth();

        let stored_admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .unwrap_or_else(|| panic!("Admin not set"));

        if admin != stored_admin {
            panic!("Unauthorized: only current admin can transfer");
        }

        env.storage().instance().set(&DataKey::Admin, &new_admin);
    }

    pub fn get_all_wallets_with_scores(env: Env, wallets: Vec<Address>) -> Vec<WalletScore> {
        let mut results: Vec<WalletScore> = Vec::new(&env);

        for wallet in wallets.iter() {
            if let Some(info) = Self::get_wallet_info(env.clone(), wallet.clone()) {
                results.push_back(info);
            }
        }

        results
    }
}

mod test;
