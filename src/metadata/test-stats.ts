import { Stat } from './stats';

export type TestStatName = 'Strength' | 'Dexterity' | 'Intelligence' | 'Constitution' | 'Luck';

export const test_stats: Stat[] = [
  {
    stat_name: 'Strength',
    trigger_keywords: ['burnt'],
    max_keywords: ['yellow'],
  },
  {
    stat_name: 'Dexterity',
    trigger_keywords: ['rather'],
    max_keywords: ['green'],
  },
  {
    stat_name: 'Intelligence',
    trigger_keywords: ['intelligent'],
    max_keywords: ['red'],
  },
  {
    stat_name: 'Constitution',
    trigger_keywords: ['constitution'],
    max_keywords: ['blue'],
  },
  {
    stat_name: 'Luck',
    trigger_keywords: ['lucky'],
    max_keywords: ['purple', 'sealion'],
  },
];
