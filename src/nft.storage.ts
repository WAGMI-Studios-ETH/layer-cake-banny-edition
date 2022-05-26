import fs, { existsSync, readdirSync, statSync } from 'fs';
import { Asset } from './asset';
import path, { basename } from 'path';
import { readdir, readFile } from 'fs/promises';
import { the_project } from './project';
import { delay, logger } from './utils';
import { NFTStorage, File } from 'nft.storage';
import { IPFS_BASE_URL, NFT_STORAGE_API_KEYS } from './config';
import { save_assets_state } from '.';
import type { CIDString } from 'nft.storage/dist/src/lib/interface';
import { boolean } from 'yargs';
import { readDirectory } from './compile-template';

// TODO: experiment with more or less to get stable and faster build
const MAX_BATCH_ASSETS = 20;

const nft_storage = new NFTStorage({ token: NFT_STORAGE_API_KEYS[NFT_STORAGE_API_KEYS.length - 1] });

function image_cid_checker(asset: Asset) {
  return asset.images_cid.length > 0;
}

function image_paths_selector(asset: Asset) {
  const paths = [];
  paths.push(`${asset.image_folder}/original/${asset.base_name}.png`);
  for (const output of the_project.config.image_outputs) {
    if (output.ipfs_tag.length > 0) {
      paths.push(`${asset.image_folder}/${output.tag}/${asset.base_name}${output.ipfs_tag}.png`);
    }
  }

  if (the_project.config.metadata_input.population_metadata?.animation_url) {
    paths.push(`${asset.html_folder}/${asset.base_name.replace(/^0+/, '')}.html`);
  }
  return paths;
}

function image_cid_distributor(asset: Asset, cid: string, thumb_tag: string) {
  asset.images_cid = cid;
  asset.image_url = `${IPFS_BASE_URL}${cid}/${asset.base_name}.png`;
  asset.thumb_url = `${IPFS_BASE_URL}${cid}/${asset.base_name}${thumb_tag}.png`;

  if (the_project.config.metadata_input.population_metadata?.animation_url) {
    asset.animation_url = `${IPFS_BASE_URL}${cid}/${asset.base_name.replace(/^0+/, '')}.html`;
  }
}

function animation_url_distributor(asset: Asset, cid: string) {
  asset.animation_url = `${IPFS_BASE_URL}${cid}/${asset.base_name.replace(/^0+/, '')}.html`;
}

function metadata_cid_checker(asset: Asset) {
  // return false;
  return asset.metadata_cid.length > 0;
}

function metadata_path_selector(asset: Asset) {
  return [`${asset.json_folder}/ethereum/${asset.base_name.replace(/^0+/, '')}`];
}

function metadata_cid_distributor(asset: Asset, cid: string, thumb_tag: string) {
  asset.metadata_cid = cid;
  asset.metadata_url = `${IPFS_BASE_URL}${cid}/${asset.base_name.replace(/^0+/, '')}`;
}

type CidChecker = (asset: Asset) => boolean;
type PathSelector = (asset: Asset) => string[];
type CidDistributor = (asset: Asset, cid: string, thumb_tag: string) => void;

// TODO: dynamic with the number of .env keys avialable, possibly scale
const WORKERS = 3;
const storages: NFTStorage[] = [];

function init_storages() {
  if (WORKERS > NFT_STORAGE_API_KEYS.length) {
    throw new Error('Not enough storage keys for workers');
  }
  if (!storages.length) {
    for (let i = 0; i < WORKERS; i++) {
      storages.push(new NFTStorage({ token: NFT_STORAGE_API_KEYS[i] }));
    }
  }
}

async function upload_all_asset_artifacts(
  assets: Asset[],
  cid_checker: CidChecker,
  path_selector: PathSelector,
  cid_distributor: CidDistributor,
) {
  init_storages();
  const promises: Promise<void>[] = [];
  const chunk_size = Math.ceil(assets.length / WORKERS);

  for (let i = 0; i < WORKERS; i++) {
    let end = (i + 1) * chunk_size;
    if (end > assets.length) end = assets.length;
    const chunk = assets.slice(i * chunk_size, end);
    promises.push(upload_asset_artifacts(chunk, cid_checker, path_selector, cid_distributor, storages[i]));
  }
  await Promise.all(promises);
  save_assets_state(assets);
}

