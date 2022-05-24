/* eslint-disable no-shadow */
import fs from 'fs';
import dotenv from 'dotenv';
import { Population, Trait } from './interfaces';
import { ensure_folders_exist, the_project } from './project';
import { validate_all_assets_for_contract, validate_all_assets_for_ipfs } from './validation';
import { get_possible_permutation_count, get_permutations } from './permutations';
import { generate_metadata } from './metadata/metadata';
import {
  compute_asset_hash as compute_asset_hashes,
  generate_all_collages,
  generate_all_outputs,
  generate_all_stacked_gifs,
} from './layer';
import { invoke_contract } from './contract';
import { calculate_stats } from './stats';
import { delay, logger, log_traits_arrays } from './utils';
import { output_contract_csv, output_csv, output_rarity_report_csv } from './csv';
import { Asset, create_assets } from './asset';
import { upload_all_animation, upload_all_images, upload_all_metadata } from './nft.storage';
import { createHash } from 'crypto';
import { shuffle_array } from './utils/randomize';
import compileTemplate from './compile-template';

async function flip_image_file(path: string) {
  /* TODO: if configured, flip a few of the images */
}

function get_rarity_percent_from_trait_filename(filename: string) {
  const rare_re = new RegExp('_r[0-9]+.');
  const has_rare = rare_re.test(filename);
  const unique_re = new RegExp('_u[0-9]+.');
  const has_unique = unique_re.test(filename);

  if (has_rare) {
    const rare_marker_index = filename.lastIndexOf('_r');
    const until = filename.lastIndexOf('.');
    if (rare_marker_index > 0 && until > 0 && rare_marker_index + 2 < until) {
      const numeric = filename.slice(rare_marker_index + 2, until);
      let rarity: number;
      if (numeric[0] === '0') {
        rarity = parseFloat('.' + numeric);
      } else {
        rarity = parseInt(numeric);
      }
      return rarity;
    }
  } else if (has_unique) {
    const rare_marker_index = filename.lastIndexOf('_u');
    const until = filename.lastIndexOf('.');
    if (rare_marker_index > 0 && until > 0 && rare_marker_index + 2 < until) {
      const numeric = filename.slice(rare_marker_index + 2, until);
      let rarity: number;
      if (numeric[0] === '0') {
        // there shouldn't be fractional _u assets, but just in case:
        rarity = (1 / the_project.total_populations_size) * 100;
      } else {
        rarity = (parseInt(numeric) / the_project.total_populations_size) * 100;
      }
      return rarity;
    }
  }
  return 100;
}

function get_trait_arrays(population: Population) {
  const traits_arrays: Trait[][] = [];
  const USE_FULL_FILENAME = true;
  const ordering = population.config.layer_order;

  for (let p = 0; p < ordering.length; p++) {
    const trait = ordering[p];
    traits_arrays[p] = [];
    try {
      const filenames = fs.readdirSync(`${population.traits_folder}/${trait}`);
      filenames.map(name => {
        const val = USE_FULL_FILENAME ? `${name}` : `${name.split('.')[0]}`;
        const unique_re = new RegExp('_u[0-9]+.');
        const unique = unique_re.test(name);
        const percent_rarity = get_rarity_percent_from_trait_filename(name);
        traits_arrays[p].push({
          trait_type: trait,
          value: val,
          rarity_name: '',
          count_like_it: 0,
          percent_like_it: 0,
          unique,
          percent_rarity: percent_rarity,
        });
      });
    } catch (e) {
      logger.error(`error in locating ${population.traits_folder}/${trait}`);
    }
  }
  false && log_traits_arrays(ordering, traits_arrays);
  return traits_arrays;
}

export function save_assets_state(all_assets: Asset[]) {
  logger.info(`saving assets state`);
  const path = `${the_project.output_folder}/assets.json`;
  if (fs.existsSync(path)) fs.rmSync(path);
  fs.writeFileSync(path, JSON.stringify(all_assets));
}

function load_assets_state() {
  const path = `${the_project.output_folder}/assets.json`;
  if (fs.existsSync(path)) {
    return JSON.parse(fs.readFileSync(path).toString());
  }
}

