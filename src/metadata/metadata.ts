import fs from 'fs';
import { Asset } from '../asset';
import { Dynamic, logger } from '../utils';
import { the_project } from '../project';
import { Trait } from '../interfaces';
import { Stat } from './stats';
import { generate_tezos_metadata } from './tezos-metadata';
import { generate_ethereum_metadata } from './eth-metadata';

export async function generate_metadata(asset: Asset) {
  const mos = the_project.config.metadata_outputs;
  for (const mo of mos) {
    switch (mo) {
      case 'tezos': {
        const md = generate_tezos_metadata(asset, the_project.config.excluded_layers_from_metadata);
        write_metadata_to_file(asset, md, 'tezos');
        break;
      }
      case 'ethereum': {
        const md = generate_ethereum_metadata(asset);
        write_metadata_to_file(asset, md, 'ethereum');
        break;
      }
      default: {
        throw Error(`metadata kind ${mo} unsupported`);
      }
    }
  }
};

export const strip_extension = (value: string): string => {
  return value.slice(0, value.lastIndexOf('.'));
};
function write_metadata_to_file(asset: Asset, md: Dynamic, sub_folder: string) {
  const extension = the_project.config.metadata_file_extension ? '.json' : '';
  const folder = `${asset.json_folder}/${sub_folder}`;
  const p = `${folder}/${asset.batch_index + 1}${extension}`;
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }

  try {
    if (fs.existsSync(p)) {
      logger.debug(`deleting ${p}`);
      fs.rmSync(p);
    }
    fs.writeFileSync(p, JSON.stringify(md, null, 3));
  } catch (err) {
    logger.error(`error writing json to ${p} ${JSON.stringify(err)}`);
  }
};

export function replace_underscores(input: string) {
  return input.replace(/_/g, ' ');
};

export function change_to_sentence_case(input: string) {
  return input.toLowerCase().replace(/^\w/, c => c.toUpperCase());
};

export function trait_boost(trait: Trait, stats: Stat[]) {
  for (const boost of stats) {
    for (const keyword of boost.max_keywords) {
      if (trait.value.toLowerCase().indexOf(keyword) > -1) {
        return {
          stat_name: boost.stat_name,
          maxxed: true,
        };
      }
    }
    for (const keyword of boost.trigger_keywords) {
      if (trait.value.toLowerCase().indexOf(keyword) > -1) {
        return {
          stat_name: boost.stat_name,
          maxxed: false,
        };
      }
    }
  }
};
