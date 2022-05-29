import '@typechain/hardhat';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-etherscan';
import '@openzeppelin/hardhat-upgrades';
import 'hardhat-gas-reporter';
import 'solidity-coverage';

import { task } from 'hardhat/config';
import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';
import { HardhatUserConfig, NetworkUserConfig } from 'hardhat/types';
import './type-extensions';

dotenvConfig({ path: resolve(__dirname, './.env') });

const chainIds = {
  mainnet: 1,
  ropsten: 3,
  rinkeby: 4,
  goerli: 5,
  kovan: 42,
  polygon: 137,
  ganache: 1337,
  hardhat: 31337,
  mumbai: 80001,
};

const VERBOSE = false;

const PRIVATE_KEY = process.env.PRIVATE_KEY || '';
const PRIVATE_MNEMONIC = process.env.PRIVATE_KEY || '';
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || '';
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || '';

const traverseKeys = (obj: any, results = []) => {
  const r: any = results;
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    if (typeof value !== 'object' || typeof value !== 'function') {
      console.log(value);
      r.push(value);
    } else if (typeof value === 'object') {
      traverseKeys(value, r);
    }
  });
  return r;
};

task('accounts', 'Prints the list of available ETH accounts:', async (args, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(await account.address);
  }
});

task('networks', 'Prints the configured ETH network settings:', async (args, hre) => {
  if (VERBOSE) {
    console.log(`Available Networks:`);
    console.log(hre['config']['networks']);
  } else {
    Object.keys(chainIds).forEach(k => {
      console.log(`Network ${k}`);
      console.log(hre['config']['networks'][`${k}`]);
    });
  }
});

const INFURA_API_KEY = process.env.INFURA_API_KEY || '';
const ACCOUNT_PATH = "m/44'/60'/0'/0";

export const createInfuraConfig = (network: keyof typeof chainIds, name = 'eth'): NetworkUserConfig => {
  const url: string = 'https://' + network + '.infura.io/v3/' + INFURA_API_KEY;
  return {
    accounts: [PRIVATE_KEY],
    /*
        accounts: {
            count: 10,
            initialIndex: 0,
            mnemonic: PRIVATE_MNEMONIC,
            path: ACCOUNT_PATH,
        },
        */
    chainId: chainIds[network],
    url,
  };
};

const createConfig = (network: keyof typeof chainIds, name = 'eth'): NetworkUserConfig => {
  const url = `https://${name}-${network}.alchemyapi.io/v2/${process.env[`${network.toUpperCase()}_ALCHEMY_API_KEY`]}`;
  return {
    accounts: [PRIVATE_KEY],
    /*
        accounts: {
            count: 10,
            initialIndex: 0,
            mnemonic: PRIVATE_MNEMONIC,
            path: ACCOUNT_PATH,
        },
        */
    chainId: chainIds[network],
    url,
  };
};

/* You need to export an object to set up your config
  Go to https://hardhat.org/config/ to learn more */
const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  gasReporter: {
    currency: 'USD',
    enabled: true,
    gasPrice: 100,
    excludeContracts: [],
    src: './contracts',
    coinmarketcap: process?.env?.COINMARKETCAP_API_KEY,
  },
  networks: {
    hardhat: {
      accounts: {
        mnemonic: PRIVATE_MNEMONIC,
      },
      chainId: chainIds.hardhat,
    },
    ropsten: createConfig('ropsten'),
    rinkeby: createConfig('rinkeby'),
    kovan: createConfig('kovan'),
    mainnet: createConfig('mainnet'),
    ploygon: createConfig('mainnet', 'polygon'),
    mumbai: createConfig('mumbai', 'polygon'),
  },
  solidity: {
    compilers: [
      {
        version: '0.7.0',
        settings: {
          metadata: {
            // Not including the metadata hash
            // https://github.com/paulrberg/solidity-template/issues/31
            bytecodeHash: 'none',
          },
          // You should disable the optimizer when debugging
          // https://hardhat.org/hardhat-network/#solidity-optimizer-support
          optimizer: {
            enabled: true,
            runs: 800,
          },
        },
      },
      { version: '0.6.0' },
    ],
  },
  etherscan: {
    apiKey: {
      mainnet: ETHERSCAN_API_KEY,
      ropsten: ETHERSCAN_API_KEY,
      rinkeby: ETHERSCAN_API_KEY,
      kovan: ETHERSCAN_API_KEY,
      polygon: POLYGONSCAN_API_KEY,
      polygonMumbai: POLYGONSCAN_API_KEY,
    },
  },
  paths: {
    sources: './contracts',
    artifacts: './artifacts',
    cache: './cache',
    tests: './test',
  },
};

export default config;
