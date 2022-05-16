/* eslint-disable max-len */
import moment from 'moment';
import { CollageOutput, ProjectConfig } from '../interfaces';
import { random } from '../utils';
import {
  collage11110,
  collage1600,
  collage4444,
  collage4000,
  collage5000,
  collageOpenSea1200x75,
  collageDiscord600x240,
  collageTwitter1200x675,
  collageTwitter1500x500,
  collage10000,
} from './collages';

const iso_datetime_now = new Date().toISOString();

/*
 * @dev colors defined here are used to fill the grid on OpenSea interfaces prior to the NFT fully downloading
 */
export const banny_colors = [
  /*
  'F6A3AD',
  'FF808D',
  'FFAFB9',
  'CBEEC2',
  '8EE9F2',
  'F5F3BA',
  '71CEF3',
  'FCEEB2',
  'FCAD5E',
  'FB6155',
  'E5BBD7',
  'AFD7D0',
  */
];

export const banny_description: string = `Juicebox Governance Banny is a governance token that represents an individual's voting weight. In addition to the utility of Juicebox governance participation, holders are invited to visit https://bannyverse.xyz where they can mint custom Banny's which are characters in the BannyVerse.

About Juicebox DAO, WAGMI Studios and our Lord and Savior Banny.  

Juicebox, https://juicebox.money, is a programmable treasury for community-owned Ethereum projects. 

WAGMI Studios, https://wagmistudios.xyz; http://wagmistudios.info/, is a collective of quirky creatives making sure "we're all gonna make it" and the home of Lord Banny, our Savior.  

BannyVerse, https://bannyverse.xyz, Banny is an anthropomorphic banana, who provides visual aesthetics to all things Juicebox including its website and documentation.  Banny enjoys hash hot knifing, educating anyone and everyone on the Juicebox protocol, and paradoying our favorite meatsack film characters.  Banny is also the protagonist in the epic fruit salad saga, the BannyVerse, an adventure mystery pay-to-have, play-to-earn, have-to-enjoy status-symbol-utility-art-jpeg masquerading as unapproachable, Web3, hard-core art with IRL finanacial FOMO-inducing consequences.
`;

const wagmi_studios = 'https://wagmistudios.xyz';
const population_size = 4000;

export const bannyConfig: ProjectConfig = {
  name: `banny-permutations`,
  upload_images_to_ipfs: false,
  upload_metadata_to_ipfs: false,
  shuffle_assets: false,
  resume_folder: '',
  re_generate_collages: false,
  metadata_outputs: ['ethereum'],
  metadata_file_extension: false,
  hide_rarity_names: true,
  rotated_images_allowed: 0,
  mirror_images_allowed: 0,
  // asset_origin: 0,
  metadata_input: {
    name: `Juicebox Governance Banny`,
    symbol: 'veJBX-',
    description: banny_description,
    birthdate: '-22100400', // 4/20/69
    background_colors: banny_colors,
    minter: `tankbottoms.eth`,
    creators: [`@WagmiStudios`],
    publishers: [`@WagmiStudios`],
    genres: [`Banny`, `banana`, `character`, `profile`],
    tags: [`ETH`],
    drop_date: `${iso_datetime_now}`,
    native_size: '1000x1000',
    more_info_link: wagmi_studios,
    include_total_population_in_name: true,
    royalties: {
      artist_address: `wagmistudios.eth`,
      artist_percentage: 5,
      additional_payee: 'natasha-pankina.eth',
      additional_payee_percentage: 5,
    },
    opensea: {
      // https://docs.opensea.io/docs/contract-level-metadata
      name: 'Juicebox Governance Banny',
      description: banny_description,
      image: '', // random gif as profile picture
      external_link: wagmi_studios,
      seller_fee_basis_points: 250, // Indicates a 1% seller fee.
      fee_recipient: `wagmistudios.eth`,
    },
    rights: `© 2022 JuiceBox DAO, WAGMI Studios.xyz All rights reserved.`,
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
      max_stacks: 20,
      images_per_stack: 25,
    },
  ],
  populations: [
    {
      name: 'verified-layers',
      layer_order: [
        /* 'Background', */
        'Body',
        'Face',
        'Outfit',
        'Choker',
        'Oral_Fixation',
        'Headgear',
        'Legs',
        'Left_Hand',
        'Right_Hand',
        /* 'Both_Hands', */
      ],
      population_size: population_size,
    },
    /*
    {
      name: 'Basic_Combined_Ambidextrous',
      layer_order: [
        'Background',
        'Frame',
        'Body',
        'Face',
        'Outfits',
        'Choker',
        'Oral_Fixation',
        'Headgear',
        'Lower_Accessory',
        'Left_Hand',
        'Right_Hand',
        'Both_Hands',
      ],
      population_size: population_size,
    },
    {
      name: 'Character_Harley_Quinn',
      layer_order: [
        'Background',
        'Frame',
        'Body',
        'Face',
        'Outfits',
        'Choker',
        'Oral_Fixation',
        'Headgear',
        'Lower_Accessory',
        'Left_Hand',
        'Right_Hand',
        'Both_Hands',
      ],
      population_size: 1,
    },
    {
      name: 'Character_Harley_Quinn_Accessory',
      layer_order: [
        'Background',
        'Frame',
        'Body',
        'Face',
        'Outfits',
        'Choker',
        'Oral_Fixation',
        'Headgear',
        'Lower_Accessory',
        'Left_Hand',
        'Right_Hand',
        'Both_Hands',
      ],
      population_size: population_size,
    },
    {
      name: 'Character_Banana_Surfer',
      layer_order: [
        'Background',
        'Frame',
        'Body',
        'Face',
        'Outfits',
        'Choker',
        'Oral_Fixation',
        'Headgear',
        'Lower_Accessory',
        'Left_Hand',
        'Right_Hand',
        'Both_Hands',
      ],
      population_size: 1,
    },
    {
      name: 'Character_Banana_Surfer_Accessory',
      layer_order: [
        'Background',
        'Frame',
        'Body',
        'Face',
        'Outfits',
        'Choker',
        'Oral_Fixation',
        'Headgear',
        'Lower_Accessory',
        'Left_Hand',
        'Right_Hand',
        'Both_Hands',
      ],
      population_size: population_size,
    },
    {
      name: 'Character_Wonder_Woman',
      layer_order: [
        'Background',
        'Frame',
        'Body',
        'Face',
        'Outfits',
        'Choker',
        'Oral_Fixation',
        'Headgear',
        'Lower_Accessory',
        'Left_Hand',
        'Right_Hand',
        'Both_Hands',
      ],
      population_size: 1,
    },
    {
      name: 'Character_Wonder_Woman_Accessory',
      layer_order: [
        'Background',
        'Frame',
        'Body',
        'Face',
        'Outfits',
        'Choker',
        'Oral_Fixation',
        'Headgear',
        'Lower_Accessory',
        'Left_Hand',
        'Right_Hand',
        'Both_Hands',
      ],
      population_size: population_size,
    },
    */
  ],
  anim_outputs: [],
  collage_outputs: [
    collage1600,
    collage4444,
    collage4000,
    collageOpenSea1200x75,
    collageDiscord600x240,
    collageTwitter1200x675,
    collageTwitter1500x500,
  ],
  re_generate_metadata_cid: true,
  excluded_layers_from_metadata: [],
};
