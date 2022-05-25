import fs from 'fs';
import path from 'path';
import * as csv_writer from 'csv-writer';
import { Asset } from './asset';
import { logger, dynamic, zero_pad, Dynamic, IHash } from './utils';
import { Population } from './interfaces';
import { the_project } from './project';
import { string } from 'yargs';
import { replace_underscores } from './metadata/metadata';

const onlyUnique = (value: string, index: number, self: any[]) => {
  return self.indexOf(value) === index;
};

export const strip_rarity = (input: string) => {
  let ret = input;
  if (input.lastIndexOf('_r') > -1) {
    ret = ret.slice(0, ret.lastIndexOf('_r'));
  }
  if (ret.lastIndexOf('_u') > -1) {
    ret = ret.slice(0, ret.lastIndexOf('_u'));
  }
  return ret;
};

export const output_contract_csv = async (assets: Asset[], dest_path: string) => {
  logger.warn(`generating csv`);
  if (assets.length) {
    if (fs.existsSync(dest_path)) fs.rmSync(dest_path);
    const header_entries = [
      { id: 'token_id', title: 'token_id' },
      { id: 'symbol', title: 'symbol' },
      { id: 'name', title: 'name' },
      { id: 'url', title: 'url' },
    ];

    const writer = csv_writer.createObjectCsvWriter({
      path: dest_path,
      header: header_entries,
    });

    const records: {}[] = [];
    assets.forEach(async asset => {
      const rec: dynamic = {};
      rec.token_id = `${asset.batch_index + 1}`; // 1
      rec.symbol = `${the_project.config.metadata_input.symbol}${asset.base_name}`; // GLO0001
      rec.name = `${asset.nftName} No. ${asset.base_name}`; // GloGang No. 1
      rec.url = asset.metadata_url;
      records.push(rec);
    });
    await writer.writeRecords(records);
    logger.info(`${assets.length} records added to ${dest_path}`);
  } else {
    logger.warn(`image/metadata minting returning nothing`);
  }
};

export async function output_rarity_report_csv(assets: Asset[], all_trait_names: string[], dest_path: string) {
  if (assets.length) {
    if (fs.existsSync(dest_path)) fs.rmSync(dest_path);
    const header_entries = [
      { id: 'type', title: 'Trait Type' },
      { id: 'value', title: 'Trait Value' },
      { id: 'enforcedRarity', title: 'Enforced Rarity' },
      { id: 'count', title: 'Count' },
      { id: 'rarity', title: 'Actual Rarity' },
    ];

    const traits = all_trait_names.filter(onlyUnique);
    const writer = csv_writer.createObjectCsvWriter({
      path: dest_path,
      header: header_entries,
    });
    const countsObj: { [k: string]: { count: number; trait_type: string; value: string; rarity: number } } = {};
    const records: {}[] = [];
    assets.forEach(async asset => {
      asset.traits.forEach(trait => {
        const key = `${trait.trait_type}-${trait.value}`;
        if (!countsObj[key])
          countsObj[key] = { count: 1, trait_type: trait.trait_type, value: trait.value, rarity: trait.percent_rarity };
        else countsObj[key].count++;
      });
    });

    for (const trait of traits) {
      for (const countsKey in countsObj) {
        const obj = countsObj[countsKey];
        if (obj.trait_type === trait) {
          const rec: dynamic = {};
          rec.type = replace_underscores(obj.trait_type);
          rec.value = replace_underscores(strip_rarity(strip_extension(obj.value)));
          rec.enforcedRarity = obj.rarity;
          rec.count = obj.count;
          rec.rarity = (obj.count / assets.length) * 100;
          records.push(rec);
        }
      }
    }
    await writer.writeRecords(records);
    logger.info(`${assets.length} records added to ${dest_path}`);
  } else {
    logger.warn(`image/metadata minting returning nothing`);
  }
}

export const output_csv = async (assets: Asset[], all_trait_names: string[], dest_path: string) => {
  logger.warn(`generating csv`);
  const hide_rarity_names = the_project.config.hide_rarity_names;
  if (assets.length) {
    if (fs.existsSync(dest_path)) fs.rmSync(dest_path);
    const header_entries = [
      { id: 'index', title: 'Index' },
      { id: 'filename', title: 'File Name' },
      { id: 'hash', title: 'Image Hash' },
      { id: 'imageUrl', title: 'Image URL' },
      { id: 'imageCid', title: 'CID' },
      { id: 'metaUrl', title: 'Metadata URL ' },
      { id: 'metaCid', title: 'Metadata CID' },
      { id: 'tokenTier', title: 'Token Tier' },
    ];

    const traits = all_trait_names.filter(onlyUnique);
    traits.forEach(trait => {
      // 'Shirt'
      header_entries.push({ id: trait, title: trait });
      // 'Num Shirts Like This'
      header_entries.push({ id: 'num' + trait, title: 'Number ' + trait + ' Like Mine' });
      // 'Pct Shirts Like This'
      header_entries.push({ id: 'pct' + trait, title: 'Percent ' + trait + ' Like Mine' });
      // 'Shirt Rarity'
      if (!hide_rarity_names) {
        header_entries.push({ id: trait + 'rarity', title: trait + ' Rarity' });
      }
    });

    const writer = csv_writer.createObjectCsvWriter({
      path: dest_path,
      header: header_entries,
    });

    const records: {}[] = [];
    assets.forEach(async asset => {
      const rec: dynamic = {};
      rec.filename = `${asset.base_name}.png`; // TODO: nice to have the asset know all the filenames :cry:
      rec.index = asset.batch_index + 1;
      rec.hash = asset.image_hash;
      rec.imageUrl = asset.image_url;
      rec.imageCid = asset.images_cid;
      rec.metaUrl = asset.metadata_url;
      rec.metaCid = asset.metadata_cid;
      asset.traits.forEach(trait => {
        if (the_project.config.excluded_layers_from_metadata.indexOf(trait.trait_type) !== -1) return;
        rec[trait.trait_type] = replace_underscores(strip_rarity(strip_extension(trait.value)));
        rec['num' + trait.trait_type] = trait.count_like_it;
        rec['pct' + trait.trait_type] = trait.percent_like_it;
        if (!hide_rarity_names) {
          rec[trait.trait_type + 'rarity'] = trait.rarity_name;
        }
      });
      records.push(rec);
    });

    await writer.writeRecords(records);
    logger.info(`${assets.length} records added to ${dest_path}`);
  } else {
    logger.warn(`image/metadata minting returning nothing`);
  }
};

const strip_extension = (value: string): string => {
  return value.slice(0, value.lastIndexOf('.'));
};
