/* eslint-disable no-shadow */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import * as fs from 'fs';
import { CollageOutput, ProjectConfig, PopulationConfig } from '../interfaces';
import { parse_csv, random, SetEx } from '../utils';
import moment from 'moment';
import { population_order } from './veBanny-order';
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
import { AnimationTemplate } from '../interfaces/animation-template';

const iso_datetime_now = new Date().toISOString();

const aboutJuicebox = `Juicebox Governance Token, or veBanny, is the Juicebox DAO voting escrow token. veBanny represents an address's voting weight in Juicebox DAO governance based on the amount of tokens locked over a set duration.

Juicebox, https://juicebox.money, is a programmable treasury for community-owned Ethereum projects.`;

const nft_name = `{{{{population_index}}.Banny Name}} {{traits.0.value}}`;
const nft_symbol = `VEBANNY`;
const nft_description = `{{{{population_index}}.Motto}}\n\n{{{{population_index}}.History}}\n\n${aboutJuicebox}`;

const nft_more_info_link = 'https://juicebox.money';
const nft_minter = `0xAF28bcB48C40dBC86f52D459A6562F658fc94B1e`;
const nft_creators = [`@juiceboxETH`];
const nft_publishers = [`@juiceboxETH`];
const nft_genres = [`veNFT`, `Juicebox`, `Banny`, `banana`, `character`, `profile`, `DAO`];
const nft_artist_address = `0xAF28bcB48C40dBC86f52D459A6562F658fc94B1e`;
const nft_artist_royality = 5;
const nft_rights = `Juicebox Rights Reserved.`;

const nft_colors: string[] = [];

export const layer_order = [
  'Lock_Period',
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

export const population_template = (
  population_name: string,
  _layer_order: string[],
  _population_size: number,
): PopulationConfig => {
  return {
    name: population_name,
    layer_order: _layer_order,
    population_size: _population_size,
  };
};

export function generate_populations(verbose: boolean = false) {
  const populations = new SetEx();
  const file_path = `layered-assets/vebanny`;
  const veBanny_populations = fs.readdirSync(file_path);

  console.warn(`layered-assets folder located ${veBanny_populations.length}`);
  veBanny_populations.forEach(p => populations.add(p.split(/\d/)[0].trim()));

  const characters = Array.from(populations);
  // console.log(characters);

  const ordered_characters: PopulationConfig[] = [];

  let not_found = 0;

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < population_order.length; i++) {
    const index = characters.findIndex(e => {
      return e.toLowerCase().includes(population_order[i].trim().toLowerCase());
    });

    if (index != -1) {
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
  return ordered_characters;
}

const populations: PopulationConfig[] = generate_populations(false);

const layered_assets_folder = `vebanny`;
export const bannyConfig: ProjectConfig = {
  name: layered_assets_folder,
  stunt_populations_to: 1,
  upload_images_to_ipfs: false,
  upload_metadata_to_ipfs: false,
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
    background_colors: nft_colors,
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

      https://cloudflare-ipfs.com/ipfs/bafybeiaqrndygqdubcpj7nqtt3ot67yniszmdxoiwt5ud3anqkci45t7je/index.html#tokenId=2&cid=bafybeiehhublymoiw3fii7rwfh5w5auw74a66en5p6e4w4fcjvljsqbe2m&lock_period=50
    
  10 days: E15476
  50 days: The teal color
  100 days: B062FF
  500 days: FFC61C
  1000 days: 4CE15B
  and green on 4/20 
    */
    attributes: [
      { trait_type: 'JBX Range', value: `{{{{population_index}}.$JBX Range}}` },
      // { trait_type: `Arcana`, value: `{{{{population_index}}.Arcana}}` },
      // { trait_type: `Communications`, value: `{{{{population_index}}.Comms}}` },
      // { trait_type: `Grind`, value: `{{{{population_index}}.Grind}}` },
      // { trait_type: `Perception`, value: `{{{{population_index}}.Perception}}` },
      // { trait_type: `Strength`, value: `{{{{population_index}}.Strength}}` },
      // { trait_type: `Shadowiness`, value: `{{{{population_index}}.Shadowiness}}` },
    ],
    animation_url: `{{SVELTE_IPFS}}/index.html#tokenId={{base_name}}&cid={{images_cid}}&lock_period={{traits.0.value}}`,
    /*
      animation_url_arguments: {
        lock_color: [
          (color = ``),
          (lock_period = `{{traits.0.value}}`),
          (color = ``),
          (lock_period = `{{traits.0.value}}`),
          (color = ``),
          (lock_period = `{{traits.0.value}}`),
          (color = ``),
          (lock_period = `{{traits.0.value}}`),
          (color = ``),
          (lock_period = `{{traits.0.value}}`),
        ],
      },
      */
    population_metadata: {
      specific_to_population: true,
      metadata_source: `./layered-assets/${layered_assets_folder}/metadata.csv`,
      match_key: `folder_name`,
      include_columns: [
        `Arcana`,
        `Comms`,
        `Grind`,
        `Perception`,
        `Strength`,
        `Shadowiness`,
        `$JBX Range`,
        `Range width`,
      ],
      rename_columes_attributes: [
        `Arcana`,
        `Communications`,
        `Grind`,
        `Perception`,
        `Strength`,
        `Shadowiness`,
        `$JBX Range`,
        `Range width`,
      ],
      substitute_variables: [`description`] /* name is constructed differently */,
      metadata_type: {
        attributes: [`$JBX Range`],
        levels: [`Arcana`, `Comms`, `Grind`, `Perception`, `Strength`, `Shadowiness`],
        boosts: [`Range width`],
        boosts_percentage: [],
      },
      animation_url: AnimationTemplate.TOKEN,
    },
    royalties: {
      artist_address: nft_artist_address,
      artist_percentage: nft_artist_royality,
      // additional_payee: nft_additional_payee,
      // additional_payee_percentage: nft_additional_royality,
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
      // if the population generation doesn't have enough images, exposions ensue
      max_stacks: 5,
      images_per_stack: 50,
    },
  ],
  populations,
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

if (bannyConfig.stunt_populations_to && bannyConfig.stunt_populations_to < bannyConfig.populations.length) {
  bannyConfig.populations = bannyConfig.populations.slice(0, bannyConfig.stunt_populations_to);
}
