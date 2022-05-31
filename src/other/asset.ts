import { Project, the_project } from './project';
import { Trait, Population } from '../interfaces';
import { BLANK, parse_csv, zero_pad } from '../utils';
import { MARGIN_FOR_ERROR } from '../config';
import fs from 'fs';
import path from 'path';

export class Asset {
  image_folder: string;
  image_ready = false;
  json_path: string;
  json_folder: string;
  html_folder: string;
  trait_dir: string;
  image_hash: string = BLANK;
  image_size: number = 0;
  thumb_hash: string = BLANK;
  batch_index: number;
  population_index: number;
  tokenId: number;
  base_name: string;
  images_cid = BLANK;
  image_url = BLANK;
  thumb_url = BLANK;
  metadata_cid = BLANK;
  metadata_url = BLANK;
  traits: Array<Trait>;
  attribs: Array<Trait>;
  rotation = 0;
  animation_url = '';
  constructor(
    batch_index: number,
    traits: Array<Trait>,
    layered_assets_dir: string,
    output_dir: string,
    attribs: any[] = [],
  ) {
    const population_digits = the_project.total_populations_size.toString().length;
    this.traits = traits;
    this.attribs = attribs;
    this.batch_index = batch_index;
    this.tokenId = batch_index + 1;
    this.base_name = zero_pad(this.batch_index + 1, population_digits);
    this.population_index = Math.floor(batch_index / 5);
    this.image_folder = `${output_dir}/assets`;
    this.json_folder = `${output_dir}/metadata`;
    this.html_folder = `${output_dir}/html`;
    this.json_path = `${this.json_folder}/${this.base_name}`;
    this.trait_dir = `${layered_assets_dir}/Traits`;
  }
}

export async function create_assets(
  project: Project,
  population: Population,
  combinations: any[][],
  asset_index_origin: number,
  shuffled_ordering: number[],
) {
  let i = asset_index_origin;
  const target = Math.ceil(population.config.population_size * MARGIN_FOR_ERROR);
  const assets: Asset[] = [];
  const attribs: any[] = [];
  for (const combo of combinations) {
    assets.push(
      new Asset(
        shuffled_ordering[i++],
        combo,
        `${population.input_folder}/${project.config.name}/${population.config.name}`,
        project.output_folder,
        attribs,
      ),
    );
  }
  return assets;
}
