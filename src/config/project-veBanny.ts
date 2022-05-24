/* eslint-disable no-shadow */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import * as fs from 'fs';
import moment from 'moment';
import { CollageOutput, ProjectConfig, PopulationConfig } from '../interfaces';
import { parse_csv, random, SetEx } from '../utils';
import { population_order } from './vebanny-order';
import {
  collage300,
  collage1600,
  collage4444,
  collage4000,
  collage5000,
  collage10000,
  collage11110,
  collageOpenSea1200x75,
  collageDiscord600x240,
  collageTwitter1200x675,
  collageTwitter1500x500,
} from './collages';

const iso_datetime_now = new Date().toISOString();

const nft_name = `Juicebox's Governance Token`;
const nft_symbol = `veJBX-`;
const nft_description: string = `#CHARACTER_MOTTO

#CHARACTER_HISTORY

Juicebox Governance Token, or veBanny, is the Juicebox DAO voting escrow token. veBanny represents an address's voting weight in Juicebox DAO governance based on the amount of tokens locked over a set duration.

Juicebox, https://juicebox.money, is a programmable treasury for community-owned Ethereum projects.
`;

const nft_more_info_link = 'https://juicebox.money';
const nft_minter = `0xAF28bcB48C40dBC86f52D459A6562F658fc94B1e`;
const nft_creators = [`@juiceboxETH`];
const nft_publishers = [`@juiceboxETH`];
const nft_genres = [`veNFT`, `Juicebox`, `Banny`, `banana`, `character`, `profile`, `DAO`];
const nft_artist_address = `0xAF28bcB48C40dBC86f52D459A6562F658fc94B1e`;
const nft_artist_royality = 5;
const nft_rights = `Juicebox Rights Reserved.`;

const nft_colors = [];

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

const ordered = generate_populations(false) as PopulationConfig[];

/*
const ordered = generate_veBanny_populations(false) as PopulationConfig[];
Array.from(ordered).map(m => console.log(m.name));
*/

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
    name: nft_name,
    symbol: nft_symbol,
    description: nft_description,
    birthdate: `-22100400`,
    background_colors: [] /*nft_colors*/,
    minter: nft_minter,
    creators: nft_creators,
    publishers: nft_publishers,
    genres: nft_genres,
    tags: [`ETH`],
    drop_date: `${iso_datetime_now}`,
    native_size: '1000x1000',
    more_info_link: nft_more_info_link,
    include_total_population_in_name: true,
    /*
      if this is specific to population then note below within populations which one its for
    */
    population_metadata: {
      specific_to_population: true,
      metadata_source: `./layered-assets/${layered_assets_folder}/metadata.csv`,
      match_key: `folder_name`,
      include_columns: [`Arcana`, `Comms`, `Grind`, `Perception`, `Strength`, `Shadowiness`, `History`, `Motto`],
      rename_columes_attributes: [
        `Arcana`,
        `Communications`,
        `Grind`,
        `Perception`,
        `Strength`,
        `Shadowiness`,
        `History`,
        `Motto`,
      ],
      metadata_type: {
        attribute: false,
        levels: [`Arcana`, `Comms`, `Grind`, `Perception`, `Strength`, `Shadowiness`, `History`, `Motto`],
        boosts: false,
      },
      /*
        animation_url: {
          token_type: token, // music_single, music_album, music_generative, membership 
          tempate_file: `./layered-assets/${layered_assets_folder}/token.html`,
        }
      */
    },
    royalties: {
      artist_address: nft_artist_address,
      artist_percentage: nft_artist_royality,
      /*
      additional_payee: nft_additional_payee,
      additional_payee_percentage: nft_additional_royality,      
      */
    },
    opensea: {
      // https://docs.opensea.io/docs/contract-level-metadata
      name: nft_name,
      description: nft_description,
      image: '',
      external_link: nft_more_info_link,
      seller_fee_basis_points: 250, // Indicates a 1% seller fee.
      fee_recipient: nft_artist_address,
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
      /* 
        if the population generation doesn't have enough images, exposions ensue 
      */
      max_stacks: 5,
      images_per_stack: 50,
    },
  ],
  populations: generate_populations(false) as PopulationConfig[],
  /*
  // match to the above metadata so that different population can have different csv files for them
  populations: {
    population_metadata {
      insert_into: true;
    }
  }
  */
  anim_outputs: [],
  collage_outputs: [
    collage300,
    /*
    collage1600,
    collage4444,
    collage4000,
    */
    collageOpenSea1200x75,
    collageDiscord600x240,
    collageTwitter1200x675,
    collageTwitter1500x500,
  ],
  excluded_layers_from_metadata: [],
};
