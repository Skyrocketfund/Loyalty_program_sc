import {config as dotEnvConfig} from "dotenv";
import {HardhatUserConfig} from "hardhat/types";
import {task} from "hardhat/config"
import {ethers} from "ethers";
import '@nomiclabs/hardhat-etherscan'; 
import '@typechain/hardhat'

import "@nomicfoundation/hardhat-toolbox";

dotEnvConfig();

// Add some .env individual variables
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const ALCHEMYAPI_URL = process.env.ALCHEMYAPI_URL;

const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Use AlchemyAPI to make fork if its URL specifyed else use the Infura API
const FORK_URL = ALCHEMYAPI_URL || `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`;

const BLOCK_NUMBER: number | undefined =
    13736636;

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    solidity: {
        compilers: [
            {
                version: "0.8.7",
                settings: {
                    optimizer: {runs: 1, enabled: true},
                },
            },
        ],
    },
    networks: {
        hardhat: {
            blockGasLimit: 12450000 * 100,
            // forking: {
            //     // url: FORK_URL,
            //     // // specifing blockNumber available only for AlchemyAPI
            //     // blockNumber: ALCHEMYAPI_URL ? BLOCK_NUMBER : undefined,
            // },
            accounts: {
                count: 2000,
                accountsBalance: ethers.utils.parseEther('10000').toString(),
            }
        },
        localhost: {},
        ethereum: {
            url: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
            accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
            chainId: 1,
        },
        kovan: {
            url: `https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`,
            accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
            chainId: 42,
        },
        goerli: {
            url: `https://goerli.infura.io/v3/${INFURA_PROJECT_ID}`,
            accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
            chainId: 5,
        },
        mumbai: {
            url: `https://polygon-mumbai.g.alchemy.com/v2/${INFURA_PROJECT_ID}`,
            accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
            chainId: 80001,
        },
        bsc_mainnet: {
            url: "https://bsc-dataseed.binance.org/",
            accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
            chainId: 56,
        },
        bsc_testnet: {
            url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
            accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
            chainId: 97,
        },
        coverage: {
            url: "http://127.0.0.1:8555", // Coverage launches its own ganache-cli client
        },
    },
    mocha: {
        timeout: 20000000,
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
}

task("generate-wallet", "Generate q new wallet and prints its privateKey, address and mnemonic")
    .setAction(async () => {
        const wallet = ethers.Wallet.createRandom()
        console.log(`New wallet private key is ${wallet.privateKey}`)
        console.log(`New wallet public address is ${wallet.address}`)
        console.log(`New wallet mnemonic is ${JSON.stringify(wallet.mnemonic)}`)
    })

export default config;