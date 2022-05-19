/* eslint-disable max-len */
import moment from 'moment';
import { CollageOutput, ProjectConfig } from '../interfaces';
import { random } from '../utils';
import {
  collage11110,
  collage4444,
  collage4000,
  collage5000,
  collageDiscord600x240,
  collageTwitter1200x675,
  collageTwitter1500x500,
  collage10000,
} from './collages';

const iso_datetime_now = new Date().toISOString();

export const folder_names = {
  output: 'build',
  layered_assets: 'layered-assets',
  traits: 'Traits',
};

/*
  banny - accessorized bannys  
  vebanny - token generation

  import { bannyConfig } from './project-banny';
*/
import { bannyConfig } from './project-vebanny';
export const project_config: ProjectConfig[] = [bannyConfig];
