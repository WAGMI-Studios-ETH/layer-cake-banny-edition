import fs from 'fs';
import sharp from 'sharp';
import { Asset } from '../other/asset';
import { the_project } from '../other/project';
import { logger, getTime, getElapsed, delay, msToTime, get_file_size } from '../utils';
import { compute_file_hash } from '../other/ipfs';
import { parentPort, workerData } from 'worker_threads';

const WORKERS = 5;

async function generate_images_chunked(assets: Asset[], is_leader: boolean) {
  const chunk_size = Math.ceil(assets.length / WORKERS);
  const promises = [];
  for (let i = 0; i < WORKERS; i++) {
    let to = (i + 1) * chunk_size;
    if (to > assets.length) to = assets.length;
    const a = assets.slice(i * chunk_size, to);
    promises.push(generate_images(a, i == 0 && is_leader));
  }
  await Promise.all(promises);
}

async function generate_images(assets: Asset[], is_leader: boolean) {
  for (let i = 0; i < assets.length; i++) {
    const asset = assets[i];
    const timer = getTime();
    await generate_static_images(asset);
    logger.info(`image ${asset.base_name} done`);
    const took = getElapsed(timer);
    const yet = assets.length - i;
    const remaining = yet * took;
    if (is_leader) {
      logger.warn(`${msToTime(remaining)} remaining`);
    }
  }
}

let mirror_assets_allowed;

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
      if (!fs.existsSync(original_folder)) fs.mkdirSync(original_folder);
    } catch (err) {}

    const original_path = `${original_folder}/${asset.base_name}.png`;
    await sharp(background_path).composite(inputs).sharpen().withMetadata().png({ quality: 90 }).toFile(original_path);
    // flip or rotate images occasionally, per config.
    if (the_project.rotated_assets_allowed > 0) {
      const probability = the_project.config.rotated_images_allowed / (the_project.total_populations_size * 0.85);
      if (Math.random() < probability) {
        // rotate this image.
        // select a rotation.
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
    the_project.config.mirror_images_allowed = the_project.config?.mirror_images_allowed || 0;
    if (the_project.mirror_assets_allowed > 0) {
      if (Math.random() < Math.random()) {
        // 50% probability
        const temp_path = `${original_folder}/${asset.base_name}-mirrored.png`;
        await sharp(original_path).flop(true).png({ quality: 90 }).toFile(temp_path);
        fs.rmSync(original_path);
        fs.renameSync(temp_path, original_path);
        the_project.mirror_assets_allowed--;
      }
    }

    for (const output of the_project.config.image_outputs) {
      const output_folder = `${asset.image_folder}/${output.tag}`;
      try {
        if (!fs.existsSync(output_folder)) fs.mkdirSync(output_folder);
      } catch (err) {}
      const path = `${output_folder}/${asset.base_name}${output.ipfs_tag}.png`;
      await sharp(original_path)
        .resize(output.width, output.height)
        .sharpen()
        .withMetadata()
        .png({ quality: 90 })
        .toFile(path);
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
    logger.error(JSON.stringify(e));
  }
}

(async () => {
  await generate_images_chunked(workerData.assets, workerData.is_leader);
  parentPort?.postMessage(true);
})();
