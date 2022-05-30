import { NFTStorage, File } from 'nft.storage';
import path from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { readDirectory } from '../src/other/compile-template';
import { NFT_STORAGE_API_KEYS } from '../src/config';

async function main() {
  const directoryPath = path.resolve(__dirname, '../svelte/dist/');

  const dirPath = path.resolve(__dirname, '..', directoryPath);
  const dir = readDirectory(dirPath);

  const files: any[] = [];
  for (const filePath of dir) {
    const file = new File([readFileSync(filePath)], filePath.replace(`${dirPath}/`, ''));
    files.push(file);
  }

  const api_key = NFT_STORAGE_API_KEYS[NFT_STORAGE_API_KEYS.length - 1];
  const storage = new NFTStorage({ token: api_key });

  const cid = await storage.storeDirectory(files);
  console.log({ cid });

  const status = await storage.status(cid);
  writeFileSync(path.resolve(__dirname, '../layered-assets/vebanny/svelte.json'), JSON.stringify(status, null, '  '));
  console.log(status);
}

main();
