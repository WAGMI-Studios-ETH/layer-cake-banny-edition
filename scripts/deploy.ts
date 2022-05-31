import { ethers, network } from 'hardhat';
import { BigNumber, Contract, ContractFactory } from 'ethers';
import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';
import { project_config } from './config';

dotenvConfig({ path: resolve(__dirname, '../.env') });

async function main(): Promise<void> {
  const deployer = await (await ethers.getSigners())[0].getAddress();
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

  const contract = await SevenTwentyOne.deployed();
  if (true) {
    console.log('flipping sale state');
    const txn = await contract.flipSaleState();
    await txn.wait();

    console.log('Minting....');
    const txn1 = await contract.mintTokenTransfer(deployer, 3);
    await txn1.wait();
    console.log('DONE!');
  }
}

/* We recommend this pattern to be able to use async/await everywhere
  and properly handle errors. */
main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
