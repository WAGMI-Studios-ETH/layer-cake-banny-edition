import fs from 'fs-extra';
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import { Asset } from '../other/asset';
import { AnimOutput, ImageOutput, StackedGifOutput } from '../interfaces';
import { createCanvas, loadImage } from 'node-canvas';
import { delay, logger, zero_pad } from '../utils';
import { the_project } from '../other/project';

type AnimationName = 'confetti' | 'rain' | 'smoke';

export abstract class Animation {
  protected time = 0;
  constructor(public width: number, public height: number) {}

  public reset(width: number, height: number) {
    this.time = 0;
    this.width = width;
    this.height = height;
  }

  public async get_frame(delta_time: number, frame: number): Promise<string> {
    return '';
  }
}

class Particle {
  constructor(public x: number, public y: number, public scaleFactor: number, public image_path: string) {}
}

const NUM_PARTICLES = 50;
const NOMINAL_PARTICLE_SIZE = 20;

export class RainAnimation extends Animation {
  private particles: Particle[] = [];
  private random_scale_factor() {
    return 1 - Math.random() * 0.7;
  }
  constructor(width: number, height: number, public output_folder: string) {
    super(width, height);
    for (let i = 0; i < NUM_PARTICLES; i++) {
      const x = Math.floor(Math.random() * this.width);
      const y = Math.floor(Math.random() * this.height);
      const scaleFactor = this.random_scale_factor();
      this.particles.push(new Particle(x, y, scaleFactor, './raindrop.png'));
    }
  }

  get_frame = async (delta_time: number, frame: number): Promise<string> => {
    let filename = `./layered-assets/animation-cache/rain-${frame}.png`;
    if (fs.existsSync(filename)) {
      fs.rmSync(filename);
    }
    const canvas = createCanvas(this.width, this.height);
    const ctx = canvas.getContext('2d');
    const raindrop = await loadImage('./layered-assets/other/raindrop.png');

    for (const particle of this.particles) {
      particle.y += delta_time * 100 * particle.scaleFactor;

      if (particle.y > this.height + 10) {
        particle.y = -5;
        particle.x = Math.floor(Math.random() * this.width);
        particle.scaleFactor = this.random_scale_factor();
      }
      const w = Math.floor(raindrop.width * particle.scaleFactor);
      const h = Math.floor(raindrop.height * particle.scaleFactor);
      await ctx.drawImage(raindrop, particle.x, particle.y, w, h);
    }

    try {
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(filename, buffer);
    } catch (e) {
      logger.debug(JSON.stringify(e));
    }
    return filename;
  };

  reset(width: number, height: number) {
    super.reset(width, height);
  }
}

export async function resize_background_to_cache(path: string, output: AnimOutput) {
  const { width, height } = output;
  const output_path = `./layered-assets/animation-cache/background.png`;

  try {
    await sharp(path).sharpen().png({ quality: 90 }).resize(width, height).toFile(output_path);
  } catch (err) {
    logger.debug(`${JSON.stringify(err)}`);
  }
  return output_path;
}

export async function composite_subject_images_to_cache(asset: Asset, output: AnimOutput) {
  const { width, height } = output;

  // 0 is background now, 1 is shirt.
  const shirt_path = `${asset.trait_dir}/${asset.traits[1].trait_type}/${asset.traits[1].value}`;

  const others = asset.traits.slice(2).map(trait => {
    return {
      input: `${asset.trait_dir}/${trait.trait_type}/${trait.value}`,
      gravity: `southeast`,
    };
  });

  const full_path = `./layered-assets/animation-cache/subject-layers-full.png`;

  try {
    await sharp(shirt_path)
      .composite(others)
      //.resize(width, height)
      .sharpen()
      .png({ quality: 90 })
      .toFile(full_path);
  } catch (e) {
    logger.debug(`failed to compose subject to ${full_path} with first_path ${shirt_path}`);
    for (const nf of others) {
      logger.debug(` ${nf.input}`);
    }
    logger.debug(`error composing subject ${JSON.stringify(e)}`);
  }

  const smaller_path = `./layered-assets/animation-cache/subject-layers.png`;
  try {
    await sharp(full_path).resize(width, height).sharpen().png({ quality: 90 }).toFile(smaller_path);
  } catch (e) {
    logger.debug(`error resizing subject ${JSON.stringify(e)}`);
  }

  return smaller_path;
}

export function get_animation(tag: string, width: number, height: number) {
  switch (tag) {
    case 'rain':
      return new RainAnimation(width, height, `./layered-assets/animation-cache`);
    default:
      logger.warn(`unrecognized anim ${tag}`);
  }
}

const FRAME_COUNT = 100;
const FRAMES_PER_SEC = 15;
const FRAME_TIME = 1 / FRAMES_PER_SEC;

