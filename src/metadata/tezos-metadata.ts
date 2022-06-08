import { Asset } from '../other/asset';
import { IHash, logger } from '../utils';
import { the_project } from '../other/project';
import { strip_rarity } from '../other/csv';
import { replace_underscores, strip_extension } from './metadata';
import { getMetadataRow, replaceTemplateText } from '../utils/stringVariables';

export async function generate_tezos_metadata(asset: Asset, excluded_layers_from_metadata: string[] = []) {
  logger.info(`generating metadata for ${asset.base_name}`);
  const attributes: {}[] = [];
  const tags: string[] = [];
  asset.traits.forEach(trait => {
    if (excluded_layers_from_metadata.indexOf(trait.trait_type) !== -1) return;
    console.log(trait.trait_type);
    attributes.push({
      name: trait.trait_type,
      value: replace_underscores(strip_rarity(strip_extension(trait.value))),
    });
    tags.push(trait.trait_type);
  });
  asset.traits.forEach(trait => {
    if (excluded_layers_from_metadata.indexOf(trait.trait_type) !== -1) return;
    tags.push(replace_underscores(strip_rarity(strip_extension(trait.value))));
  });
  const i = the_project.config.metadata_input;
  const name = i.include_total_population_in_name
    ? `${asset.nftName} ${asset.base_name}/${the_project.total_populations_size}`
    : `${asset.nftName} ${asset.base_name}`;
  const md: IHash = {
    identifier: asset.batch_index + 1, // `0..n`
    name: name,
    symbol: `${i.symbol}${asset.base_name}`,
    shouldPreferSymbol: false,
    isBooleanAmount: true,
    isTransferable: true,
    artifactUri: asset.image_url,
    displayUri: asset.image_url,
    thumbnailUri: asset.thumb_url,
    uri: asset.image_url,
    externalUri: i.more_info_link,
    hash: asset.image_hash,
    description: i.description,
    minter: i.minter,
    decimals: i.decimals,
    generation: i.generation,
    edition: i.edition,
    id: asset.batch_index + 1,
    attributes: attributes,
    creators: i.creators,
    publishers: i.publishers,
    genre: i.genres,
    date: i.drop_date,
    type: `Image`,
    tags: tags,
    language: `en`,
    mimeType: `image/png`,
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
    md.royalties = i.royalties;
  }
  if (!!i.rights) {
    md.rights = i.rights;
  }
  let variablesToReplace = i.population_metadata?.substitute_variables;
  if (variablesToReplace && variablesToReplace.length > 0) {
    const metadataRow = await getMetadataRow(the_project, asset.nftName);
    variablesToReplace.forEach(variable => {
      if (metadataRow && md[variable]) {
        md[variable] = replaceTemplateText(metadataRow, md[variable]);
      }
    });
  }
  return md;
}
