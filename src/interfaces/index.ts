import { Asset } from '../asset';
import { OpenSeaStoreInformation } from './metadata';
export { OpenSeaStoreInformation } from './metadata';

export interface IHash {
  [k: string]: string;
}

export interface TraitStat {
  count: number;
  percent: number;
  rarity: string;
}

export interface Trait {
  trait_type: string;
  value: string;
  count_like_it: number;
  percent_like_it: number;
  unique: boolean;
  percent_rarity: number; // the percent of the population allowed to possess this.
  rarity_name: string; // epic
}

export interface PopulationConfig {
  name: string;
  population_size: number;
  layer_order: string[];
}

export interface Population {
  config: PopulationConfig;
  input_folder: string;
  traits_folder: string;
  assets: Asset[];
}

export interface MetadataInput {
  name: string;
  symbol: string;
  description: string;
  opensea: OpenSeaStoreInformation;
  additiona_metadata?: string;
  birthdate?: string;
  background_colors?: string[];
  minter: string;
  creators: Array<string>;
  publishers: Array<string>;
  genres: Array<string>;
  tags: Array<string>;
  drop_date: string;
  native_size: string;
  more_info_link: string;
  include_total_population_in_name: boolean;
  royalties?: {};
  rights?: string;
  decimals: number;
  generation: number;
  edition: number;
  animation_file?: string;

  population_metadata?: {
    specific_to_population: boolean;
    metadata_source: string;
    match_key: string;
    include_columns: string[];
    rename_columes_attributes: string[];
    metadata_type: {
      attribute: boolean;
      levels: string[];
      boosts: boolean;
    };
  };
}

/*
export interface RoyaltyConfig {
  artist_address: string;
  artist_percentage: string;
  additional_payee: string;
  additional_payee_percentage: string;
};
*/

export interface ProjectConfig {
  name: string;
  metadata_input: MetadataInput;
  metadata_outputs: string[];
  populations: PopulationConfig[];
  image_outputs: ImageOutput[];
  anim_outputs: AnimOutput[];
  collage_outputs: CollageOutput[];
  stacked_gif_outputs: StackedGifOutput[];
  upload_images_to_ipfs: boolean;
  upload_metadata_to_ipfs: boolean;
  resume_folder: string;
  re_generate_collages: boolean;
  metadata_file_extension: boolean;
  stunt_populations_to?: number;
  hide_rarity_names?: boolean;
  rotated_images_allowed: number;
  mirror_images_allowed: number;
  shuffle_assets: boolean;
  excluded_layers_from_metadata: string[];
  re_generate_metadata_cid: boolean;
}

export interface ImageOutput {
  width: number;
  height: number;
  tag: string;
  ipfs_tag: string;
}

export interface AnimOutput extends ImageOutput {
  background_animation?: string;
  foreground_anmiation?: string;
}

export interface CollageOutput {
  tag: string;
  source_image_type: string;
  tile_width: number;
  tile_height: number;
  columns: number;
  rows: number;
  max_sheets: number;
  skip_mostly_empty: boolean;
  shuffle: boolean;
}

export interface StackedGifOutput {
  tag: string;
  source_image_type: string;
  images_per_stack: number;
  max_stacks: number;
}

export interface Resolution {
  type: string;
  width: number;
  height: number;
}

export interface Edition {
  edition_size: number;
  resolutions: Resolution[];
  layers_order: Trait[];
}

export interface Base_Configuration {
  instance: Edition;
  input_path: string;
  output_path: string;
  token_urls: string;
  traits_directories: string[];
}