export async function animate_all_frames(asset: Asset, output: AnimOutput) {
  let back_anim: Animation | undefined = undefined;
  if (output.background_animation) {
    back_anim = get_animation(output.background_animation, output.width, output.height);
  }
  let foreground_anim: Animation | undefined = undefined;
  if (output.foreground_anmiation) {
    foreground_anim = get_animation(output.foreground_anmiation, output.width, output.height);
  }

  back_anim?.reset(output.width, output.height);
  foreground_anim?.reset(output.width, output.height);

  const back_animation_image = await resize_background_to_cache(
    `${asset.trait_dir}/${asset.traits[0].trait_type}/${asset.traits[0].value}`,
    output,
  );
  const subject_image = await composite_subject_images_to_cache(asset, output);

  for (let frame = 0; frame < FRAME_COUNT; frame++) {
    const back_frame = (await back_anim?.get_frame(FRAME_TIME, frame)) || undefined;
    const foreground_animation_image = (await foreground_anim?.get_frame(FRAME_TIME, frame)) || undefined;
    const images = [
      {
        input: back_animation_image,
        gravity: 'southeast',
      },
    ];
    if (back_frame) {
      images.push({
        input: back_frame,
        gravity: 'southeast',
      });
    }
    images.push({
      input: subject_image,
      gravity: 'southeast',
    });

    if (foreground_animation_image) {
      images.push({
        input: foreground_animation_image,
        gravity: 'southeast',
      });
    }

    const frame_string = zero_pad(frame, 3);
    const path = `${asset.image_folder}/${asset.image_hash}-${output.tag}-${frame_string}.png`;

    const background_path = `${asset.trait_dir}/${asset.traits[0].trait_type}/${asset.traits[0].value}`;

    try {
      await sharp(background_path)
        .composite(images)
        .sharpen()
        .png({ quality: 90 })
        .resize(output.width, output.height)
        .toFile(path);
    } catch (e) {
      logger.debug(`error composing frame ${JSON.stringify(e)}`);
      throw e;
    }
  }
}

export function delete_animation_files(asset: Asset, output: AnimOutput) {
  const frames = FRAME_COUNT;
  for (let frame = 0; frame < frames; frame++) {
    try {
      const p = `${asset.image_folder}/${asset.image_hash}-${output.tag}-${zero_pad(frame, 3)}.png`;
      fs.rmSync(p);
    } catch (err) {
      logger.warn(JSON.stringify(err));
      logger.warn(`couldn't delete frame ${frame}. oh well.`);
    }
  }
}

async function call_save_video(glob: string, path: string) {
  let done = false;
  ffmpeg(glob)
    .loop(10)
    .fps(20)
    .on('error', err => {
      logger.error(`error saving video: ${JSON.stringify(err)}`);
      // TODO : should we exit, I don't anticipate this occurring much.
      throw err;
    })
    .on('end', () => {
      logger.debug(`video done.`);
      done = true;
    })
    .save(path);
  while (!done) {
    await delay(500);
  }
}

export async function combine_icon_gif(assets: Asset[], output: StackedGifOutput) {
  const cache_folder = `${the_project.output_folder}/anim-cache/${assets[0].base_name}`;

  let profile_output: ImageOutput | undefined = undefined;
  the_project.config.image_outputs.forEach(o => {
    if (o.tag == output.source_image_type) {
      profile_output = o;
    }
  });
  if (!profile_output) {
    throw new Error(`Couldn't find profile output for gif combination`);
  }
  profile_output = profile_output as ImageOutput;

  profile_output.tag;

  if (!fs.existsSync(cache_folder)) {
    fs.mkdirSync(cache_folder, { recursive: true });
  }
  // clean the cache
  nuke_folder_contents(cache_folder);

  let cache_name = 0;
  const digits = assets[0].base_name.length;
  for (const asset of assets) {
    const source_path = `${asset.image_folder}/${profile_output.tag}/${asset.base_name}${profile_output.ipfs_tag}.png`;
    const dest_path = `${cache_folder}/${zero_pad(cache_name++, digits)}.png`;
    // fs.cpSync(source_path, dest_path);
    fs.copySync(source_path, dest_path);
  }

  await delay(1000);

  const len = assets[0].base_name.length;
  const glob_path = `${cache_folder}/%0${digits}d.png`;

  const output_folder = `${assets[0].image_folder}/${output.tag}`;
  if (!fs.existsSync(output_folder)) {
    fs.mkdirSync(output_folder);
  }
  const gif_path = `${output_folder}/${assets[0].base_name}.gif`;

  await call_save_gif(glob_path, gif_path);
}

async function call_save_gif(glob_path: string, output_path: string) {
  let done = false;

  logger.debug(`creating gif from glob ${glob_path} and output ${output_path}`);

  const result = ffmpeg(glob_path)
    .loop(10)
    .fps(3)
    //.size('512x512')
    .on('end', () => {
      logger.warn('Gif saved');
      done = true;
    })
    .on('error', (err: any) => {
      logger.error(`Error saving gif: ${JSON.stringify(err)}`);
      throw err;
    })
    .save(output_path);
}

export async function combine_video(asset: Asset, output: AnimOutput) {
  const { image_folder, image_hash: fingerprint_hash } = asset;
  const path = `${asset.image_folder}/${asset.image_hash}-${output.tag}.m4v`;
  logger.debug(`${asset.image_hash}-${output.tag}.m4v`);

  try {
    const input_pattern = `${image_folder}/${fingerprint_hash}-${output.tag}-%03d.png`;
    await call_save_video(input_pattern, path);
  } catch (err) {
    logger.error(`error combining video ${JSON.stringify(err)}`);
  }
}
function nuke_folder_contents(folder: string, nuke_folders: boolean = false) {
  const contents = fs.readdirSync(folder, { encoding: 'utf8', withFileTypes: true });
  for (const entry of contents) {
    if (entry.isDirectory()) {
      if (nuke_folders) {
        nuke_folder_contents(`${folder}/${entry.name}`, true);
      }
    } else {
      fs.rmSync(`${folder}/${entry.name}`);
    }
  }
}
