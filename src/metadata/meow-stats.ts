import { Stat } from './stats';

/*
 * Addiitional metadata displayed in Opensea beyond attributes are proposed and computed as follows. based on keywords found 
 * in the attributes the stat would randomize. Certain attributes which are visual would thus be required to be tied to a stat.
 * These stats need to be brought to the project-config front-end.
 */

export type MeowStatName =
  | 'Furr-midable' // diamonds, tie, finance, pirate
  | 'Purr-fect' // eth, alps, math, bitcoin, finance
  | 'Claw-ver' // milk, math, bitcoin, eth
  | 'Cat-titude' // party hat, paper bag, monocle
  | 'Radi-claw' // swimcap, spaceman,
  | 'Purr-suasive' // horns, batman, unicorn, dino
  | 'Meow-legance' // glasses, suit, monocle
  | 'Curio-hiss-ty' // unicorn, propeller
  | 'Meow-gic' // bunny, pineapple, mushrooms, hemp
  | 'Spirit'; // unicorn, pirate

export const meow_stats: Stat[] = [
  {
    stat_name: 'Furr-midable',
    trigger_keywords: ['tie', 'finance', 'pirate'],
    max_keywords: ['diamonds'],
  },
  {
    stat_name: 'Purr-fect',
    trigger_keywords: ['eth', 'math', 'bitcoin', 'finance'],
    max_keywords: ['alps'],
  },
  {
    stat_name: 'Claw-ver',
    trigger_keywords: ['milk', 'math', 'finance'],
    max_keywords: ['bitcoin'],
  },
  {
    stat_name: 'Cat-titude',
    trigger_keywords: ['party hat', 'paper bag', 'monocle'],
    max_keywords: ['underwater'],
  },
  {
    stat_name: 'Radi-claw',
    trigger_keywords: ['swimcap', 'spaceman'],
    max_keywords: ['space'],
  },
  {
    stat_name: 'Purr-suasive',
    trigger_keywords: ['horns', 'unicorn', 'dino'],
    max_keywords: ['batman'],
  },
  {
    stat_name: 'Meow-legance',
    trigger_keywords: ['glasses', 'suit', 'monocle'],
    max_keywords: ['ethereum'],
  },
  {
    stat_name: 'Curio-hiss-ty',
    trigger_keywords: ['propellor'],
    max_keywords: ['unicorn', 'flyagaric'],
  },
  {
    stat_name: 'Meow-gic',
    trigger_keywords: ['bunny', 'pineapple', 'mushrooms', 'hemp'],
    max_keywords: ['famous'],
  },
  {
    stat_name: 'Spirit',
    trigger_keywords: ['pirate'],
    max_keywords: ['unicorn', 'sea_lion'],
  },
];
