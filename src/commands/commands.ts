import { Arguments, InferredOptionTypes } from 'yargs';
import { layers_path, configuration_json, output_path } from './arguments';
import { logger } from '../utils';

export const command = 'compose-images';
export const describe = 'Generative image compositing bonaza!';
export const builder = {
  layers_path,
  configuration_json,
  output_path,
};

export const handler = async (argv: Arguments<InferredOptionTypes<typeof builder>>) => {
  false && logger.info(`${argv}`);
};
