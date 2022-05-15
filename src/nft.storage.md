# [IPFS directory wrapping](https://ipfs.io/ipfs/bafybeihmko3bqo56vqetygdy67gvm7veycv3ndjy4lx3cmgovsa76tbqzu/)
Anyone using IPFS with any frequency, developing NFTs, or any DApp, recognizes the utility in storing a decentralized asset using an IPFS pinning service. While the Pinata API is convenient, at the time of writing, there does not exist a mechanism to wrap a collection of files for hosting, instead Pinata claims such allowances would open up additional attack surfaces. Therefore, a particular use case of high utility with regards to IPFS around NFT asset deployments is effectively unavailable. Additionally, programmable ingestion of NFT assets, including the deployment of its metadata to IPFS, are key requirements in deploying 10k profile pictures and the benefiting from the optimized space savings with the base URL.

[Example IPFS directory wrapping.](https://ipfs.io/ipfs/bafybeihmko3bqo56vqetygdy67gvm7veycv3ndjy4lx3cmgovsa76tbqzu) Wrapping all the files within a directory allows for the directory CID to be used as a baseURL, and the individuals files corresponding with user(s) index.

### Example directory
Create a temporary directory and random files within the new folder. The output of `dd` names each file a number between `0-1000`.
```bash
cd .cache
mkdir ipfs_test && cd ipfs_test
seq -w 1 10000 | xargs -n1 -I% sh -c 'dd if=/dev/urandom of=% bs=$(shuf -i1-1000 -n1) count=1024'
```

### Example wrapping and pinning to IPFS
```javascript
ts-node ./src/nft.storage.ts
```
This example uses the path `./.cached/ipfs_test/` and the `1000` files within to demonstrate how to package and submit to `nft.storage`, IPFS's NFT.Service's free pinning service. Below, with the `.env` array of two keys, and the folder, the `1000` files are loaded into the a `new File` buffer and then submitted at once calling `NFTS.storeDirectory` which returns the wrapped directory CID. Calling the NFT service's status on the aforementioned CID, verifies that the CID was created, the total sized used, and the pin's merkle root.

The below section from `nft.storage.ts` lines 30 through 41.
```typescript
for (let i = 0; i < _files; i++){            
        const filename = files[i];
        process.stdout.write(`${content_folder}/${filename}` + `\n`);                
        directory_files.push(
            new File([await readFile(`${content_folder}/${filename}`)], filename)
        );                                                                                          
}
process.stdout.write(`compiled a directory of ${directory_files.length} files` + `\n`);
const cid = await NFTS.storeDirectory(directory_files);
process.stdout.write(`directory (${files.length}):${content_folder}, cid:${cid}` + `\n`);
const status = await NFTS.status(cid);
console.log(status);                
```
The above console output corresponds with the below output, after the array list of files loaded.

### 
```bash
NFT Storage API Keys:2
folder:./.cache/ipfs_test/
total files:1000 files

[
  '0001.json', '0002.json', '0003.json', '0004.json', '0005.json',
  '0006.json', '0007.json', '0008.json', '0009.json', '0010.json',
  '0011.json', '0012.json', '0013.json', '0014.json', '0015.json',
  '0016.json', '0017.json', '0018.json', '0019.json', '0020.json',
  '0021.json', '0022.json', '0023.json', '0024.json', '0025.json',
  '0026.json', '0027.json', '0028.json', '0029.json', '0030.json',
  '0031.json', '0032.json', '0033.json', '0034.json', '0035.json',
  '0036.json', '0037.json', '0038.json', '0039.json', '0040.json',
  '0041.json', '0042.json', '0043.json', '0044.json', '0045.json',
  '0046.json', '0047.json', '0048.json', '0049.json', '0050.json',
  '0051.json', '0052.json', '0053.json', '0054.json', '0055.json',
  '0056.json', '0057.json', '0058.json', '0059.json', '0060.json',
  '0061.json', '0062.json', '0063.json', '0064.json', '0065.json',
  '0066.json', '0067.json', '0068.json', '0069.json', '0070.json',
  '0071.json', '0072.json', '0073.json', '0074.json', '0075.json',
  '0076.json', '0077.json', '0078.json', '0079.json', '0080.json',
  '0081.json', '0082.json', '0083.json', '0084.json', '0085.json',
  '0086.json', '0087.json', '0088.json', '0089.json', '0090.json',
  '0091.json', '0092.json', '0093.json', '0094.json', '0095.json',
  '0096.json', '0097.json', '0098.json', '0099.json', '0100.json',
  ... 900 more items
]

./.cache/ipfs_test//0001.json
./.cache/ipfs_test//0002.json
./.cache/ipfs_test//0003.json

compiled a directory of 3 files

directory (1000):./.cache/ipfs_test/, cid:bafybeihmko3bqo56vqetygdy67gvm7veycv3ndjy4lx3cmgovsa76tbqzu

{
  cid: 'bafybeihmko3bqo56vqetygdy67gvm7veycv3ndjy4lx3cmgovsa76tbqzu',
  deals: [],
  size: 165033,
  pin: {
    cid: 'bafybeihmko3bqo56vqetygdy67gvm7veycv3ndjy4lx3cmgovsa76tbqzu',
    status: 'queued',
    size: 165033,
    created: 2021-10-06T06:04:44.982Z
  },
  created: 2021-10-06T06:04:44.982Z
}
```