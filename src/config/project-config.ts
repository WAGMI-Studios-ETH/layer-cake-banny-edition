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
TODO: project-banny experiments with a bunch of banny permuations much like how individuals will create their own,
veBanny is for the voting escrow banny goverannce NFT
import { bannyConfig } from './project-banny';
*/
import { bannyConfig } from './project-veBanny';
export const project_config: ProjectConfig[] = [bannyConfig];
