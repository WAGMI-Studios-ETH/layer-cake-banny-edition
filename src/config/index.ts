import fs from 'fs';
import dotenv from 'dotenv';
import { getVariableName } from '../utils';

dotenv.config();

const random = (max: number) => {
  return Math.floor(Math.random() * max);
};
const zeroPad = (num: number, places: number) => String(num).padStart(places, '0');
!fs.existsSync(`.env`) ? console.warn(`ENV:.env not found, enabling VERBOSE, (see env.template)`) : null;

export const MARGIN_FOR_ERROR = 1.1;
export const DEBUG_ENVIRONMENT_VARIABLES: boolean = false;
export const BLANK = '';

const key_count = 11;

export const VERBOSE: boolean = !fs.existsSync(`.env`) ? true : process.env?.VERBOSE === 'true' ? true : false;
export const NODE_ENV: string = process.env?.NODE_ENV ?? 'development';
export const INFURA_API_KEYS: string[] = [];
export const ETHERSCAN_API_KEYS: string[] = [];
export const NFT_STORAGE_API_KEYS: string[] = [];

for (let i = 0; i < key_count; i++) {
  const env_key = process.env[String(`INFURA_API_KEY_` + zeroPad(i, 3))] || BLANK;
  env_key.length ? INFURA_API_KEYS.push(env_key) : null;
}

for (let i = 0; i < key_count; i++) {
  const env_key = process.env[String(`ETHERSCAN_API_KEY_` + zeroPad(i, 3))] || BLANK;
  env_key.length ? ETHERSCAN_API_KEYS.push(env_key) : null;
}

for (let i = 0; i < key_count; i++) {
  const env_key = process.env[String(`INFURA_API_KEY_` + zeroPad(i, 3))] || BLANK;
  env_key.length ? INFURA_API_KEYS.push(env_key) : null;
}

for (let i = 0; i < key_count; i++) {
  const env_key = process.env[String(`NFT_STORAGE_API_KEY_` + zeroPad(i, 3))] || BLANK;
  env_key.length ? NFT_STORAGE_API_KEYS.push(env_key) : null;
}

export const NFT_STORAGE_API_KEY: string =
  NFT_STORAGE_API_KEYS.length >= 1 ? NFT_STORAGE_API_KEYS[random(NFT_STORAGE_API_KEYS.length)] : 'undefined';

export const INFURA_API_KEY: string =
  INFURA_API_KEYS.length >= 1 ? INFURA_API_KEYS[random(INFURA_API_KEYS.length)] : '6b4cbecb2c8f4d369b78ebd576c58270';

export const ETHERSCAN_API_KEY: string =
  ETHERSCAN_API_KEYS.length >= 1
    ? ETHERSCAN_API_KEYS[random(ETHERSCAN_API_KEYS.length)]
    : 'YM88X39NFYCHJG583153DY37VSR3I4CFA5';

export const INFURA_HTTPS: string = `https://mainnet.infura.io/v3/${INFURA_API_KEY}`;
export const INFURA_WS: string = `wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}`;

INFURA_API_KEYS.length
  ? VERBOSE &&
    INFURA_API_KEYS.forEach(k => {
      console.info(`INFURA_API_KEY: ${k}`);
    })
  : VERBOSE && console.warn(`INFURA_API_KEYS:undefined`);

INFURA_HTTPS
  ? VERBOSE && console.info(`INFURA_HTTPS:${INFURA_HTTPS}`)
  : VERBOSE && console.warn(`INFURA_HTTPS:undefined`);

INFURA_WS ? VERBOSE && console.info(`INFURA_WS:${INFURA_WS}`) : VERBOSE && console.warn(`INFURA_WS:undefined`);

const PROCESS_ENV: string[] = [];

/*
 * @dev Exposing Infura and Pinata keys is bad practice, but they were additional accounts to improve throughput
 * and to avoid having the application not work for anyone needing to regenerate the assets
 */

export const IPFS_BASE_URL = process.env.IPFS_BASE_URL || 'ipfs://';
export const PINATA_API_KEY = process.env.PINATA_API_KEY || 'd11f5e71d1b8fbaae998';
export const PINATA_API_SECRET =
  process.env.PINATA_API_SECRET || 'b48a6444f2820482615735f7aa1f4e7891904d3bf4262e43ad3c1091affa5516';
export const INFURA_IPFS_API_ENDPOINT = process.env.INFURA_IPFS_API_ENDPOINT || 'https://ipfs.infura.io:5001';
export const INFURA_IPFS_API_KEY_PROJECT_ID =
  process.env.INFURA_IPFS_API_KEY_PROJECT_ID || '1z7OICVZBuSn666a44zHwNeThpc';
export const INFURA_IPFS_API_KEY_PROJECT_SECRET =
  process.env.INFURA_IPFS_API_KEY_PROJECT_SECRET || '4c6a9a7434b418334fbe6424f841623f';

export const MEOWSDAO_GNOSIS_SAFE = `0x971B4533EdBFcfE34e0F6eA053D33231a814FD96`;

DEBUG_ENVIRONMENT_VARIABLES &&
  PROCESS_ENV.push(
    IPFS_BASE_URL,
    PINATA_API_KEY,
    PINATA_API_SECRET,
    INFURA_API_KEY,
    ETHERSCAN_API_KEY,
    INFURA_HTTPS,
    INFURA_WS,
  );

async () => {
  DEBUG_ENVIRONMENT_VARIABLES && process.stdout.write(`process env:`);
  DEBUG_ENVIRONMENT_VARIABLES && console.log(PROCESS_ENV);

  DEBUG_ENVIRONMENT_VARIABLES && process.stdout.write(`INFURA KEYS` + `\n`);
  if (DEBUG_ENVIRONMENT_VARIABLES && NFT_STORAGE_API_KEYS.length) {
    NFT_STORAGE_API_KEYS.forEach(k => {
      process.stdout.write(`${k}` + `\n`);
    });
  }
};
