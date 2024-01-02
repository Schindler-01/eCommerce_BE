const CONTRACT_ADDR = {
    STAKING_BSC: "0xa5263e756234d4d516930dc07290ef1f35e15111",
    STAKING_ORAICHAIN:
        "orai17sy5njqjt2skvk3d9pxtywsvjf2rasnfhkptsg8xc57v35tdkluqhd3t5l",
    UNSTAKING_ORAICHAIN:
        "orai17xnkzdgvyrff4fxnc9l5agfspvw5snx9svlgd0rmv8pcs6s3hmdshmgyur",
    LSD_HUB_ORAICHAIN:
        "orai19t62d23z4tc4e6srgnea9tcl50es7qyqdz3ag5kd4c50gr426mkq5vsana",
    STAKING_ETH: "0xa5263e756234d4d516930dc07290ef1f35e15111"
};

const CONFIG = {
    DECIMAL_PLACE: 1e18,
    TIME_CLEAR_CONSOLE: 21600000, //6 hours
    TIME_STAKING: 3600000, // 1 hour
    TIME_UNSTAKING: 3700000, //1 hour
    TIME_CLAIM_UNSTAKING: 3500000, // 1 hour
};

const CHAIN_CONFIG = {
    ETH: {
        PROVIDER: "https://eth.llamarpc.com",
        GAS_PRICE: 3e9,
    },
    ORAICHAIN: {
        RPC_URL: "https://rpc.orai.io",
        PREFIX: "orai",
        DENOM: "orai",
    },
};

const LIST_RPC_ORAI_CHAIN = ["https://rpc-oraichain.mms.team", "https://oraichain-mainnet-rpc.autostake.com:443", "https://rpc.orai.io", "https://rpc-orai.nodine.id"];

module.exports = { CONTRACT_ADDR, CONFIG, CHAIN_CONFIG, LIST_RPC_ORAI_CHAIN };