function wait(milliseconds: number) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function upload_asset_artifacts(
  assets: Asset[],
  cid_checker: CidChecker,
  path_selector: PathSelector,
  cid_distributor: CidDistributor,
  storage: NFTStorage,
) {
  let thumb_tag = '';
  for (const output of the_project.config.image_outputs) {
    if (output.tag === 'icon') {
      thumb_tag = output.ipfs_tag;
    }
  }

  let batch_assets: Array<Asset> = [];
  let did_something = false;
  do {
    // repeat until assets are fully uploaded
    did_something = false;
    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i];
      if (cid_checker(asset)) {
        continue;
      }
      batch_assets.push(asset);
      did_something = true;
      if (batch_assets.length >= MAX_BATCH_ASSETS) {
        logger.info(`uploading ${batch_assets.length} assets, ${assets.length - i} remaining`);
        const paths = [];
        for (const upload_asset of batch_assets) {
          paths.push(...path_selector(upload_asset));
        }
        const result = await upload_files([...new Set(paths)]);
        await wait(1000);
        if (result.cid) {
          for (const upload_asset of batch_assets) {
            cid_distributor(upload_asset, result.cid, thumb_tag);
          }
          //save_assets_state(assets);
        } else {
          logger.error('batch cid missing');
        }

        batch_assets = [];
      }
    }
  } while (did_something);
  if (batch_assets.length > 0) {
    logger.info(`uploading ${batch_assets.length} assets`);
    const paths = [];
    for (const upload_asset of batch_assets) {
      paths.push(...path_selector(upload_asset));
    }
    const result = await upload_files(paths);
    if (result.cid) {
      for (const upload_asset of batch_assets) {
        cid_distributor(upload_asset, result.cid, thumb_tag);
      }
      //save_assets_state(assets);
    } else {
      logger.error('batch cid missing');
    }
  }
}

export async function upload_all_images(assets: Asset[]) {
  await upload_all_asset_artifacts(assets, image_cid_checker, image_paths_selector, image_cid_distributor);
}

export async function upload_all_animation(assets: Asset[]) {
  function animation_cid_checker(asset: Asset) {
    return asset.animation_url?.length > 0;
  }
  if (assets.length) {
    const files = readdirSync(assets[0].html_folder)
      .map(name => `${assets[0].html_folder}/${name}`)
      .filter(file => {
        const matchedAsset = assets.find(
          asset => `${asset.html_folder}/${asset.base_name.replace(/^0+/g, '')}.html` === file,
        );
        if (matchedAsset) {
          return !matchedAsset?.animation_url;
        }
        return true;
      });
    const { cid, success } = await wrap_and_pin_folders_and_files_to_ipfs(files);
    if (cid && success) {
      await Promise.all(assets.map(async asset => await animation_url_distributor(asset, cid)));
    }
  }
}

export async function upload_all_metadata(assets: Asset[]) {
  await upload_all_asset_artifacts(assets, metadata_cid_checker, metadata_path_selector, metadata_cid_distributor);
}

// works up to 64MB
const MINIMAL_FILES = false;
export async function wrap_and_pin_folders_to_ipfs(content_folders: string[]) {
  const api_key = NFT_STORAGE_API_KEYS[NFT_STORAGE_API_KEYS.length - 1];
  const storage = new NFTStorage({ token: api_key });
  const files_with_contents: any[] = [];
  try {
    for (const content_folder of content_folders) {
      const filenames = await readdir(content_folder);
      logger.debug(`folder:${content_folder}` + `\n` + `total files:${filenames.length} files` + `\n` + `\n`);
      logger.debug(filenames);
      const n = MINIMAL_FILES ? 3 : filenames.length;
      for (let i = 0; i < n; i++) {
        const filename = filenames[i];
        logger.debug(`${content_folder}/${filename}` + `\n`);
        files_with_contents.push(new File([await readFile(`${content_folder}/${filename}`)], filename));
      }
      logger.debug(`directory (${filenames.length}):${content_folder}`);
    }
    logger.debug(`loaded ${files_with_contents.length} files into memory`);
    const cid = await storage.storeDirectory(files_with_contents);
    const status = await storage.status(cid);
    logger.debug(status);
    return {
      cid: cid,
      ipfs_status: status,
      success: true,
    };
  } catch (e) {
    logger.error(`error loading to ipfs: ${JSON.stringify(e)}`);
    return {
      success: false,
      cid: undefined,
      ipfs_status: undefined,
    };
  }
}

