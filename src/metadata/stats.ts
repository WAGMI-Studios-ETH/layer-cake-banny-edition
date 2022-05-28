import { MeowStatName } from './meow-stats';

const boost_max: number = 100;
const half: number = 0.5;

export type TestStatName = 'Strength' | 'Dexterity' | 'Intelligence' | 'Constitution' | 'Luck';
export type DefaultStatName = 'Keyboard Skillz' | 'Fruit-Flavor' | 'Banana Strength';

export type Stat = {
  stat_name: MeowStatName | TestStatName | DefaultStatName;
  trigger_keywords: string[];
  max_keywords: string[];
};

export function random_birthday(min_years: number, max_years: number): number {
  const range = max_years - min_years;
  const age = min_years + Math.random() * range;
  const days_ago = age * 365;
  const d = new Date();
  d.setDate(d.getDate() - days_ago);
  return d.getTime();
}

export function fourtwenty_birthday(): number {
  return -22100400;
}
