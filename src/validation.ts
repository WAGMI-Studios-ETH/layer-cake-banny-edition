import fs from 'fs';
import { Asset } from './asset';
import { logger } from './utils';
import { the_project } from './project';

export function validate_all_assets_for_ipfs(assets: Asset[]) {
  let valid = true;
  assets.forEach(asset => {
    valid = valid && validate_asset_for_ipfs(asset);
  });
  if (valid) {
    logger.warn(`images ready to pin`);
  } else {
    logger.error(`invalid asset detected, aborting ipfs pin`);
    process.exit();
  }
}

export function validate_asset_for_ipfs(asset: Asset): boolean {
  let valid = true;
  const paths = [`${asset.image_folder}/original/${asset.base_name}.png`];
  for (const output of the_project.config.image_outputs) {
    paths.push(`${the_project.output_folder}/${asset.image_hash}/${output.tag}/${asset.base_name}.png`);
  }

  for (const path in paths) {
    if (file_exists_and_non_empty(path)) {
      if (!asset.image_ready) logger.warn(`asset ${asset.base_name} not ready.`);
      valid = valid && asset.image_ready;
    }
  }
  return valid;
}

function file_exists_and_non_empty(path: string) {
  if (fs.existsSync(path)) {
    const stat = fs.statSync(path);
    if (stat.size > 10) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export function validate_all_assets_for_contract(assets: Asset[]) {
  let valid = true;
  assets.forEach(asset => {
    valid = valid && validate_asset_for_contract(asset);
  });

  if (valid) {
    logger.warn(`assets ready for contract`);
  } else {
    logger.error(`invalid asset detected, aborting contract`);
    process.exit();
  }
}

export function validate_asset_for_contract(asset: Asset): boolean {
  const h = asset.image_hash;
  const json_path = `${asset.json_folder}/tezos/${asset.base_name.replace(/^0+/, '')}.json`;

  if (file_exists_and_non_empty(json_path)) {
    if (asset.images_cid.length < 11) {
      logger.warn(`asset ${h} CID missing.`);
    }
    return asset.images_cid.length > 10;
  }
  logger.error(`couldn't find ${json_path} or file too small`);
  return false;
}
