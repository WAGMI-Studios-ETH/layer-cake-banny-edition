import fs from 'fs';
import sharp from 'sharp';
import { Asset } from './asset';
import { the_project } from './project';
import { logger, getTime, getElapsed, delay, msToTime, get_file_size } from '../utils';
import { animate_all_frames, combine_icon_gif, combine_video, delete_animation_files } from '../animation/animation';
import { create_collages } from './collage';
import { compute_file_hash } from './ipfs';
import { Population } from '../interfaces';
import { generate_all_images } from '../layering/leader';

let start = getTime();

export async function generate_all_outputs(assets: Asset[], population: Population) {
  logger.info(`image generating starting`);
  start = getTime();
  await generate_all_images(assets);
  logger.info(`image generating took ${getElapsed(start)} sec(s)`);

  logger.info(`animation generation starting`);
  start = getTime();
  await generate_all_videos(assets);
  logger.info(`animation generation took ${getElapsed(start)} sec(s)`);
}

export async function compute_asset_hash(assets: Asset[]) {
  let icon_tag = 's';
  the_project.config.image_outputs.forEach(output => {
    if (output.tag == 'icon') icon_tag = output.ipfs_tag;
  });

  for (const asset of assets) {
    const original_path = `${asset.image_folder}/original/${asset.base_name}.png`;
    asset.image_hash = await compute_file_hash(original_path);
    asset.image_size = get_file_size(original_path);
    // TODO : god save us all, hardcoded path pieces.
    const icon_path = `${asset.image_folder}/icon/${asset.base_name}${icon_tag}.png`;
    asset.thumb_hash = await compute_file_hash(icon_path);
  }
}

export async function generate_all_collages(asset: Asset) {
  for (const output of the_project.config.collage_outputs) {
    await create_collages(
      `${asset.image_folder}/${output.source_image_type}`,
      `${asset.image_folder}/${output.tag}`,
      output.tag,
      output.tile_width,
      output.tile_height,
      output.columns,
      output.rows,
      output.max_sheets,
      output.skip_mostly_empty,
      output.shuffle,
    );
  }
}

export async function generate_all_stacked_gifs(assets: Asset[]) {
  for (const output of the_project.config.stacked_gif_outputs) {
    const { images_per_stack, max_stacks, source_image_type, tag } = output;
    let stacks = Math.floor(assets.length / images_per_stack);
    if (stacks > max_stacks) {
      stacks = max_stacks;
    }
    for (let i = 0; i < stacks; i++) {
      const a = assets.slice(i * images_per_stack, (i + 1) * images_per_stack);
      await combine_icon_gif(a, output);
    }
  }
}

async function generate_all_videos(assets: Asset[]) {
  let count = 0;
  for (const asset of assets) {
    logger.info(`animating video ${count++}`);
    await generate_dynamic_images(asset);
  }
}

const WORKERS = 5;
/*
async function generate_all_images(assets: Asset[]) {
  const timer = getTime();
  let done = 0;
  const len = assets.length;

  const chunk_size = Math.ceil(len / WORKERS);
  const promises = [];
  for (let i = 0; i < WORKERS; i++) {
    const from = i * chunk_size;
    const to = from + chunk_size - 1;
    const chunk = assets.slice(from, to+1);
    promises.push(generate_images_for_range(chunk, i == 0));
  }
  await Promise.all(promises).then(() => {
    logger.info(`images done.`);
  })
};
*/

async function generate_images_for_range(assets: Asset[], is_leader: boolean) {
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

async function generate_dynamic_images(asset: Asset) {
  const timer = getTime();
  for (const output of the_project.config.anim_outputs) {
    if (!output.background_animation && !output.foreground_anmiation) {
      logger.warn(`Animation '${output.tag}' has neither background nor foreground layers specified. Skipping.`);
      continue;
    }
    await animate_all_frames(asset, output);
    await combine_video(asset, output);
    await delay(1000); // TODO: remove
    delete_animation_files(asset, output);
    logger.warn(`video gen took ${getElapsed(timer) / 1000} sec(s)`);
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
    if (!fs.existsSync(original_folder)) fs.mkdirSync(original_folder);
    const original_path = `${original_folder}/${asset.base_name}.png`;
    await sharp(background_path).composite(inputs).sharpen().withMetadata().png({ quality: 90 }).toFile(original_path);
    if (the_project.rotated_assets_allowed > 0) {
      logger.info(`project config allows for ${the_project.rotated_assets_allowed} rotated assets`);
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
        logger.info(`rotating ${asset.base_name} by ${rotation} degrees`);
        const temp_path = `${original_folder}/${asset.base_name}-rotated.png`;
        await sharp(original_path).rotate(rotation).png({ quality: 90 }).toFile(temp_path);
        fs.rmSync(original_path);
        fs.renameSync(temp_path, original_path);
        the_project.rotated_assets_allowed--;
        asset.rotation = rotation;
      }
    }

    asset.image_hash = await compute_file_hash(original_path);
    asset.image_size = get_file_size(original_path);
    for (const output of the_project.config.image_outputs) {
      const output_folder = `${asset.image_folder}/${output.tag}`;
      if (!fs.existsSync(output_folder)) fs.mkdirSync(output_folder);
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
