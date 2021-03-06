import { promises as fs } from 'fs';
import path from 'path';

const project_name = `Juicebox's Governace Token`;
const project_symbol = `veJBX`;
const project_description = `Juicebox Governance Token or veBanny is a voting escrow token that represents an individual's voting weight based on the amount of tokens locked over a set duration. Benefits bestowed upon each holder, in addition to ongoing governance, is the exclusive ability to generate custom Bannys at https://bannyverse.xyz - every genesis Banny character generated during this period has unique characteristics exploitable within the BannyVerse.`;

const project_image_gif = 'ipfs://CID';
const project_base_uri = `https://stake.juicebox.money`;
const provenance = ``;
const project_max_tokens = 0;
const project_start_sale = 0;
const project_external_url = `https://juicebox.money`;
const project_seller_fee_basis_points = 5000;
const project_fee_recipient = `0x6a67c678eFb4a61635fFBaEbcD38B3370009592f`;
const project_discord = `juicebox`;
const project_twitter = `juiceboxETH`;

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
  image: project_image_gif,
  external_link: project_external_url,
  seller_fee_basis_points: project_seller_fee_basis_points,
  fee_recipient: project_fee_recipient,
};

false && console.log(project_config);

(async () => {
  console.log('writing opensea.json...');
  await fs.writeFile(
    path.join(__dirname, './opensea.json'),
    JSON.stringify(
      {
        name: project_name,
        description: project_description,
        image: project_image_gif,
        external_link: project_external_url,
        seller_fee_basis_points: project_seller_fee_basis_points,
        fee_recipient: project_fee_recipient,
        discord: `"https://discord.gg/juicebox${project_discord}"`,
        twitter: `"https://twitter.com/${project_twitter}"`,
      },
      null,
      '  ',
    ),
  );
})();
