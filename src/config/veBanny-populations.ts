import * as fs from 'fs';
import * as path from 'path';
import { readdir, writeFile, readFile } from 'fs/promises';
import { ProjectConfig, Population, PopulationConfig } from '../interfaces';
import { folder_names, project_config } from './project-config';
import { SetEx, getDirectories, get_file_size, read_directory } from '../utils';
import { Project } from '../project';

/*
 * Static population is less intelligent rather than dynamic population and character order.
 * This file should not be in use.
 */

export const static_veBanny_populations = [
  `Character_Alien_1000_Days`,
  `Character_Alien_100_Days`,
  `Character_Alien_10_Days`,
  `Character_Alien_250_Days`,
  `Character_Alien_25_Days`,
  `Character_Assassin_1000_Days`,
  `Character_Assassin_100_Days`,
  `Character_Assassin_10_Days`,
  `Character_Assassin_250_Days`,
  `Character_Assassin_25_Days`,
  `Character_Astronaut_1000_Days`,
  `Character_Astronaut_100_Days`,
  `Character_Astronaut_10_Days`,
  `Character_Astronaut_250_Days`,
  `Character_Astronaut_25_Days`,
  `Character_Bannible_Lector_1000_Days`,
  `Character_Bannible_Lector_100_Days`,
  `Character_Bannible_Lector_10_Days`,
  `Character_Bannible_Lector_250_Days`,
  `Character_Bannible_Lector_25_Days`,
  `Character_Base_Banny_1000_Days`,
  `Character_Base_Banny_100_Days`,
  `Character_Base_Banny_10_Days`,
  `Character_Base_Banny_250_Days`,
  `Character_Base_Banny_25_Days`,
  `Character_Batman_1000_Days`,
  `Character_Batman_100_Days`,
  `Character_Batman_10_Days`,
  `Character_Batman_250_Days`,
  `Character_Batman_25_Days`,
  `Character_Chef_1000_Days`,
  `Character_Chef_100_Days`,
  `Character_Chef_10_Days`,
  `Character_Chef_250_Days`,
  `Character_Chef_25_Days`,
  `Character_Chokha_1000_Days`,
  `Character_Chokha_100_Days`,
  `Character_Chokha_10_Days`,
  `Character_Chokha_250_Days`,
  `Character_Chokha_25_Days`,
  `Character_Christ_1000_Days`,
  `Character_Christ_100_Days`,
  `Character_Christ_10_Days`,
  `Character_Christ_250_Days`,
  `Character_Christ_25_Days`,
  `Character_Clown_1000_Days`,
  `Character_Clown_100_Days`,
  `Character_Clown_10_Days`,
  `Character_Clown_250_Days`,
  `Character_Clown_25_Days`,
  `Character_Cowboy_1000_Days`,
  `Character_Cowboy_100_Days`,
  `Character_Cowboy_10_Days`,
  `Character_Cowboy_250_Days`,
  `Character_Cowboy_25_Days`,
  `Character_Cyberpunk_1000_Days`,
  `Character_Cyberpunk_100_Days`,
  `Character_Cyberpunk_10_Days`,
  `Character_Cyberpunk_250_Days`,
  `Character_Cyberpunk_25_Days`,
  `Character_Deadpool_1000_Days`,
  `Character_Deadpool_100_Days`,
  `Character_Deadpool_10_Days`,
  `Character_Deadpool_250_Days`,
  `Character_Deadpool_25_Days`,
  `Character_Devil_1000_Days`,
  `Character_Devil_100_Days`,
  `Character_Devil_10_Days`,
  `Character_Devil_250_Days`,
  `Character_Devil_25_Days`,
  `Character_Dolly_1000_Days`,
  `Character_Dolly_100_Days`,
  `Character_Dolly_10_Days`,
  `Character_Dolly_250_Days`,
  `Character_Dolly_25_Days`,
  `Character_Dorthy_1000_Days`,
  `Character_Dorthy_100_Days`,
  `Character_Dorthy_10_Days`,
  `Character_Dorthy_250_Days`,
  `Character_Dorthy_25_Days`,
  `Character_Dr._Manhattan_1000_Days`,
  `Character_Dr._Manhattan_100_Days`,
  `Character_Dr._Manhattan_10_Days`,
  `Character_Dr._Manhattan_250_Days`,
  `Character_Dr._Manhattan_25_Days`,
  `Character_Elf_1000_Days`,
  `Character_Elf_100_Days`,
  `Character_Elf_10_Days`,
  `Character_Elf_250_Days`,
  `Character_Elf_25_Days`,
  `Character_Farmer_1000_Days`,
  `Character_Farmer_100_Days`,
  `Character_Farmer_10_Days`,
  `Character_Farmer_250_Days`,
  `Character_Farmer_25_Days`,
  `Character_Fisherman_1000_Days`,
  `Character_Fisherman_100_Days`,
  `Character_Fisherman_10_Days`,
  `Character_Fisherman_250_Days`,
  `Character_Fisherman_25_Days`,
  `Character_Geisha_1000_Days`,
  `Character_Geisha_100_Days`,
  `Character_Geisha_10_Days`,
  `Character_Geisha_250_Days`,
  `Character_Geisha_25_Days`,
  `Character_Guardians_of_Galaxy's_Gamora_1000_Days`,
  `Character_Guardians_of_Galaxy's_Gamora_100_Days`,
  `Character_Guardians_of_Galaxy's_Gamora_10_Days`,
  `Character_Guardians_of_Galaxy's_Gamora_250_Days`,
  `Character_Guardians_of_Galaxy's_Gamora_25_Days`,
  `Character_Harley_Quinn_1000_Days`,
  `Character_Harley_Quinn_100_Days`,
  `Character_Harley_Quinn_10_Days`,
  `Character_Harley_Quinn_250_Days`,
  `Character_Harley_Quinn_25_Days`,
  `Character_Harry_Potter_1000_Days`,
  `Character_Harry_Potter_100_Days`,
  `Character_Harry_Potter_10_Days`,
  `Character_Harry_Potter_250_Days`,
  `Character_Harry_Potter_25_Days`,
  `Character_Ironman_1000_Days`,
  `Character_Ironman_100_Days`,
  `Character_Ironman_10_Days`,
  `Character_Ironman_250_Days`,
  `Character_Ironman_25_Days`,
  `Character_Jango_Fett_1000_Days`,
  `Character_Jango_Fett_100_Days`,
  `Character_Jango_Fett_10_Days`,
  `Character_Jango_Fett_250_Days`,
  `Character_Jango_Fett_25_Days`,
  `Character_Jinx_1000_Days`,
  `Character_Jinx_100_Days`,
  `Character_Jinx_10_Days`,
  `Character_Jinx_250_Days`,
  `Character_Jinx_25_Days`,
  `Character_Kentucky_Derby_1000_Days`,
  `Character_Kentucky_Derby_100_Days`,
  `Character_Kentucky_Derby_10_Days`,
  `Character_Kentucky_Derby_250_Days`,
  `Character_Kentucky_Derby_25_Days`,
  `Character_Kill_Bill_1000_Days`,
  `Character_Kill_Bill_100_Days`,
  `Character_Kill_Bill_10_Days`,
  `Character_Kill_Bill_250_Days`,
  `Character_Kill_Bill_25_Days`,
  `Character_Mario_1000_Days`,
  `Character_Mario_100_Days`,
  `Character_Mario_10_Days`,
  `Character_Mario_250_Days`,
  `Character_Mario_25_Days`,
  `Character_Men_in_Black_1000_Days`,
  `Character_Men_in_Black_100_Days`,
  `Character_Men_in_Black_10_Days`,
  `Character_Men_in_Black_250_Days`,
  `Character_Men_in_Black_25_Days`,
  `Character_Musketeer_1000_Days`,
  `Character_Musketeer_100_Days`,
  `Character_Musketeer_10_Days`,
  `Character_Musketeer_250_Days`,
  `Character_Musketeer_25_Days`,
  `Character_Naruto_1000_Days`,
  `Character_Naruto_100_Days`,
  `Character_Naruto_10_Days`,
  `Character_Naruto_250_Days`,
  `Character_Naruto_25_Days`,
  `Character_Obiwan_Kenobanana_1000_Days`,
  `Character_Obiwan_Kenobanana_100_Days`,
  `Character_Obiwan_Kenobanana_10_Days`,
  `Character_Obiwan_Kenobanana_250_Days`,
  `Character_Obiwan_Kenobanana_25_Days`,
  `Character_Peach_1000_Days`,
  `Character_Peach_100_Days`,
  `Character_Peach_10_Days`,
  `Character_Peach_250_Days`,
  `Character_Peach_25_Days`,
  `Character_Pharaoh_King_Banatut_1000_Days`,
  `Character_Pharaoh_King_Banatut_100_Days`,
  `Character_Pharaoh_King_Banatut_10_Days`,
  `Character_Pharaoh_King_Banatut_250_Days`,
  `Character_Pharaoh_King_Banatut_25_Days`,
  `Character_Pink_Banny_1000_Days`,
  `Character_Pink_Banny_100_Days`,
  `Character_Pink_Banny_10_Days`,
  `Character_Pink_Banny_250_Days`,
  `Character_Pink_Banny_25_Days`,
  `Character_Pink_Girl_1000_Days`,
  `Character_Pink_Girl_100_Days`,
  `Character_Pink_Girl_10_Days`,
  `Character_Pink_Girl_250_Days`,
  `Character_Pink_Girl_25_Days`,
  `Character_Pirate_1000_Days`,
  `Character_Pirate_100_Days`,
  `Character_Pirate_10_Days`,
  `Character_Pirate_250_Days`,
  `Character_Pirate_25_Days`,
  `Character_Playgirl_1000_Days`,
  `Character_Playgirl_100_Days`,
  `Character_Playgirl_10_Days`,
  `Character_Playgirl_250_Days`,
  `Character_Playgirl_25_Days`,
  `Character_Princess_Bleia_1000_Days`,
  `Character_Princess_Bleia_100_Days`,
  `Character_Princess_Bleia_10_Days`,
  `Character_Princess_Bleia_250_Days`,
  `Character_Princess_Bleia_25_Days`,
  `Character_Professor_Banana_1000_Days`,
  `Character_Professor_Banana_100_Days`,
  `Character_Professor_Banana_10_Days`,
  `Character_Professor_Banana_250_Days`,
  `Character_Professor_Banana_25_Days`,
  `Character_Punk_1000_Days`,
  `Character_Punk_100_Days`,
  `Character_Punk_10_Days`,
  `Character_Punk_250_Days`,
  `Character_Punk_25_Days`,
  `Character_Rasta_1000_Days`,
  `Character_Rasta_100_Days`,
  `Character_Rasta_10_Days`,
  `Character_Rasta_250_Days`,
  `Character_Rasta_25_Days`,
  `Character_Rave_1000_Days`,
  `Character_Rave_100_Days`,
  `Character_Rave_10_Days`,
  `Character_Rave_250_Days`,
  `Character_Rave_25_Days`,
  `Character_Robanahood_1000_Days`,
  `Character_Robanahood_100_Days`,
  `Character_Robanahood_10_Days`,
  `Character_Robanahood_250_Days`,
  `Character_Robanahood_25_Days`,
  `Character_Sakura_1000_Days`,
  `Character_Sakura_100_Days`,
  `Character_Sakura_10_Days`,
  `Character_Sakura_250_Days`,
  `Character_Sakura_25_Days`,
  `Character_Samurai_1000_Days`,
  `Character_Samurai_100_Days`,
  `Character_Samurai_10_Days`,
  `Character_Samurai_250_Days`,
  `Character_Samurai_25_Days`,
  `Character_Shining_1000_Days`,
  `Character_Shining_100_Days`,
  `Character_Shining_10_Days`,
  `Character_Shining_250_Days`,
  `Character_Shining_25_Days`,
  `Character_Smalls_1000_Days`,
  `Character_Smalls_100_Days`,
  `Character_Smalls_10_Days`,
  `Character_Smalls_250_Days`,
  `Character_Smalls_25_Days`,
  `Character_Spock_1000_Days`,
  `Character_Spock_100_Days`,
  `Character_Spock_10_Days`,
  `Character_Spock_250_Days`,
  `Character_Spock_25_Days`,
  `Character_Surfer_1000_Days`,
  `Character_Surfer_100_Days`,
  `Character_Surfer_10_Days`,
  `Character_Surfer_250_Days`,
  `Character_Surfer_25_Days`,
  `Character_Tao_of_Banana_Buddha_1000_Days`,
  `Character_Tao_of_Banana_Buddha_100_Days`,
  `Character_Tao_of_Banana_Buddha_10_Days`,
  `Character_Tao_of_Banana_Buddha_250_Days`,
  `Character_Tao_of_Banana_Buddha_25_Days`,
  `Character_The_Mask_1000_Days`,
  `Character_The_Mask_100_Days`,
  `Character_The_Mask_10_Days`,
  `Character_The_Mask_250_Days`,
  `Character_The_Mask_25_Days`,
  `Character_Tinkerbell_1000_Days`,
  `Character_Tinkerbell_100_Days`,
  `Character_Tinkerbell_10_Days`,
  `Character_Tinkerbell_250_Days`,
  `Character_Tinkerbell_25_Days`,
  `Character_Vampire_1000_Days`,
  `Character_Vampire_100_Days`,
  `Character_Vampire_10_Days`,
  `Character_Vampire_250_Days`,
  `Character_Vampire_25_Days`,
  `Character_Vampire_Girl_1000_Days`,
  `Character_Vampire_Girl_100_Days`,
  `Character_Vampire_Girl_10_Days`,
  `Character_Vampire_Girl_250_Days`,
  `Character_Vampire_Girl_25_Days`,
  `Character_Viking_1000_Days`,
  `Character_Viking_100_Days`,
  `Character_Viking_10_Days`,
  `Character_Viking_250_Days`,
  `Character_Viking_25_Days`,
  `Character_Witch_1000_Days`,
  `Character_Witch_100_Days`,
  `Character_Witch_10_Days`,
  `Character_Witch_250_Days`,
  `Character_Witch_25_Days`,
  `Character_Wonder_Woman_1000_Days`,
  `Character_Wonder_Woman_100_Days`,
  `Character_Wonder_Woman_10_Days`,
  `Character_Wonder_Woman_250_Days`,
  `Character_Wonder_Woman_25_Days`,
];

