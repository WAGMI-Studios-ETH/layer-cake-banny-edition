import * as fs from 'fs';
import * as path from 'path';
import { bytes, MB, logger } from '.';
import { readdir, writeFile, readFile } from 'fs/promises';

export const isPathExist = (filePath: string) => fs.existsSync(filePath);
export const is_path_exists = isPathExist;

export const rmdir = (dir: string) => {
  let list = fs.readdirSync(dir);
  for (let i = 0; i < list.length; i++) {
    let filename = path.join(dir, list[i]);
    let stat = fs.statSync(filename);
    if (filename == '.' || filename == '..') {
    } else if (stat.isDirectory()) {
      rmdir(filename);
    } else {
      fs.unlinkSync(filename);
    }
  }
  fs.rmdirSync(dir);
};

export const create_path_folders = (path: string) => {
  fs.mkdirSync(path, { recursive: true });
};

export const saveToFilesystemHelper = (input: any, directory: string, filename: string) => {
  try {
    if (!fs.existsSync(directory)) fs.mkdirSync(directory);
    const sizeOf = bytes(JSON.stringify(input));
    const filePath = path.resolve(directory, filename);
    const data = typeof input !== 'string' ? JSON.stringify(input) : input;
    fs.appendFileSync(filePath, data);
    logger.info(`👌  => ${filename} ` + `(${sizeOf} bytes /${(sizeOf / MB).toFixed(5)} MB) ` + `=> ${directory}`);
    return data;
  } catch (e) {
    console.error(`Error occurred while saving ${filename} to ${directory}, Error:${JSON.stringify(e)}`);
    return e;
  }
};

export const save_to_filesystem_helper = saveToFilesystemHelper;

export const read_directory = async (filepath: string) => {
  try {
    const files = await readdir(filepath);
    for (const file of files) logger.info(file);
    return files;
  } catch (err) {
    logger.error(err);
    console.error(`Error occurred, Error:${JSON.stringify(err)}`);
    return err;
  }
};

export const read_config_json = async (file_name: string) => {
  try {
    const controller = new AbortController();
    const { signal } = controller;
    const buffer = await readFile(file_name, { signal });
    controller.abort();
    return buffer.toString();
  } catch (err) {
    logger.warn(`failed to read config.json file, likely because it was removed/cleaned up`);
  }
};

export const write_config_json = async (file_name: string, file_data: {}) => {
  try {
    const controller = new AbortController();
    const { signal } = controller;
    const data = JSON.stringify(file_data, null, 2);
    try {
      await writeFile(file_name, data, { signal });
    } catch (e) {
      logger.error(e);
    }
    controller.abort();
  } catch (err) {
    logger.error(err);
  }
};

export const getDirectories = (source: string) =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent: { isDirectory: () => boolean }) => dirent.isDirectory())
    .map((dirent: { name: any }) => dirent.name);

export const get_directories = getDirectories;

export const get_file_size = (path: string) => {
  const stat = fs.statSync(path);
  return stat.size;
};
