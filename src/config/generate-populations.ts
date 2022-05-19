import * as fs from 'fs';
import { layer_order, sub_populations, population_template } from './project-veBanny';
import { PopulationConfig } from '../interfaces';
import { SetEx } from '../utils/setEx';

export function generate_veBanny_populations(verbose: boolean = false) {
  const population_size = 1;
  const populations = new SetEx();
  const file_path = `layered-assets/veBanny`;
  const veBanny_populations = fs.readdirSync(`layered-assets/vebanny`);
  veBanny_populations.forEach(p => populations.add(p.split(/\d/)[0]));
  false && console.log(populations, populations.size);
  const characters = Array.from(populations);
  const configured_population = new SetEx();
  for (let i = 0; i < characters.length; i++) {
    for (let j = 0; j < sub_populations.length; j++) {
      configured_population.add(
        population_template(`${characters[i]}${sub_populations[j]}`, layer_order, population_size),
      );
    }
  }

  false && console.log(configured_population, configured_population.size);
  return configured_population as unknown as PopulationConfig[];
}

export function generate_veBanny_populations_names_only(verbose: boolean = false) {
  const populations = new SetEx();
  const file_path = `layered-assets/veBanny`;
  const veBanny_populations = fs.readdirSync(`layered-assets/vebanny`);
  veBanny_populations.forEach(p => populations.add(p.split(/\d/)[0]));
  const characters = Array.from(populations);
  const configured_population = new SetEx();

  for (let i = 0; i < characters.length; i++) {
    false && console.log(`${characters[i]}`);
    for (let j = 0; j < sub_populations.length; j++) {
      configured_population.add(population_template(`${characters[i]}${sub_populations[j]}`, layer_order, 1));
    }
  }
  false && console.log(configured_population, configured_population.size);
  return configured_population as unknown as PopulationConfig[];
}
