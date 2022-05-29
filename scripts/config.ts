import { promises as fs } from 'fs';
import path from 'path';

const project_name = `veBanny Collection`;
const project_symbol = `VEBANNY`;
const project_description = `Introducing the Ascended Apes, a derivative of Movement DAO's Bored Ape Yacht Club No. 1420. The Ascended Apes can only be earned by participating in decentralized governance.  Visit Twitter's @move_xyz or Discord at https://discord.gg/movexyz for details.`;
const project_image_gif = `ipfs://QmSw7NtkEkiNCUpdb458kVKVTzS3xUVhQ7pm9XNrF1fFxU`;
const project_base_uri = `ipfs://bafybeid64vrqul6a2tivtofhq7avz3jjcmgtukevhhewt5dxeigpcir3cy/`;
const provenance = `e0226b57469edf5240bf0985c33f5d18d569040669ac365956d9c6b4b31ce75e`;
const project_max_tokens = 4444;
const project_start_sale = 1;
const project_external_url = `https://move.xyz`;
const project_seller_fee_basis_points = 5000;
const project_fee_recipient = `0x1DD2091f250876Ba87B6fE17e6ca925e1B1c0CF0`;
const project_fee_recipient_ens = `natasha-pankina.eth`;

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
  try {
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
          discord: 'https://discord.gg/movexyz',
          twitter: 'https://twitter.com/move_xyz',
        },
        null,
        '  ',
      ),
    );
  } catch (error) {
    console.log(error);
  }
})();
