/* eslint-disable no-shadow */
import fs from 'fs';
import sharp from 'sharp';
import { Asset } from '../other/asset';
import { the_project } from '../other/project';
import { logger, getTime, getElapsed, delay, msToTime, get_file_size } from '../utils';
import { compute_file_hash } from '../other/ipfs';
import { parentPort, workerData } from 'worker_threads';
import os from 'os';

sharp.concurrency(2);

const create_throttle_fn = (max_rate: number) => {
  const queue: (() => void)[] = [];
  let full = false;
  let count = 0;
  let total = 0;
  return async <T>(fn: () => Promise<T>) => {
    type PromiseResolvedType<T> = T extends Promise<infer R> ? R : never;
    let succ: (res: PromiseResolvedType<ReturnType<typeof fn>>) => void;
    let err: any;
    const p = new Promise((res: typeof succ, rej) => {
      succ = res;
      err = rej;
    });
    const f = () => {
      count++;
      if (count === max_rate) {
        full = true;
        logger.warn(`sharp thread pool throttling ${max_rate}`);
      }
      fn()
        .then(val => {
          count--;
          total++;
          logger.warn(`sharp thread pool thread count:${total}`);
          if (count === 0 && full === true) {
            full = false;
            logger.warn(`sharp thread pool is empty:${total}`);
            queue.splice(0, max_rate).forEach(fn => fn());
          }
          succ(val);
        })
        .catch(err);
    };
    if (full) {
      queue.push(() => f());
      logger.info(`pushed sharp thread processing into the queue, queue size is ${queue.length}`);
    } else {
      f();
    }
    return p;
  };
};

const sharp_throttle = create_throttle_fn(20);

const mkdir = async (dir: string) =>
  await fs.promises.mkdir(dir).catch(err => (err.code === 'EEXIST' ? Promise.resolve(true) : Promise.reject(err)));

const WORKERS = os.cpus().length + 5;

logger.info(`operating system cpus: ${os.cpus().length}, adding 5 additional workers: ${WORKERS}`);

export async function generate_images_chunked(assets: Asset[], chunk_size = 10) {
  const chunks = Math.ceil(assets.length / chunk_size);
  let p: Promise<any> = Promise.resolve();
  for (let i = 0; i < chunks; i++) {
    const promises: (() => Promise<any>)[] = [];
    let to = (i + 1) * chunk_size;
    if (to > assets.length) to = assets.length;
    const a = assets.slice(i * chunk_size, to);
    console.log(`a size ${a.length}`);
    logger.info(`processing asses of ${a.length}, chunk ${i}, chunk size ${chunk_size}`);
    promises.push(
      ...a.map(asset => async () => {
        await generate_static_images(asset);
        logger.info(`generating static image:${asset.base_name} complete`);
      }),
    );
    p = p.then(() => Promise.all(promises.map(f => f())));
  }
  await p;
}

async function generate_images(assets: Asset[], is_leader: boolean) {
  for (let i = 0; i < assets.length; i++) {
    const asset = assets[i];
    const timer = getTime();
    await generate_static_images(asset);
    logger.info(`static image gen:${asset.base_name} complete`);
    const took = getElapsed(timer);
    const yet = assets.length - i;
    const remaining = yet * took;
    if (is_leader) logger.info(`${msToTime(remaining)} remaining`);
  }
}

async function generate_static_images(asset: Asset) {
  const { traits, trait_dir } = asset;
  const timer = getTime();
  const inputs = traits.slice(1).map((a: any) => {
    return {
      input: `${trait_dir}/${a.trait_type}/${a.value}`,
      gravity: 'southeast',
    };
  });

  const background_path = `${asset.trait_dir}/${asset.traits[0].trait_type}/${asset.traits[0].value}`;
  try {
    const original_folder = `${asset.image_folder}/original`;
    try {
      await mkdir(original_folder);
    } catch (err) {}
    const original_path = `${original_folder}/${asset.base_name}.png`;
    await sharp_throttle(() =>
      sharp(background_path).composite(inputs).sharpen().withMetadata().png({ quality: 90 }).toFile(original_path),
    );
    logger.info(`original static gen:${asset.base_name} complete`);
    if (the_project.rotated_assets_allowed > 0) {
      const probability = the_project.config.rotated_images_allowed / (the_project.total_populations_size * 0.85);
      if (Math.random() < probability) {
        const r = Math.random();
        let rotation = 90;
        if (r < 0.33) {
          rotation = 180;
        } else if (r < 0.67) {
          rotation = 270;
        }
        const temp_path = `${original_folder}/${asset.base_name}-rotated.png`;
        await sharp(original_path).rotate(rotation).png({ quality: 90 }).toFile(temp_path);
        fs.rmSync(original_path);
        fs.renameSync(temp_path, original_path);
        the_project.rotated_assets_allowed--;
        asset.rotation = rotation;
      }
    }

    for (const output of the_project.config.image_outputs) {
      const output_folder = `${asset.image_folder}/${output.tag}`;
      try {
        await mkdir(output_folder);
      } catch (err) {}
      const path = `${output_folder}/${asset.base_name}${output.ipfs_tag}.png`;
      logger.info(`image ${asset.base_name} ipfs tag ${output.ipfs_tag} done`);
      await sharp_throttle(() =>
        sharp(original_path)
          .resize(output.width, output.height)
          .sharpen()
          .withMetadata()
          .png({ quality: 90 })
          .toFile(path),
      );
      if (output.tag === 'icon') {
        asset.thumb_hash = await compute_file_hash(path);
      }
    }
    asset.image_ready = true;
  } catch (e) {
    logger.error(`trouble compositing on background ${background_path}`);
    logger.error(`compositing inputs:`);
    for (const input of inputs) {
      logger.error(` ${input.input}`);
    }
    logger.error(e);
  }
}
