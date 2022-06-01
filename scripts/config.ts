import { existsSync, promises as fs, readdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { NFTStorage, File } from 'nft.storage';
import { NFT_STORAGE_API_KEYS } from '../src/config';

const buildDir = path.resolve(__dirname, '../build/vebanny');
const dir = readdirSync(buildDir)
  .filter(file => file.match(/\d+/))
  .sort((filename, f) => Number(f.replace(/[^\d]/g, '')) - Number(filename.replace(/[^\d]/g, '')));

let buildFolder = '' || dir[0];

const assetsJSON = path.resolve(buildDir, buildFolder, 'assets.json');

const [{ metadata_cid }] = JSON.parse(readFileSync(assetsJSON, 'utf8'));

const project_base_uri = `ipfs://${metadata_cid}/`;

const project_name = `veBanny Collection`;
const project_symbol = `VEBANNY`;
const project_description = `Juicebox Governance Token, or veBanny, is the Juicebox DAO voting escrow token. veBanny represents an address's voting weight in Juicebox DAO governance based on the amount of tokens locked over a set duration.\n\nJuicebox, https://juicebox.money, is a programmable treasury for community-owned Ethereum projects.`;

const project_max_tokens = 3;
const project_start_sale = 1;
const project_external_url = `https://juicebox.money/`;
const project_seller_fee_basis_points = 500;
const project_fee_recipient = `0x1DD2091f250876Ba87B6fE17e6ca925e1B1c0CF0`;

export const project_config = {
  tokenName: project_name,
  tokenSymbol: project_symbol,
  baseURI: project_base_uri,
  maxTokens: project_max_tokens,
  startSale: project_start_sale,
};

export const opensea_storefront = {
  name: project_name,
  description: project_description,
  image: '',
  external_link: project_external_url,
  seller_fee_basis_points: project_seller_fee_basis_points,
  fee_recipient: project_fee_recipient,
};

false && console.log(project_config);

export async function writeOpenseaConfig() {
  const json = {
    name: project_name,
    description: project_description,
    image: '',
    external_link: project_external_url,
    seller_fee_basis_points: project_seller_fee_basis_points,
    fee_recipient: project_fee_recipient,
    discord: 'https://discord.gg/movexyz',
    twitter: 'https://twitter.com/move_xyz',
  };
  const returnValue = {
    project_config,
    opensea_json: json,
    opensea_json_cid: '',
  };
  try {
    if (true) {
      const dirPath = path.resolve(buildDir, buildFolder, 'assets/stacked-gif/');
      const dir = existsSync(dirPath)
        ? readdirSync(dirPath).map(file => path.resolve(dirPath, file))
        : [path.resolve(dirPath, '..', 'profile/profile.gif')];
      const { cid: imageCid } = await uploadFile(readFileSync(dir[0]), 'profile.gif');
      json.image = opensea_storefront.image = `ipfs://${imageCid}/profile.gif`;
      const { cid } = await uploadFile(JSON.stringify(json, null, '  '), 'opensea.json');
      returnValue.opensea_json_cid = cid;
    }
    await fs.writeFile(path.join(__dirname, './opensea.json'), JSON.stringify(json, null, '  '));
  } catch (error) {
    console.log(error);
  }
  return returnValue;
}

async function uploadFile(content: any, filename: string) {
  const file = new File([content], filename);
  const api_key = NFT_STORAGE_API_KEYS[NFT_STORAGE_API_KEYS.length - 1];
  const storage = new NFTStorage({ token: api_key });
  console.log(`uploading ${filename} to ipfs...`);
  const cid = await storage.storeDirectory([file]);
  return { cid };
}
