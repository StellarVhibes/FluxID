#![cfg(test)]
use super::*;
use soroban_sdk::{symbol_short, testutils::Address as _};

fn setup() -> (Env, Address, Address) {
    let env = Env::default();
    let admin = Address::generate(&env);
    let contract_id = env.register(LiquidityIdentity, ());
    (env, admin, contract_id)
}

#[test]
fn test_constructor() {
    let (env, admin, contract_id) = setup();
    env.mock_all_auths();

    let client = LiquidityIdentityClient::new(&env, &contract_id);
    client.init(&admin, &symbol_short!("testnet"));

    env.as_contract(&contract_id, || {
        let stored_admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        assert_eq!(stored_admin, admin);

        let stored_network: Symbol = env.storage().instance().get(&DataKey::Network).unwrap();
        assert_eq!(stored_network, symbol_short!("testnet"));
    });
}

#[test]
fn test_set_and_get_score() {
    let (env, admin, contract_id) = setup();
    env.mock_all_auths();

    let client = LiquidityIdentityClient::new(&env, &contract_id);
    client.init(&admin, &symbol_short!("testnet"));

    let wallet = Address::generate(&env);
    client.set_score(&admin, &wallet, &85, &RiskLevel::Low);

    let score = client.get_score(&wallet);
    assert_eq!(score, 85);

    let risk = client.get_risk(&wallet);
    assert_eq!(risk, Some(RiskLevel::Low));
}

#[test]
fn test_get_nonexistent_score() {
    let (env, admin, contract_id) = setup();
    env.mock_all_auths();

    let client = LiquidityIdentityClient::new(&env, &contract_id);
    client.init(&admin, &symbol_short!("testnet"));

    let wallet = Address::generate(&env);
    let score = client.get_score(&wallet);
    assert_eq!(score, 0);

    let risk = client.get_risk(&wallet);
    assert!(risk.is_none());
}

#[test]
fn test_risk_level_mapping() {
    let (env, admin, contract_id) = setup();
    env.mock_all_auths();

    let client = LiquidityIdentityClient::new(&env, &contract_id);
    client.init(&admin, &symbol_short!("testnet"));

    let wallet1 = Address::generate(&env);
    let wallet2 = Address::generate(&env);
    let wallet3 = Address::generate(&env);

    client.set_score(&admin, &wallet1, &85, &RiskLevel::Low);
    client.set_score(&admin, &wallet2, &55, &RiskLevel::Medium);
    client.set_score(&admin, &wallet3, &25, &RiskLevel::High);

    assert_eq!(client.get_risk(&wallet1), Some(RiskLevel::Low));
    assert_eq!(client.get_risk(&wallet2), Some(RiskLevel::Medium));
    assert_eq!(client.get_risk(&wallet3), Some(RiskLevel::High));
}

#[test]
fn test_transfer_admin() {
    let (env, admin, contract_id) = setup();
    env.mock_all_auths();

    let client = LiquidityIdentityClient::new(&env, &contract_id);
    client.init(&admin, &symbol_short!("testnet"));

    let wallet = Address::generate(&env);
    client.set_score(&admin, &wallet, &70, &RiskLevel::Low);

    let new_admin = Address::generate(&env);
    client.transfer_admin(&admin, &new_admin);

    let stored_admin = client.get_admin();
    assert_eq!(stored_admin, new_admin);
}

#[test]
fn test_multiple_wallets() {
    let (env, admin, contract_id) = setup();
    env.mock_all_auths();

    let client = LiquidityIdentityClient::new(&env, &contract_id);
    client.init(&admin, &symbol_short!("testnet"));

    let wallet1 = Address::generate(&env);
    let wallet2 = Address::generate(&env);
    let wallet3 = Address::generate(&env);

    client.set_score(&admin, &wallet1, &90, &RiskLevel::Low);
    client.set_score(&admin, &wallet2, &50, &RiskLevel::Medium);
    client.set_score(&admin, &wallet3, &30, &RiskLevel::High);

    assert_eq!(client.get_score(&wallet1), 90);
    assert_eq!(client.get_score(&wallet2), 50);
    assert_eq!(client.get_score(&wallet3), 30);
}

#[test]
fn test_last_updated_timestamp() {
    let (env, admin, contract_id) = setup();
    env.mock_all_auths();

    let client = LiquidityIdentityClient::new(&env, &contract_id);
    client.init(&admin, &symbol_short!("testnet"));

    let wallet = Address::generate(&env);
    client.set_score(&admin, &wallet, &75, &RiskLevel::Low);

    let timestamp = client.get_last_updated(&wallet);
    assert!(timestamp.is_some());
}

#[test]
fn test_network_identifier() {
    let (env, admin, contract_id) = setup();
    env.mock_all_auths();

    let client = LiquidityIdentityClient::new(&env, &contract_id);
    client.init(&admin, &symbol_short!("testnet"));

    let stored_network = client.get_network();
    assert_eq!(stored_network, symbol_short!("testnet"));
}

#[test]
fn test_get_wallet_info() {
    let (env, admin, contract_id) = setup();
    env.mock_all_auths();

    let client = LiquidityIdentityClient::new(&env, &contract_id);
    client.init(&admin, &symbol_short!("testnet"));

    let wallet = Address::generate(&env);
    client.set_score(&admin, &wallet, &82, &RiskLevel::Low);

    let info = client.get_wallet_info(&wallet);
    assert!(info.is_some());

    let wallet_score = info.unwrap();
    assert_eq!(wallet_score.score, 82);
    assert_eq!(wallet_score.risk, RiskLevel::Low);
}

#[test]
fn test_get_wallet_info_nonexistent() {
    let (env, admin, contract_id) = setup();
    env.mock_all_auths();

    let client = LiquidityIdentityClient::new(&env, &contract_id);
    client.init(&admin, &symbol_short!("testnet"));

    let wallet = Address::generate(&env);
    let info = client.get_wallet_info(&wallet);
    assert!(info.is_none());
}
