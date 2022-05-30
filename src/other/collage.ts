import fs from 'fs';
import dotenv from 'dotenv';
import { filesIn, zero_pad } from '../utils';
import { logger } from '../utils/logger';
import { createCanvas, loadImage } from 'canvas';
import { Population } from '../interfaces';
import { shuffle_array } from '../utils/randomize';

dotenv.config();

export const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const create_collages = async (
  input_folder: string,
  output_folder: string,
  tag: string,
  tile_width: number,
  tile_height: number,
  columns: number,
  rows: number,
  max_sheets: number,
  skip_non_full: boolean,
  shuffle: boolean,
) => {
  const filenames = filesIn(input_folder);
  if (shuffle) {
    shuffle_array(filenames);
  }
  logger.info(`found ${filenames.length} input files`);
  const output_width = tile_width * columns;
  const output_height = tile_height * rows;
  const images_per_sheet = rows * columns;
  logger.info(`${columns}X${rows} images per sheet`);
  const fractional_sheets = filenames.length / images_per_sheet;
  let num_sheets = skip_non_full ? Math.round(fractional_sheets) : Math.ceil(fractional_sheets);
  if (num_sheets > max_sheets) num_sheets = max_sheets;
  if (!fs.existsSync(output_folder)) fs.mkdirSync(output_folder);
  for (let sheet = 0; sheet < num_sheets; sheet++) {
    const canvas = createCanvas(output_width, output_height);
    const ctx = canvas.getContext('2d');
    for (let image_y = 0; image_y < rows; image_y++) {
      for (let image_x = 0; image_x < columns; image_x++) {
        const index = sheet * images_per_sheet + image_y * columns + image_x;
        if (index < filenames.length) {
          const filename = filenames[index];
          const path = `${input_folder}/${filename}`;
          try {
            const image = await loadImage(path);
            const x = image_x * tile_width;
            const y = image_y * tile_height;
            ctx.drawImage(image, x, y, tile_width, tile_height);
            logger.info(`compositing (${sheet + 1}/${num_sheets}) (${index}) ${path} at ${x},${y}`);
          } catch (err) {
            logger.error(err);
          }
        }
      }
    }

    let done: boolean = false;
    const collage_filename = `${output_folder}/${tag}-${zero_pad(sheet, 2)}.png`;
    const out = fs.createWriteStream(collage_filename);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', () => {
      done = true;
      console.log(`finished writing ${collage_filename}`);
    });
    while (!done) {
      await delay(500);
    }
  }
};
