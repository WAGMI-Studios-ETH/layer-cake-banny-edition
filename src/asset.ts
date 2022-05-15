import { Project, the_project } from './project';
import { Trait, Population } from './interfaces';
import { BLANK, zero_pad } from './utils';
import { MARGIN_FOR_ERROR } from './config';

export class Asset {
  image_folder: string;
  image_ready = false;
  json_path: string;
  json_folder: string;
  trait_dir: string;
  image_hash: string = BLANK;
  image_size: number = 0;
  thumb_hash: string = BLANK;
  batch_index: number;
  base_name: string;
  images_cid = BLANK;
  image_url = BLANK;
  thumb_url = BLANK;
  metadata_cid = BLANK;
  metadata_url = BLANK;
  traits: Array<Trait>;
  rotation = 0;
  constructor(batch_index: number, traits: Array<Trait>, layered_assets_dir: string, output_dir: string) {
    const population_digits = the_project.total_populations_size.toString().length;
    this.traits = traits;
    this.batch_index = batch_index;
    this.base_name = zero_pad(this.batch_index + 1, population_digits);
    this.image_folder = `${output_dir}/assets`;
    this.json_folder = `${output_dir}/metadata`;
    this.json_path = `${this.json_folder}/${this.base_name}.json`;
    this.trait_dir = `${layered_assets_dir}/Traits`;
  }
};

export function create_assets(
  project: Project,
  population: Population,
  combinations: any[][],
  asset_index_origin: number,
  shuffled_ordering: number[],
) {
  let i = asset_index_origin;
  const target = Math.ceil(population.config.population_size * MARGIN_FOR_ERROR);
  const assets: Asset[] = [];
  for (const combo of combinations) {
    assets.push(
      new Asset(
        shuffled_ordering[i++],
        combo,
        `${population.input_folder}/${project.config.name}/${population.config.name}`,
        project.output_folder,
      ),
    );
  }
  return assets;
};
