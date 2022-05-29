// https://gateway.pinata.cloud/ipfs/bafybeid64vrqul6a2tivtofhq7avz3jjcmgtukevhhewt5dxeigpcir3cy/1

import { ethers, network } from 'hardhat';
import { BigNumber, Contract, ContractFactory } from 'ethers';
import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';
import { project_config } from './config';

dotenvConfig({ path: resolve(__dirname, '../.env') });

async function main(): Promise<void> {
  const { tokenName, tokenSymbol, baseURI, maxTokens, startSale } = project_config;
  const Factory: ContractFactory = await ethers.getContractFactory('SevenTwentyOne');

  console.log(`Token name:${tokenName} (${tokenSymbol})`);
  console.log(`Max tokens:${maxTokens}, startSale:${startSale}`);

  const SevenTwentyOne: Contract = await Factory.deploy(tokenName, tokenSymbol, baseURI, 200, startSale);

  const deployed = await SevenTwentyOne.deployed();
  console.log(`Contract deployed to:`, SevenTwentyOne.address);

  const { deployTransaction } = deployed;
  const { hash, from, to, gasPrice, gasLimit, data, chainId, confirmations } = deployTransaction;

  console.log(`transaction id:${hash}`);
  console.log(`from:${from}, to:${to} - (${confirmations} confirmations)`);
  console.log(gasPrice, gasLimit);
  console.log(
    `Verify using:` +
      `\n` +
      `npx hardhat verify --network ${network.name} ` +
      `${SevenTwentyOne.address} ` +
      `"${tokenName}" "${tokenSymbol}" "${baseURI}" "${maxTokens}" "${startSale}"`,
  );
}

/* We recommend this pattern to be able to use async/await everywhere
  and properly handle errors. */
main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