async function get_all_assets(
  asset_index_origin = 1,
): Promise<{ all_assets: Array<Asset>; all_trait_names: Array<string> }> {
  let all_assets: Asset[] = [];
  const all_trait_names = [];

  the_project.total_populations_size = 0;
  for (const population of the_project.populations) {
    const priorities = population.config.layer_order;
    all_trait_names.push(...priorities);
    the_project.total_populations_size += population.config.population_size;
  }

  logger.info(`total configured meta-population size is ${the_project.total_populations_size}`);
  await delay(3000);

  let shuffled_ordering;
  if (the_project.config.shuffle_assets) {
    shuffled_ordering = get_shuffled_ordering(the_project.total_populations_size);
  } else {
    shuffled_ordering = get_original_ordering(the_project.total_populations_size);
  }

  if (the_project.config.resume_folder.length < 1) {
    let asset_index_origin = 0;
    for (const population of the_project.populations) {
      logger.info(`population ${population.config.name}`);
      const priorities = population.config.layer_order;
      const traits_arrays = get_trait_arrays(population);
      const universe = get_possible_permutation_count(priorities, traits_arrays);
      let pop_size = population.config.population_size;
      if (the_project.config.stunt_populations_to && the_project.config.stunt_populations_to < pop_size) {
        pop_size = the_project.config.stunt_populations_to;
      }

      const combinations = await get_permutations(pop_size, universe, traits_arrays);
      ensure_folders_exist([
        the_project.output_folder,
        `${the_project.output_folder}/metadata`,
        `${the_project.output_folder}/assets`,
      ]);

      population.assets = await create_assets(
        the_project,
        population,
        combinations,
        asset_index_origin,
        shuffled_ordering,
      );
      all_assets.push(...population.assets);

      const { assets } = population;
      await generate_all_outputs(assets, population);
      population.assets = assets.filter(asset => {
        return asset.image_ready;
      });
      if (assets.length < pop_size) {
        logger.error(`too much fail, exiting`);
        process.exit();
      } else {
        population.assets = assets.slice(0, pop_size);
      }
      asset_index_origin += population.assets.length;
    }

    save_assets_state(all_assets);
    logger.info(`collage commencing`);
    await generate_all_collages(the_project.populations[0].assets[0]);
    logger.info(`stacked gifs commencing`);
    await generate_all_stacked_gifs(all_assets);
  } else {
    all_assets = load_assets_state();
    if (the_project.config.re_generate_metadata_cid) {
      all_assets = all_assets.map((asset: Asset) => ({ ...asset, metadata_cid: '' }));
    }
    if (the_project.config.re_generate_collages && the_project.config.resume_folder.length < 1) {
      // user has set re-gen collages, and we didn't just generate them.
      logger.info(`regen collage commencing`);
      await generate_all_collages(all_assets[0]);
      logger.info(`regen stacked gifs commencing`);
      await generate_all_stacked_gifs(all_assets);
    }
    logger.info(`loaded ${all_assets.length} assets for upload`);
  }

  console.log('#########################################################');
  await compileTemplate(
    all_assets.map((asset, index) => ({ tokenId: asset.base_name.replace(/^0+/, '') })),
    'src/template',
    `${the_project.output_folder}/html/`,
  );
  console.log('#########################################################');

  return { all_assets, all_trait_names };
}

function output_provenance_hash(all_assets: Asset[]) {
  const files = all_assets.map(asset => {
    return { name: asset.batch_index + 1, hash: asset.image_hash };
  });
  files.sort(function (a, b) {
    return a.name - b.name;
  });
  let hashes = '';
  files.forEach(file => {
    hashes += file.hash;
  });
  const hash = createHash('sha256');
  hash.update(hashes);
  const provenance = hash.digest('hex');
  const output = {
    files: files,
    provenance: provenance,
  };
  const path = `${all_assets[0].json_folder}/provenance.json`;
  if (fs.existsSync(path)) {
    fs.rmSync(path);
  }
  fs.writeFileSync(path, JSON.stringify(output, null, 3));
}

function get_shuffled_ordering(size: number) {
  const array = [];
  for (let i = 0; i < size; i++) {
    array.push(i);
  }
  shuffle_array(array);
  return array;
}

function get_original_ordering(size: number) {
  const array = [];
  for (let i = 0; i < size; i++) {
    array.push(i);
  }
  return array;
}

const run = async () => {
  dotenv.config();
  const { all_assets: all_assets_, all_trait_names } = await get_all_assets();
  const all_assets = all_assets_.map(asset => ({ ...asset, metadata_cid: '' }));
  validate_all_assets_for_ipfs(all_assets);
  await compute_asset_hashes(all_assets);

  if (the_project.config.upload_images_to_ipfs) await upload_all_animation(all_assets);
  if (the_project.config.upload_images_to_ipfs) await upload_all_images(all_assets);

  // @ts-ignore
  console.warn(`generating metadata`);
  for (const asset of all_assets) await generate_metadata(asset);
  console.warn(`metadata finished`);

  // @ts-ignore
  if (the_project?.config?.upload_metadata_to_ipfs) await upload_all_metadata(all_assets);
  console.log('metadata uploaded to IPFS');

  calculate_stats(all_assets);
  await output_csv(
    all_assets,
    all_trait_names.filter(name => the_project.config.excluded_layers_from_metadata.indexOf(name) === -1),
    `${the_project.output_folder}/${the_project.config.name}.csv`,
  );

  // @ts-ignore
  const path = `${the_project.output_folder}/${the_project.config.name}.contract.csv`;
  await output_contract_csv(all_assets, path);
  const rarity_path = `${the_project.output_folder}/${the_project.config.name}.rarity.csv`;
  await output_rarity_report_csv(all_assets, all_trait_names, rarity_path);
  output_provenance_hash(all_assets);

  /* 
  validate_all_assets_for_contract(all_assets);
  await invoke_contract(all_assets);
  */

  logger.warn(`${the_project.config.name} completed`);
};

// eslint-disable-next-line no-void
void run();
