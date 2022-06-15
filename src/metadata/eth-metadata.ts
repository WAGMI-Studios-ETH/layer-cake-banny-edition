import { Asset } from '../other/asset';
import { Dynamic, IHash, logger, random } from '../utils';
import { the_project } from '../other/project';
import { strip_rarity } from '../other/csv';
import { random_birthday, fourtwenty_birthday, Stat } from './stats';

import { meow_stats } from './meow-stats';
import { banny_stats } from './banny-stats';
import { test_stats } from './test-stats';

import { change_to_sentence_case, replace_underscores, strip_extension, trait_boost } from './metadata';
import { getMetadataRow, replaceTemplateText } from '../utils/stringVariables';
import { fillVars, generateVars } from '../utils/template';
import { MetadataInput } from '../interfaces';

export const default_stats: Stat[] = [
  {
    stat_name: 'Keyboard Skillz',
    trigger_keywords: [''],
    max_keywords: [''],
  },
];

export async function generate_ethereum_metadata(asset: Asset) {
  logger.info(`generating metadata for ${asset.base_name}`);
  const traits: IHash[] = [];
  const asset_boosts: { stat_name: string; maxxed: boolean }[] = [];
  const tags: string[] = [];

  let stats: Stat[] = [];
  switch (the_project.config.name) {
    case 'glo-gang': {
      throw new Error(`glo-gang not configured for ethereum metadata`);
    }
    case 'meowsdao': {
      stats = meow_stats;
      break;
    }
    default: {
      logger.warn('generate_ethereum_metadata default should fetch metadata.csv from layer-assets unimplemented');
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

  const boost_attributes: { trait_type: string; display_type: string; value: number }[] = [];
  for (const b of asset_boosts) {
    let range = 0.6;
    if (b.maxxed) range = 1;
    let boost_rate = 1.2 + Math.random() * range; // between 1.2 and 1.8 multiplier (20%-80% increase)
    my_stats[b.stat_name] *= boost_rate;
    const percent_increase = Math.floor((boost_rate - 1) * 100);
    boost_attributes.push({ trait_type: b.stat_name, display_type: 'boost_percentage', value: percent_increase });
  }

  const base_stat_attributes: { trait_type: string; value: number }[] = [];

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

  const { metadata_input } = the_project.config;
  let template = JSON.stringify(metadata_input);
  template = fillVars(template, generateVars(the_project));
  template = fillVars(template, generateVars({ ...asset, traits }));
  template = fillVars(template, generateVars('./layered-assets/vebanny/metadata.csv'));
  const svelteJSON = generateVars('./layered-assets/vebanny/svelte.json');
  template = fillVars(template, { SVELTE_IPFS: `https://cloudflare-ipfs.com/ipfs/${svelteJSON.cid}` });

  const metadataInput: MetadataInput = JSON.parse(template);

  const attributes = [...all_attributes, ...metadataInput.attributes].map(attrib => {
    if (typeof attrib.value === 'string' && attrib.value.match(/^\d+$/)) {
      attrib.value = Number(attrib.value);
    }
    return attrib;
  });
  // const all_attributes = [...asset.attribs, ...traits, birthday_attribute];

  // const name = `${asset.nftName} No. ${asset.base_name}`;

  let md: IHash = {
    ...metadataInput,
    identifier: asset.batch_index + 1, // `0..n`
    edition: metadataInput.edition,
    isBooleanAmount: true,
    name: metadataInput.name,
    attributes,
    symbol: metadataInput.symbol,
    shouldPreferSymbol: false,
    description: metadataInput.description,
    minter: metadataInput.minter,
    decimals: metadataInput.decimals,
    creators: metadataInput.creators,
    publishers: metadataInput.publishers,
    genre: metadataInput.genres,
    date: metadataInput.drop_date,
    tags: [...new Set([...tags, ...metadataInput.tags])],
    background_color:
      metadataInput.background_colors !== undefined
        ? metadataInput.background_colors[random(metadataInput.background_colors.length)]
        : 'FFFFFF',
    language: `en`,
    mimeType: `image/png`,
    artifactUri: asset.image_url,
    displayUri: asset.image_url,
    thumbnailUri: asset.thumb_url,
    externalUri: metadataInput.more_info_link,
    uri: asset.image_url,
    image: asset.image_url,
    animation_url: metadataInput.animation_url,
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
          value: metadataInput.native_size,
          unit: `px`,
        },
      },
    ],
  };
  if (!!metadataInput.royalties) {
    md.royalty_info = metadataInput.royalties;
  }
  if (!!metadataInput.rights) {
    md.rights = metadataInput.rights;
  }

  return md;
}