const layer_order = [
  'Background',
  'Body',
  'Face',
  'Outfit',
  'Choker',
  'Oral_Fixation',
  'Headgear',
  'Lower_Accessory',
  'Left_Hand',
  'Right_Hand',
  'Both_Hands',
];

const sub_populations = ['10_Days', '25_Days', '100_Days', '250_Days', '1000_Days'];

const population_size = 1;

const population_template = (population_name: string, layer_order: string[], population_size: number) => {
  return {
    name: population_name,
    layer_order: layer_order,
    population_size: population_size,
  };
};

export const get_veBanny_population_from_directory = async () => {
  const populations = new SetEx();
  const file_path = `layered-assets/veBanny`;
  const directory_files = await readdir(file_path);
  return directory_files;
};

/*
const generate_veBanny_populations = async () => {
  const populations = new SetEx;    
  const file_path = `layered-assets/veBanny`;  
  const directory_files = await readdir(file_path);
  directory_files.forEach(p => populations.add(p.split(/\d/)[0]));                          
    
  const characters = Array.from(populations);
  const configured_population = new SetEx;
  
  for (let i = 0; i < characters.length; i++){
      console.log(`${characters[i]}`);    
      for (let j = 0; j < sub_populations.length; j++){
          configured_population.add(
              population_template(
                  `${characters[i]}${sub_populations[j]}`, layer_order, population_size));
      }
  }    
  return ((configured_population as unknown) as PopulationConfig[]);  
};
*/

async () => {
  const file_path = `layered-assets/veBanny`;
  const directory_files = await readdir(file_path);
  const populations: string[] = [];
  directory_files.forEach(p => {
    populations.push(p.split(/\d/)[0].replace(`Character_`, ``).slice(0, -1));
  });
  const unique_populations = new SetEx(populations);
  console.log(unique_populations, unique_populations.size);
};
