/* eslint-disable no-shadow */
import fs from 'fs';
import moment from 'moment';
import { folder_names, project_config } from './config/project-config';
import { logger, create_path_folders } from './utils';
import { ProjectConfig, Population } from './interfaces';

/*
 * @dev project definition
 */
const enum projects {
  'veBanny',
}

const current_project = project_config[0];

export class Project {
  public config: ProjectConfig;
  public output_folder: string;
  public populations: Population[] = [];
  public total_populations_size: number = 0;
  public rotated_assets_allowed: number;
  public mirror_assets_allowed: number;

  constructor(config: ProjectConfig) {
    this.config = config;
    this.rotated_assets_allowed = config.rotated_images_allowed;
    this.mirror_assets_allowed = config.mirror_images_allowed;
    if (config.resume_folder.length < 1) {
      const date = `${moment(new Date()).format('YYYYMMDD-HHmmssSS').toString()}`;
      this.output_folder = `./${folder_names.output}/${this.config.name}/${date}`;
    } else {
      this.output_folder = `./${folder_names.output}/${this.config.name}/${config.resume_folder}`;
      if (!fs.existsSync(this.output_folder)) {
        logger.error(`can't find resume output folder ${this.output_folder}`);
        process.exit();
      }
    }
    for (const p of config.populations) {
      const input_folder = `./${folder_names.layered_assets}`;
      const traits_folder = `${input_folder}/${this.config.name}/${p.name}/${folder_names.traits}`;
      this.populations.push({
        config: p,
        input_folder: input_folder,
        traits_folder: traits_folder,
        assets: [],
      });
    }
  }
}

function create_project(project: ProjectConfig) {
  false && logger.warn(`creating ${project.name} project`);
  return new Project(project);
}

export const the_project = create_project(current_project);

export function ensure_folders_exist(folders: string[]) {
  folders.map(f => {
    create_path_folders(f);
  });
}

async () => {
  console.log(the_project);
};
