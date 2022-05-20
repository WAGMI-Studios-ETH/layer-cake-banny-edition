import { Asset } from '../asset';
import { Dynamic, IHash, logger, random } from '../utils';
import { the_project } from '../project';
import { strip_rarity } from '../csv';
import { random_birthday, fourtwenty_birthday, Stat } from './stats';
import { meow_stats } from './meow-stats';
import { banny_stats } from './banny-stats';
import { test_stats } from './test-stats';
import { change_to_sentence_case, replace_underscores, strip_extension, trait_boost } from './metadata';

export const default_stats: Stat[] = [
  {
    stat_name: 'Banana Strength',
    trigger_keywords: ['color'],
    max_keywords: ['white', 'yellow'],
  },
];

export function generate_ethereum_metadata(asset: Asset) {
  logger.info(`generating metadata for ${asset.base_name}`);
  const traits: IHash[] = [];
  const asset_boosts: { stat_name: string; maxxed: boolean }[] = [];
  const tags: string[] = [];

  let stats: Stat[];
  switch (the_project.config.name) {
    case 'glo-gang': {
      throw new Error(`glo-gang not configured for ethereum metadata`);
    }
    case 'meowsdao': {
      stats = meow_stats;
      break;
    }
    case 'veBanny': {
      stats = banny_stats;
      break;
    }
    default: {
      logger.warn('using default project stats for metadata');
      stats = default_stats;
      break;
    }
  }

  asset.traits.forEach(trait => {
    tags.push(replace_underscores(trait.trait_type));
  });

  asset.traits.forEach(trait => {
    let stripped_value = replace_underscores(strip_rarity(strip_extension(trait.value)));
    if (trait.trait_type !== 'Signature') {
      stripped_value = change_to_sentence_case(stripped_value);
    }
    const boost = trait_boost(trait, stats);
    if (!!boost) {
      asset_boosts.push(boost);
    }
    const cleaned_trait_name = replace_underscores(trait.trait_type);
    traits.push({ trait_type: cleaned_trait_name, value: stripped_value });
    tags.push(stripped_value);
  });

  const my_stats: Dynamic = {};
  stats.forEach(stat => {
    my_stats[stat.stat_name] = 3 + Math.random() * 15; // 3-18
  });

  const boost_attributes = [];
  for (const b of asset_boosts) {
    let range = 0.6;
    if (b.maxxed) range = 1;
    let boost_rate = 1.2 + Math.random() * range; // between 1.2 and 1.8 multiplier (20%-80% increase)
    my_stats[b.stat_name] *= boost_rate;
    const percent_increase = Math.floor((boost_rate - 1) * 100);
    boost_attributes.push({ trait_type: b.stat_name, display_type: 'boost_percentage', value: percent_increase });
  }

  const base_stat_attributes = [];
  let stats_sum = 0;
  for (const stat_name in my_stats) {
    const val = Math.floor(my_stats[stat_name]);
    stats_sum += val;
    base_stat_attributes.push({ trait_type: stat_name, value: val });
  }

  const level = Math.floor(stats_sum / stats.length / 2);
  const level_attribute = { trait_type: 'Level', value: level };

  const birthday_ms = fourtwenty_birthday();
  const birthday_attribute = { trait_type: 'Birthday', display_type: 'date', value: birthday_ms };

  const History = asset.attribs.find(attr => attr.trait_type === 'History');
  const Motto = asset.attribs.find(attr => attr.trait_type === 'Motto');

  const all_attributes = [
    ...asset.attribs.filter(attr => [History, Motto].indexOf(attr) === -1),
    ...traits,
    birthday_attribute,
  ];

  const i = the_project.config.metadata_input;
  const name = `${i.name} No. ${asset.base_name}`;

  let md: IHash = {
    identifier: asset.batch_index + 1, // `0..n`
    edition: i.edition,
    isBooleanAmount: true,
    name: name,
    attributes: all_attributes,
    symbol: `${i.symbol}${asset.base_name}`,
    shouldPreferSymbol: false,
    description: `${i.description}${History?.value ? ' ' + History?.value : ''}${
      Motto?.value ? ' ' + Motto?.value : ''
    }`,
    minter: i.minter,
    decimals: i.decimals,
    creators: i.creators,
    publishers: i.publishers,
    genre: i.genres,
    date: i.drop_date,
    tags: tags,
    background_color:
      i.background_colors !== undefined ? i.background_colors[random(i.background_colors.length)] : 'FFFFFF',
    language: `en`,
    mimeType: `image/png`,
    artifactUri: asset.image_url,
    displayUri: asset.image_url,
    thumbnailUri: asset.thumb_url,
    externalUri: i.more_info_link,
    uri: asset.image_url,
    image: asset.image_url,
    imageSize: asset.image_size,
    formats: [
      {
        uri: asset.thumb_url,
        hash: asset.thumb_hash,
        mimeType: `image/png`,
        dimensions: {
          value: `350x350`,
          unit: `px`,
        },
      },
      {
        uri: asset.image_url,
        hash: asset.image_hash,
        mimeType: `image/png`,
        dimensions: {
          value: i.native_size,
          unit: `px`,
        },
      },
    ],
  };
  if (!!i.royalties) {
    md.royalty_info = i.royalties;
  }
  if (!!i.rights) {
    md.rights = i.rights;
  }
  return md;
}
