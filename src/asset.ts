import { Project, the_project } from './project';
import { Trait, Population } from './interfaces';
import { BLANK, parse_csv, zero_pad } from './utils';
import { MARGIN_FOR_ERROR } from './config';
import fs from 'fs';
import path from 'path';

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
  attribs: Array<Trait>;
  rotation = 0;
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
    this.base_name = zero_pad(this.batch_index + 1, population_digits);
    this.image_folder = `${output_dir}/assets`;
    this.json_folder = `${output_dir}/metadata`;
    this.json_path = `${this.json_folder}/${this.base_name}.json`;
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
  if (project.config.metadata_input.population_metadata?.metadata_source) {
    const jsonMetadata = (await parse_csv(
      path.join(__dirname, '..', project.config.metadata_input.population_metadata?.metadata_source),
    )) as any[];
    const name = population.config.name
      .replace(/Character_?/, '')
      .replace(/_/g, ' ')
      .split(/\d+/)?.[0]
      ?.trim();
    const matched = jsonMetadata.find(item => name === item['Banny Name']);
    if (matched) {
      for (let j = 0; j < project.config.metadata_input.population_metadata?.include_columns?.length; j++) {
        const column = project.config.metadata_input.population_metadata?.include_columns?.[j];
        const renamed_column = project.config.metadata_input.population_metadata?.rename_columes_attributes?.[j];
        if (column && renamed_column && typeof matched[column] !== 'undefined') {
          attribs.push({
            trait_type: renamed_column,
            value: matched[column].match(/^\d+$/) ? Number(matched[column]) : matched[column],
          });
        }
      }
    }
  }
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
