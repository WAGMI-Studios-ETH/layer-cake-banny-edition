import { logger, delay } from '../utils';
import { Asset } from './asset';

export async function invoke_contract(assets: Asset[]) {
  logger.warn(`contract phase beginning with ${assets.length} assets`);
  logger.warn(`stage final assets and JSON to NFT.Storage`);

  for (const asset of assets) {
    logger.info(`asset ${asset.image_hash} becoming awesome...`);
    await delay(10);
  }

  logger.warn(`name, symbol, population, sale start_block`);
  logger.warn(`setting base url`);
}
