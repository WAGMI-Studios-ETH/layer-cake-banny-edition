import { ethers, network } from 'hardhat';
import { BigNumber, Contract, ContractFactory } from 'ethers';
import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';
import { writeOpenseaConfig } from './config';

dotenvConfig({ path: resolve(__dirname, '../.env') });

async function main(): Promise<void> {
  const deployer = await (await ethers.getSigners())[0].getAddress();
  const result = await writeOpenseaConfig();
  const { tokenName, tokenSymbol, baseURI, maxTokens, startSale } = result.project_config;
  const Factory: ContractFactory = await ethers.getContractFactory('SevenTwentyOne');

  console.log(`Token name:${tokenName} (${tokenSymbol})`);
  console.log(`Max tokens:${maxTokens}, startSale:${startSale}`);

  const args = [tokenName, tokenSymbol, baseURI, maxTokens, startSale];

  const SevenTwentyOne: Contract = await Factory.deploy(...args);

  const deployed = await SevenTwentyOne.deployed();
  console.log(`Contract deployed to:`, SevenTwentyOne.address);

  const { deployTransaction } = deployed;
  const { hash, from, to, gasPrice, gasLimit, data, chainId, confirmations } = deployTransaction;
  const contract = await SevenTwentyOne.deployed();

  console.log('setting contract url...');
  await (await contract.setContractURI(`ipfs://${result.opensea_json_cid}/opensea.json`)).wait();

  console.log(`transaction id:${hash}`);
  console.log(`from:${from}, to:${to} - (${confirmations} confirmations)`);
  console.log(gasPrice, gasLimit);
  console.log(
    `Verify using:` +
      `\n` +
      `npx hardhat verify --network ${network.name} ` +
      `${SevenTwentyOne.address} ` +
      args.map(arg => `"${arg}"`).join(' '),
  );

  if (true) {
    console.log('flipping sale state');
    const txn = await contract.flipSaleState();
    await txn.wait();

    console.log('Minting....');
    let batch_size = 25;
    let number_of_tokens = maxTokens;
    for (let i = 0; i < number_of_tokens; i += batch_size) {
      console.log('minting batch', i, 'to', i + batch_size);
      const txn1 = await contract.mintTokenTransfer(deployer, Math.min(number_of_tokens - i, batch_size), {
        gasLimit: 20_000_000,
      });
      await txn1.wait();
    }

    console.log('Token URI:', await contract.contractURI());
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
