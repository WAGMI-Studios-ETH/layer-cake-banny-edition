/* eslint-disable max-len */
import * as fs from 'fs';
import moment from 'moment';
import { CollageOutput, ProjectConfig, PopulationConfig } from '../interfaces';
import { random, SetEx } from '../utils';
import { static_veBanny_populations } from './veBanny-populations';
import { population_order } from './veBanny-order';
import { generate_veBanny_populations, generate_veBanny_populations_names_only } from './generate-populations';
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

const nft_name = `Juicebox's Governance Banana`;
const nft_symbol = `veJBX-`;
const nft_description: string = `The Juicebox's Governance Banana NFT or veBanny NFT, for short, is the Juicebox DAO's governance token, but so much more. The specific veBanny you receive is a function of how much of your Juicebox DAO tokens you have locked and for how long. Never before has how cool you are been reduced to an anthropomorphic banana. You are welcome. In addition to determining the future of your social life, your specific veBanny is your golden ticket into the BannyVerse, where dreams, adventure, and fruit salad, await.  https://wagmistudios.info/ is your portal, https://bannyverse.xyz is your door, only you can step through it, but don't think too hard, there are only so many AK-47s available.  Enter the Banny Quartermaster, use your veBanny to unlock powerful, fashionable, and accessorized bananas.  Choose from the shockingly vast combinations of banana characters, cock your weapons, and immortalize your Banny configuration through minting.  Leave your meatbag behind and start your true journey.  Or be uncool forever, its probably too late for you anyway.`;
const nft_more_info_link = 'https://wagmistudios.xyz';
const nft_minter = `tankbottoms.eth`;
const nft_creators = [`@WagmiStudios`];
const nft_publishers = [`@WagmiStudios`];
const nft_genres = [`veNFT`, `Juicebox`, `Banny`, `banana`, `character`, `profile`, `DAO`];
const nft_artist_address = `wagmistudios.eth`;
const nft_artist_royality = 5;
/*
const nft_additional_payee = `natasha-pankina.eth`;
const nft_additional_royality = 5;
*/

const nft_rights = `© 2022 All Banana Rights Reserved.`;

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

export const population_template = (
  population_name: string, 
  layer_order: string[], 
  population_size: number) => {
  return {
    name: population_name,
    layer_order: layer_order,
    population_size: population_size,
  };
};

export function generate_populations(verbose: boolean = false) {
  const population_size = 1;
  const populations = new SetEx();
  const file_path = `layered-assets/veBanny`;
  const veBanny_populations = fs.readdirSync(`layered-assets/veBanny`);
  veBanny_populations.forEach(p => populations.add(p.split(/\d/)[0]));

  const characters = Array.from(populations);
  const ordered_characters: {}[] = [];
  const configured_population = new SetEx();

  for (let i = 0; i < population_order.length; i++) {
    const index = characters.findIndex(e => {
      return e.toLowerCase().includes(population_order[i].trim().toLowerCase());
    });

    if (index != -1) {
      for (let j = 0; j < sub_populations.length; j++) {
        ordered_characters.push(
          population_template(`${characters[index]}${sub_populations[j]}`, 
            layer_order, population_size),
        );
      }
    } else if (index == -1) {
      console.warn(`${population_order[i]} was not found`);
    } else {
      console.error(`Impossible, generate_populations errored unexpectedly`);
    }
  }

  false && console.log(ordered_characters, ordered_characters.length);
  return ordered_characters as unknown as PopulationConfig[];
}

const ordered = generate_populations(false) as PopulationConfig[];

export function generate_populations_from_template(verbose: boolean = false) {
  const population_size = 1;
  const populations = new SetEx();
  const file_path = `layered-assets/veBanny`;
  const veBanny_populations = fs.readdirSync(`layered-assets/veBanny`);
  veBanny_populations.forEach(p => populations.add(p.split(/\d/)[0]));

  const characters = Array.from(populations);
  const ordered_characters: {}[] = [];
  const configured_population = new SetEx();

  for (let i = 0; i < population_order.length; i++) {
    const index = characters.findIndex(e => {
      return e.toLowerCase().includes(population_order[i].trim().toLowerCase());
    });
    if (index != -1) {
      for (let j = 0; j < sub_populations.length; j++) {
        ordered_characters.push(
          population_template(`${characters[index]}${sub_populations[j]}`, 
            layer_order, population_size),
        );
      }
    } else {
      console.warn(`${population_order[i]} not found`);
    }
  }

  return configured_population as unknown as PopulationConfig[];
}

false && generate_populations_from_template(false);
false && generate_veBanny_populations_names_only(false);

/*
const ordered = generate_veBanny_populations(false) as PopulationConfig[];
Array.from(ordered).map(m => console.log(m.name));
*/

const layered_assets_folder = `veBanny`;
export const bannyConfig: ProjectConfig = {
  name: layered_assets_folder,  
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
      image:
        'https://cloudflare-ipfs.com/ipfs/QmNSK1RScZZNEk1m7upuXBXGxvvZuyuvJqzV5imo9d7Fes', 
        /* 'ipfs://QmZDHNcQZcZkPeECgSzW1wtLDgo7VsQYs5gjqSW6Y6SwUa', */ // random gif as profile picture
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
      images_per_stack: 25,
    },
  ],
  populations: generate_populations(false) as PopulationConfig[],
  anim_outputs: [],
  collage_outputs: [
    collage300,
    collage1600,
    collage4444,
    collage4000,
    collageOpenSea1200x75,
    collageDiscord600x240,
    collageTwitter1200x675,
    collageTwitter1500x500,
  ],
  excluded_layers_from_metadata: [],
};
