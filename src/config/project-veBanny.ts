import * as fs from 'fs';
import { ProjectConfig, PopulationConfig } from '../interfaces';
import { SetEx } from '../utils';
import { population_order } from './veBanny-order';
import {
  collage300,
  collageOpenSea1200x75,
  collageDiscord600x240,
  collageTwitter1200x675,
  collageTwitter1500x500,
} from './collages';

const iso_datetime_now = new Date().toISOString();

const nft_symbol = `VEBANNY`;
const nft_more_info_link = 'https://juicebox.money';
const nft_minter = `0xAF28bcB48C40dBC86f52D459A6562F658fc94B1e`;
const nft_creators = [`@juiceboxETH`];
const nft_publishers = [`@juiceboxETH`];
const nft_genres = [`veNFT`, `Juicebox`, `Banny`, `banana`, `character`, `profile`, `DAO`];
const nft_artist_address = `0xAF28bcB48C40dBC86f52D459A6562F658fc94B1e`;
const nft_artist_royality = 5;
const nft_rights = `Juicebox Rights Reserved.`;

export const layer_order = [
  'Background',
  'Body',
  'Face',
  'Choker',
  'Lower_Accessory',
  'Outfit',
  'Oral_Fixation',
  'Headgear',
  'Left_Hand',
  'Right_Hand',
  'Both_Hands',
];

export const sub_populations = ['10_Days', '50_Days', '100_Days', '500_Days', '1000_Days'];

export const population_size = 1;

export const population_template = (population_name: string, _layer_order: string[], _population_size: number) => {
  return {
    name: population_name,
    layer_order: _layer_order,
    population_size: _population_size,
  };
};

export function generate_populations(verbose: boolean = false) {
  const populations = new SetEx();
  const file_path = `layered-assets/vebanny`;
  const veBanny_populations = fs.readdirSync(`layered-assets/vebanny`);

  console.warn(`layered-assets folder located ${veBanny_populations.length}`);
  veBanny_populations.forEach(p => populations.add(p.split(/\d/)[0].trim()));

  const characters = Array.from(populations);
  // console.log(characters);

  const ordered_characters: {}[] = [];
  const configured_population = new SetEx();

  let not_found = 0;

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < population_order.length; i++) {
    const index = characters.findIndex(e => {
      return e.toLowerCase().includes(population_order[i].trim().toLowerCase());
    });

    if (index != -1) {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let j = 0; j < sub_populations.length; j++) {
        ordered_characters.push(
          population_template(`${characters[index]}${sub_populations[j]}`, layer_order, population_size),
        );
      }
    } else if (index == -1) {
      console.warn(`${population_order[i]} was not found`);
      not_found++;
    } else {
      console.error(`Impossible, generate_populations errored unexpectedly`);
    }
  }

  false && console.log(ordered_characters, ordered_characters.length);
  console.warn(`Total number of characters not found: ${not_found}`);
  return ordered_characters as unknown as PopulationConfig[];
}

/*
const ordered = generate_veBanny_populations(false) as PopulationConfig[];
Array.from(ordered).map(m => console.log(m.name));
*/

const aboutJuicebox = `Juicebox Governance Token, or veBanny, is the Juicebox DAO voting escrow token. veBanny represents an address's voting weight in Juicebox DAO governance based on the amount of tokens locked over a set duration.

Juicebox, https://juicebox.money, is a programmable treasury for community-owned Ethereum projects.`;

const layered_assets_folder = `vebanny`;
export const bannyConfig: ProjectConfig = {
  name: layered_assets_folder,
  upload_images_to_ipfs: true,
  upload_metadata_to_ipfs: true,
  shuffle_assets: false,
  resume_folder: '',
  re_generate_collages: false,
  re_generate_metadata_cid: false,
  metadata_outputs: ['ethereum'],
  metadata_file_extension: false,
  hide_rarity_names: true,
  rotated_images_allowed: 0,
  mirror_images_allowed: 0,
  // asset_origin: 0,
  metadata_input: {
    name: `{{{{batch_index}}.Banny Name}} {{traits.0.value}}`,
    symbol: nft_symbol,
    description: `{{{{batch_index}}.Motto}}\n\n{{{{batch_index}}.History}}\n\n${aboutJuicebox}`,
    birthdate: `-22100400`,
    background_colors: [], // nft_colors
    minter: nft_minter,
    creators: nft_creators,
    publishers: nft_publishers,
    genres: nft_genres,
    tags: [`ETH`],
    drop_date: `${iso_datetime_now}`,
    native_size: '1000x1000',
    more_info_link: nft_more_info_link,
    include_total_population_in_name: true,
    attributes: [
      { trait_type: `Arcana`, value: `{{{{batch_index}}.Arcana}}` },
      { trait_type: `Communications`, value: `{{{{batch_index}}.Comms}}` },
      { trait_type: `Grind`, value: `{{{{batch_index}}.Grind}}` },
      { trait_type: `Perception`, value: `{{{{batch_index}}.Perception}}` },
      { trait_type: `Strength`, value: `{{{{batch_index}}.Strength}}` },
      { trait_type: `Shadowiness`, value: `{{{{batch_index}}.Shadowiness}}` },
    ],
    animation_url: `{{SVELTE_IPFS}}/index.html#tokenId={{tokenId}}&cid={{images_cid}}`,
    royalties: {
      artist_address: nft_artist_address,
      artist_percentage: nft_artist_royality,
      // additional_payee: nft_additional_payee,
      // additional_payee_percentage: nft_additional_royality,
    },
    rights: nft_rights,
    decimals: 0,
    generation: 0,
    edition: 0,
  },
  image_outputs: [
    // feeds into collage, please don't remove.
    { width: 350, height: 350, tag: 'icon', ipfs_tag: 's' },
    { width: 512, height: 512, tag: 'profile', ipfs_tag: '' },
    { width: 1_000, height: 1_000, tag: 'image', ipfs_tag: '' },
  ],
  stacked_gif_outputs: [
    {
      tag: 'stacked-gif',
      source_image_type: 'profile',
      // if the population generation doesn't have enough images, exposions ensue
      max_stacks: 5,
      images_per_stack: 50,
    },
  ],
  populations: (generate_populations(false) as PopulationConfig[]).slice(0, 2),
  anim_outputs: [],
  collage_outputs: [
    collage300,
    // collage1600,
    // collage4444,
    // collage4000,
    collageOpenSea1200x75,
    collageDiscord600x240,
    collageTwitter1200x675,
    collageTwitter1500x500,
  ],
  excluded_layers_from_metadata: [],
};
