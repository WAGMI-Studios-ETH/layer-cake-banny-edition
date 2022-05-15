import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import axios from 'axios';
import pinataSDK from '@pinata/sdk';
import { PINATA_API_KEY, PINATA_API_SECRET } from './config';
import { randomInt, createHash } from 'crypto';
import { createSentence } from 'sentence-engine';
import { logger, type } from './utils';

require('dotenv').config();

export const Pinata = pinataSDK(PINATA_API_KEY, PINATA_API_SECRET);

type Files = string | string[];

const token_asset_cache = '.token.filenames.cached';
const token_metadata_cache = 'token.metadata.cached';
const token_asset_ipfs_cid_cache = '.token.ipfs.cid.cached';

const cached_set = [token_asset_cache, token_metadata_cache, token_asset_ipfs_cid_cache];
export const upload_to_ipfs = async (files: Files) => {};

export const compute_file_hash = async (file_path: string): Promise<string> => {
  try {
    const hash = createHash('sha256');
    const input = await fsp.readFile(file_path);
    hash.update(input);
    let result = hash.digest('hex');
    return result;
  } catch (err) {
    if (err instanceof Error) {
      logger.warn(err.message);
      return err.message;
    } else {
      const e = JSON.stringify(err);
      logger.warn(e);
      return e;
    }
  }
};

export const write_to_cache = async (files: any, cache_file_path: string): Promise<void> => {
  try {
    const data = typeof files !== 'string' ? JSON.stringify(files) : files;
    const controller = new AbortController();
    const { signal } = controller;
    const promise = await fsp.writeFile(cache_file_path, data, { signal });
    controller.abort();
    true && logger.info(`successfully write data to ${cache_file_path}`);
    return promise;
  } catch (err) {
    console.error(err);
  }
};

const check_hash_changes = async (hash: string) => {
  try {
    const cache_file_path = '.cache/file-hash.json';
    let files: any = await fsp.readFile(cache_file_path, { encoding: 'utf8', flag: 'r' });
    files = await JSON.parse(files);
    const found = files.find((h: any) => h.hash === hash);
    false && logger.info(`${found.hash ? '==> hash found' : 'hash not found'}`);
    return found;
  } catch (err) {
    return err;
  }
};

export const get_hash_list = async (files: { file_path: string; file_name: string }[]) => {
  try {
    let match = 0;
    const file_list: { hash: string; file_name: string }[] = [];
    for await (const file of files) {
      const file_name = file.file_name;
      const file_path = file.file_path;
      const hash = await compute_file_hash(file_path);
      const check_hash = await check_hash_changes(hash);
      if (check_hash) match++;
      file_list.push({ file_name, hash });
      logger.info(`${file_name} => ${hash}`);
    }
    logger.info(`match file => ${match} file list => ${file_list.length}`);
    if (match === file_list.length) {
      logger.info(`No file changes`);
      return [];
    }
    return file_list;
  } catch (err) {
    return err;
  }
};

const scan_directory_files = (directory_path: string, array_of_files: string[]) => {
  const files = fs.readdirSync(directory_path);
  array_of_files = array_of_files || [];
  files.forEach(function (file) {
    if (fs.statSync(directory_path + '/' + file).isDirectory()) {
      array_of_files = scan_directory_files(directory_path + '/' + file, array_of_files);
    } else {
      array_of_files.push(path.join(directory_path, '/', file));
    }
  });
  return array_of_files;
};

export const get_directory_filepath_filename = (directory_path: string) => {
  const files = fs.readdirSync(directory_path);
  let array_of_files: { file_path: string; file_name: string }[] = [];
  files.forEach(function (file) {
    if (fs.statSync(directory_path + '/' + file).isDirectory()) {
      array_of_files = get_directory_filepath_filename(directory_path + '/' + file);
    } else {
      array_of_files.push({ file_path: path.join(directory_path, '/', file), file_name: file });
    }
  });
  return array_of_files;
};

const scan_cached_files = async (directory_path: string) => {
  const token_metadata_files = await scan_directory_files(directory_path, []).filter(f => f.includes('.cache.'));
  const cached_found: string[] = [];
  cached_set.forEach(c => {
    token_metadata_files.forEach(t => (c.includes(t) ? cached_found.push(t) : null));
  });
  return cached_found.length === cached_set.length ? true : false;
};

