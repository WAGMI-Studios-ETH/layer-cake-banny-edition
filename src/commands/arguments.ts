import { get_directories, scan_sort_folders, logger } from '../utils';
import { folder_names } from '../config/project-config';
import { the_project } from '../project';

const potential_project_paths = scan_sort_folders(folder_names.traits);
const project_layers: string[] = [];

if (potential_project_paths !== undefined) {
  if (potential_project_paths.length === 0) {
    logger.error(`You must place your layers within the layer_assets folder.`);
  }
  for (const p of potential_project_paths) {
    const project = Object.values(p)[0];
    project_layers.push(project as string);
  }
}

export const layers_path = {
  alias: ['d'],
  describe: 'Location of image parts.',
  choices: project_layers,
  default: project_layers[0],
};

export const configuration_json = {
  describe: `Location of the configuration.json.`,
  type: 'string' as const,
};

export const output_path = {
  describe: `Location of finished images, metadata files.`,
  type: 'string' as const,
  default: `${the_project.output_folder}`,
};