export async function wrap_and_pin_folders_and_files_to_ipfs(paths: string[]) {
  const api_key = NFT_STORAGE_API_KEYS[NFT_STORAGE_API_KEYS.length - 1];
  const storage = new NFTStorage({ token: api_key });
  const files_with_contents: any[] = [];
  try {
    for (const _path of paths) {
      const stats = statSync(_path);
      const filenames: string[] = [];
      if (stats.isDirectory()) {
        (await readdir(_path)).map(filename => filenames.push(filename));
        logger.debug(`folder:${_path}` + `\n` + `total files:${filenames.length} files` + `\n` + `\n`);
        logger.debug(filenames);
        const n = MINIMAL_FILES ? 3 : filenames.length;
        for (let i = 0; i < n; i++) {
          const filename = filenames[i];
          logger.debug(`${_path}/${filename}\n`);
          files_with_contents.push(new File([await readFile(`${_path}/${filename}`)], filename));
        }
        logger.debug(`directory (${filenames.length}):${_path}`);
      } else if (stats.isFile()) {
        const filename = basename(_path);
        console.log(_path);
        filenames.push(filename);
        files_with_contents.push(new File([await readFile(_path)], filename));
      }
    }
    logger.debug(`loaded ${files_with_contents.length} files into memory`);
    const cid = await storage.storeDirectory(files_with_contents);
    const status = await storage.status(cid);
    logger.debug(status);
    return {
      cid: cid,
      ipfs_status: status,
      success: true,
    };
  } catch (e) {
    logger.error(`error loading to ipfs: ${JSON.stringify(e)}`);
    return {
      success: false,
      cid: undefined,
      ipfs_status: undefined,
    };
  }
}

function get_size_of_asset_files(asset: Asset) {
  let size = 0;
  const path = `${asset.image_folder}/original/${asset.base_name}.png`;
  if (fs.existsSync(path)) {
    const s = fs.statSync(path);
    console.log(`(original) ${path} is ${s.size}`);
    size += s.size;
  } else {
    logger.warn(`couldn't find ${path} for upload`);
  }
  for (const output of the_project.config.image_outputs) {
    if (output.ipfs_tag.length > 0) {
      // this should be uploaded.
      const p = `${asset.image_folder}/${output.tag}/${asset.base_name}${output.ipfs_tag}.png`;
      if (fs.existsSync(p)) {
        const s = fs.statSync(p);
        console.log(`(${output.tag}) ${p} is ${s.size}`);
        size += s.size;
      } else {
        logger.warn(`couldn't find ${p} for upload`);
      }
    }
  }
  return size;
}

const UPLOAD_TIMEOUT = 30_000;
async function upload_files(paths: string[]) {
  const files_with_contents: File[] = [];
  let filenames = '';
  try {
    for (const _path of new Set(paths)) {
      if (existsSync(_path)) {
        const filename = basename(_path);
        console.log(_path);
        filenames += `${filename},  `;
        files_with_contents.push(new File([await readFile(_path)], filename));
      }
    }
    const track_time = async <A>(asyncFn: () => Promise<A>, id: string | undefined = undefined) => {
      const starttime = new Date().getTime();
      const res = await asyncFn();
      const time = (new Date().getTime() - starttime) / 1000;
      const id_str = id ? `<${id}>` : '';
      console.log(`ipfs upload directory Promise ${id_str}`);
      console.log(`upload ${time} seconds`);
      return res;
    };
    /*
    const timeout_promise = new Promise((_, reject) => {
      setTimeout(() => {
        reject();
      }, UPLOAD_TIMEOUT);
    });
    const storage_promise = nft_storage.storeDirectory(files_with_contents);
  */
    const result = await track_time(() => nft_storage.storeDirectory(files_with_contents), filenames);
    const cid_string: CIDString = result;
    const status = await nft_storage.status(cid_string);
    console.log(`nft_storage status => `);
    console.log(status);
    return {
      cid: cid_string,
      success: true,
    };

    // TODO: test whether necessary.
    // await nft_storage.status(cid);
  } catch (e) {
    logger.error(`error loading to ipfs: ${JSON.stringify(e)}`);
    return {
      success: false,
      cid: undefined,
    };
  }
}