const should_regenerate_cache_files = async (working_files: string[], cached_files: string[]) => {
  const cached_files_found: boolean = false;
  const token_assets_scanned_and_pinned: boolean = false;
  const is_older_than_three_days: boolean = false;
  return cached_files_found && token_assets_scanned_and_pinned && is_older_than_three_days ? true : false;
};

export const scan_local_files = async (working_directory: string) => {
  // const should_rescan = await should_regenerate_cache_files(working_directory, cached_files);
  const files: Files = await scan_directory_files(working_directory, []);
};

export const write_exif_data = async (working_files: string[]) => {};
export const parse_exif_data = async (working_files: string[]) => {};

const save_to_csv = (name: string, traits: string, hash: string) =>
  new Promise(async (resolve, reject) => {
    try {
      const csv_test_path = `./metadata/openseas/${hash}.csv`;
      if (!fs.existsSync(csv_test_path)) {
        const csvHeader = 'name, traits \r\n';
        fs.writeFileSync(csv_test_path, csvHeader);
      }
      const csvLine = `${name}, ${traits}, \r\n`;
      fs.appendFileSync(csv_test_path, csvLine);
      resolve(true);
    } catch (error) {
      console.log('saveToCsv Error: ', error);
      reject(error);
    }
  });

export const generate_attributes = async (combinations: { trait_type: string; value: string }[]) => {
  let attributes: any[] = [];
  const hash = createHash('sha256');
  hash.update(JSON.stringify(combinations));
  let hash_combo = hash.digest('hex');
  try {
    for (const combo of combinations) {
      attributes.push({ trait_type: combo.trait_type, value: combo.value });

      await save_to_csv(combo.trait_type, combo.value, hash_combo);
    }
    return attributes;
  } catch (err) {
    console.log(err);
    return attributes;
  }
};

const generate_description = (vocalb: { trait_type: string; value: string }[]) => {
  const someTemplate = `This is a {example} description`;
  const someVocabulary = {
    example: [vocalb[0].trait_type],
  };
  const anInstanceOfTheSentenceClass = createSentence(someTemplate, someVocabulary, { capitalize: true });
  const { value } = anInstanceOfTheSentenceClass;
  return value;
};

const add_images_to_ipfs = async (image_path: string) => {
  try {
    const images_path = image_path || `images`;
    const files = scan_directory_files(images_path, []);
    const random = randomInt(files.length);
    const randomImage = files[random];
    logger.info(`adding ${files.length} images to IPFS, testing with image number:${randomImage}`);
    const readableStreamForFile = fs.createReadStream(randomImage);
    const result = await Pinata.pinFileToIPFS(readableStreamForFile);
    logger.info(`IPFS returned:${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    if (err instanceof Error) {
      logger.warn(err.message);
      return err;
    } else {
      const e = JSON.stringify(err);
      logger.warn(e);
      return e;
    }
  }
};

export const format_tezos_metadata = async (combinations: { trait_type: string; value: string }[]) => {
  let MAX_NUM = combinations.length;
  const b = randomInt(2, MAX_NUM);
  const metadata = {} as any;
  const attribute = await generate_attributes(combinations);
  const description = generate_description(combinations);
  const the_name = combinations[b];
  metadata.attributes = attribute;
  metadata.description = description;
  metadata.name = the_name;
  return metadata;
};

export const format_openseas_metadata = async (combinations: { trait_type: string; value: string }[]) => {
  let MAX_NUM = combinations.length;
  const b = randomInt(2, MAX_NUM);
  const metadata = {} as any;
  const attribute = await generate_attributes(combinations);
  const description = generate_description(combinations);
  const the_name = combinations[b];
  metadata.attributes = attribute;
  metadata.description = description;
  metadata.name = the_name;
  return metadata;
};

async () => {
  try {
    /*
    const image = fs.readFileSync(test_image);
    const parser = ExifParserFactory.create(image);
    const data =  ExifParserFactory.create(image).parse();
    console.log(data);
    */
    const images_path = `images`;
    const files = get_directory_filepath_filename(images_path);
    /*
    const hash_list = await generate_token_metadata(files);
    // @ts-ignore
    const write_files = await write_to_cache(hash_list);
    true && console.log(hash_list);    
    const ipfsResponse = await add_images_to_ipfs();
    logger.debug(ipfsResponse);    
    */
  } catch (e) {
    if (e instanceof Error) {
      logger.warn(e.message);
    } else {
      logger.warn(JSON.stringify(e));
    }
  }
};
