/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  BigNumberish,
  Overrides,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  SevenTwentyOne,
  SevenTwentyOneInterface,
} from "../../contracts/SevenTwentyOne";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        internalType: "string",
        name: "baseURI",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "maxNftSupply",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "saleStart",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "MAX_TOTAL_TOKENS",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "OPENSEA_STORE_METADATA",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PROVENANCE",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "REVEAL_TIMESTAMP",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "baseURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "contractURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "emergencySetStartingIndexBlock",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "flipSaleState",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "numberOfTokens",
        type: "uint256",
      },
    ],
    name: "mintCommunityTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "numberOfTokens",
        type: "uint256",
      },
    ],
    name: "mintTokenTransfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "mintingIsActive",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_uri",
        type: "string",
      },
    ],
    name: "setContractURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "setStartingIndex",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "startingIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "startingIndexBlock",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "tokenByIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x600a805460ff60a01b1916905560e0604090815260808181529062002eaa60a03980516200003691600b9160209091019062000446565b506040805160208101918290526000908190526200005791600c9162000446565b503480156200006557600080fd5b5060405162002eea38038062002eea833981810160405260a08110156200008b57600080fd5b8101908080516040519392919084640100000000821115620000ac57600080fd5b908301906020820185811115620000c257600080fd5b8251640100000000811182820188101715620000dd57600080fd5b82525081516020918201929091019080838360005b838110156200010c578181015183820152602001620000f2565b50505050905090810190601f1680156200013a5780820380516001836020036101000a031916815260200191505b50604052602001805160405193929190846401000000008211156200015e57600080fd5b9083019060208201858111156200017457600080fd5b82516401000000008111828201881017156200018f57600080fd5b82525081516020918201929091019080838360005b83811015620001be578181015183820152602001620001a4565b50505050905090810190601f168015620001ec5780820380516001836020036101000a031916815260200191505b50604052602001805160405193929190846401000000008211156200021057600080fd5b9083019060208201858111156200022657600080fd5b82516401000000008111828201881017156200024157600080fd5b82525081516020918201929091019080838360005b838110156200027057818101518382015260200162000256565b50505050905090810190601f1680156200029e5780820380516001836020036101000a031916815260200191505b506040908152602082015191015190925090508484620002c56301ffc9a760e01b620003a4565b8151620002da90600690602085019062000446565b508051620002f090600790602084019062000446565b50620003036380ac58cd60e01b620003a4565b62000315635b5e139f60e01b620003a4565b6200032763780e9d6360e01b620003a4565b50600090506200033662000429565b600a80546001600160a01b0319166001600160a01b038316908117909155604051919250906000907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908290a350600d829055600e81905562000399836200042d565b5050505050620004e2565b6001600160e01b0319808216141562000404576040805162461bcd60e51b815260206004820152601c60248201527f4552433136353a20696e76616c696420696e7465726661636520696400000000604482015290519081900360640190fd5b6001600160e01b0319166000908152602081905260409020805460ff19166001179055565b3390565b80516200044290600990602084019062000446565b5050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200048957805160ff1916838001178555620004b9565b82800160010185558215620004b9579182015b82811115620004b95782518255916020019190600101906200049c565b50620004c7929150620004cb565b5090565b5b80821115620004c75760008155600101620004cc565b6129b880620004f26000396000f3fe608060405234801561001057600080fd5b50600436106102265760003560e01c8063715018a61161012a578063bdeadcb0116100bd578063e36d64981161008c578063e985e9c511610071578063e985e9c5146106cc578063e9866550146106fa578063f2fde38b1461070257610226565b8063e36d6498146106bc578063e8a3d485146106c457610226565b8063bdeadcb014610663578063c62d6d641461066b578063c87b56dd14610697578063cb774d47146106b457610226565b806395442c7f116100f957806395442c7f1461054a57806395d89b4114610567578063a22cb4651461056f578063b88d4fde1461059d57610226565b8063715018a61461048c5780637d17fcbe146104945780638da5cb5b1461049c578063938e3d7b146104a457610226565b80632f745c59116101bd5780634f6ccce71161018c5780636373a6b1116101715780636373a6b1146104565780636c0360eb1461045e57806370a082311461046657610226565b80634f6ccce71461041c5780636352211e1461043957610226565b80632f745c59146103aa57806334918dfd146103d657806342842e0e146103de5780634728b9f41461041457610226565b8063095ea7b3116101f9578063095ea7b31461032457806318160ddd1461035257806318e20a381461036c57806323b872dd1461037457610226565b806301ffc9a71461022b57806306fdde0314610266578063079993c5146102e3578063081812fc146102eb575b600080fd5b6102526004803603602081101561024157600080fd5b50356001600160e01b031916610728565b604080519115158252519081900360200190f35b61026e61074b565b6040805160208082528351818301528351919283929083019185019080838360005b838110156102a8578181015183820152602001610290565b50505050905090810190601f1680156102d55780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61026e6107e1565b6103086004803603602081101561030157600080fd5b503561086f565b604080516001600160a01b039092168252519081900360200190f35b6103506004803603604081101561033a57600080fd5b506001600160a01b0381351690602001356108d1565b005b61035a6109ac565b60408051918252519081900360200190f35b61035a6109bd565b6103506004803603606081101561038a57600080fd5b506001600160a01b038135811691602081013590911690604001356109c3565b61035a600480360360408110156103c057600080fd5b506001600160a01b038135169060200135610a1a565b610350610a45565b610350600480360360608110156103f457600080fd5b506001600160a01b03813581169160208101359091169060400135610aeb565b610252610b06565b61035a6004803603602081101561043257600080fd5b5035610b16565b6103086004803603602081101561044f57600080fd5b5035610b2c565b61026e610b54565b61026e610baf565b61035a6004803603602081101561047c57600080fd5b50356001600160a01b0316610c10565b610350610c78565b610350610d39565b610308610dfe565b610350600480360360208110156104ba57600080fd5b8101906020810181356401000000008111156104d557600080fd5b8201836020820111156104e757600080fd5b8035906020019184600183028401116401000000008311171561050957600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550610e0d945050505050565b6103506004803603602081101561056057600080fd5b5035610e8e565b61026e610fd6565b6103506004803603604081101561058557600080fd5b506001600160a01b0381351690602001351515611037565b610350600480360360808110156105b357600080fd5b6001600160a01b038235811692602081013590911691604082013591908101906080810160608201356401000000008111156105ee57600080fd5b82018360208201111561060057600080fd5b8035906020019184600183028401116401000000008311171561062257600080fd5b91908080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525092955061113c945050505050565b61035a61119a565b6103506004803603604081101561068157600080fd5b506001600160a01b0381351690602001356111a0565b61026e600480360360208110156106ad57600080fd5b503561139b565b61035a611642565b61035a611648565b61026e61164e565b610252600480360360408110156106e257600080fd5b506001600160a01b03813581169160200135166116af565b6103506116dd565b6103506004803603602081101561071857600080fd5b50356001600160a01b03166117df565b6001600160e01b0319811660009081526020819052604090205460ff165b919050565b60068054604080516020601f60026000196101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156107d75780601f106107ac576101008083540402835291602001916107d7565b820191906000526020600020905b8154815290600101906020018083116107ba57829003601f168201915b5050505050905090565b600c805460408051602060026001851615610100026000190190941693909304601f810184900484028201840190925281815292918301828280156108675780601f1061083c57610100808354040283529160200191610867565b820191906000526020600020905b81548152906001019060200180831161084a57829003601f168201915b505050505081565b600061087a826118f7565b6108b55760405162461bcd60e51b815260040180806020018281038252602c8152602001806128d6602c913960400191505060405180910390fd5b506000908152600460205260409020546001600160a01b031690565b60006108dc82610b2c565b9050806001600160a01b0316836001600160a01b0316141561092f5760405162461bcd60e51b815260040180806020018281038252602181526020018061295a6021913960400191505060405180910390fd5b806001600160a01b0316610941611904565b6001600160a01b0316148061096257506109628161095d611904565b6116af565b61099d5760405162461bcd60e51b81526004018080602001828103825260388152602001806128296038913960400191505060405180910390fd5b6109a78383611908565b505050565b60006109b86002611983565b905090565b600e5481565b6109d46109ce611904565b8261198e565b610a0f5760405162461bcd60e51b815260040180806020018281038252603181526020018061297b6031913960400191505060405180910390fd5b6109a7838383611a32565b6001600160a01b0382166000908152600160205260408120610a3c9083611b7e565b90505b92915050565b610a4d611904565b600a546001600160a01b03908116911614610aaf576040805162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b600a80547fffffffffffffffffffffff00ffffffffffffffffffffffffffffffffffffffff8116600160a01b9182900460ff1615909102179055565b6109a78383836040518060200160405280600081525061113c565b600a54600160a01b900460ff1681565b600080610b24600284611b8a565b509392505050565b6000610a3f8260405180606001604052806029815260200161288b6029913960029190611ba6565b600b805460408051602060026001851615610100026000190190941693909304601f810184900484028201840190925281815292918301828280156108675780601f1061083c57610100808354040283529160200191610867565b60098054604080516020601f60026000196101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156107d75780601f106107ac576101008083540402835291602001916107d7565b60006001600160a01b038216610c575760405162461bcd60e51b815260040180806020018281038252602a815260200180612861602a913960400191505060405180910390fd5b6001600160a01b0382166000908152600160205260409020610a3f90611983565b610c80611904565b600a546001600160a01b03908116911614610ce2576040805162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b600a546040516000916001600160a01b0316907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908390a3600a805473ffffffffffffffffffffffffffffffffffffffff19169055565b610d41611904565b600a546001600160a01b03908116911614610da3576040805162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b60105415610df8576040805162461bcd60e51b815260206004820152601d60248201527f5374617274696e6720696e64657820697320616c726561647920736574000000604482015290519081900360640190fd5b43600f55565b600a546001600160a01b031690565b610e15611904565b600a546001600160a01b03908116911614610e77576040805162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b8051610e8a90600c90602084019061267a565b5050565b610e96611904565b600a546001600160a01b03908116911614610ef8576040805162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b600d54811115610f0757600080fd5b600d54811115610f485760405162461bcd60e51b81526004018080602001828103825260288152602001806127d86028913960400191505060405180910390fd5b600d54610f5d82610f576109ac565b90611bbd565b1115610f9a5760405162461bcd60e51b81526004018080602001828103825260298152602001806128006029913960400191505060405180910390fd5b6000610fa46109ac565b905060005b828110156109a757600d54610fbc6109ac565b1015610fce57610fce33828401611c17565b600101610fa9565b60078054604080516020601f60026000196101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156107d75780601f106107ac576101008083540402835291602001916107d7565b61103f611904565b6001600160a01b0316826001600160a01b031614156110a5576040805162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c657200000000000000604482015290519081900360640190fd5b80600560006110b2611904565b6001600160a01b03908116825260208083019390935260409182016000908120918716808252919093529120805460ff1916921515929092179091556110f6611904565b6001600160a01b03167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c318360405180821515815260200191505060405180910390a35050565b61114d611147611904565b8361198e565b6111885760405162461bcd60e51b815260040180806020018281038252603181526020018061297b6031913960400191505060405180910390fd5b61119484848484611c31565b50505050565b600d5481565b6111a8611904565b600a546001600160a01b0390811691161461120a576040805162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b600d5481111561121957600080fd5b600d5481111561125a5760405162461bcd60e51b81526004018080602001828103825260288152602001806127d86028913960400191505060405180910390fd5b600d5461126982610f576109ac565b11156112a65760405162461bcd60e51b81526004018080602001828103825260298152602001806128006029913960400191505060405180910390fd5b6001600160a01b038216301415611304576040805162461bcd60e51b815260206004820152601f60248201527f43616e6e6f74206d696e7420746f20636f6e747261637420697473656c662e00604482015290519081900360640190fd5b6001600160a01b03821661135f576040805162461bcd60e51b815260206004820181905260248201527f43616e6e6f74206d696e7420746f20746865206e756c6c20616464726573732e604482015290519081900360640190fd5b60006113696109ac565b905060005b8281101561119457600d546113816109ac565b10156113935761139384828401611c17565b60010161136e565b60606113a6826118f7565b6113e15760405162461bcd60e51b815260040180806020018281038252602f81526020018061292b602f913960400191505060405180910390fd5b60008281526008602090815260409182902080548351601f60026000196101006001861615020190931692909204918201849004840281018401909452808452606093928301828280156114765780601f1061144b57610100808354040283529160200191611476565b820191906000526020600020905b81548152906001019060200180831161145957829003601f168201915b50506009549394505050506002600019610100600184161502019091160461149f579050610746565b8051156115705760098160405160200180838054600181600116156101000203166002900480156115075780601f106114e5576101008083540402835291820191611507565b820191906000526020600020905b8154815290600101906020018083116114f3575b5050825160208401908083835b602083106115335780518252601f199092019160209182019101611514565b6001836020036101000a03801982511681845116808217855250505050505090500192505050604051602081830303815290604052915050610746565b600961157b84611c83565b60405160200180838054600181600116156101000203166002900480156115d95780601f106115b75761010080835404028352918201916115d9565b820191906000526020600020905b8154815290600101906020018083116115c5575b5050825160208401908083835b602083106116055780518252601f1990920191602091820191016115e6565b6001836020036101000a03801982511681845116808217855250505050505090500192505050604051602081830303815290604052915050919050565b60105481565b600f5481565b600c8054604080516020601f60026000196101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156107d75780601f106107ac576101008083540402835291602001916107d7565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b60105415611732576040805162461bcd60e51b815260206004820152601d60248201527f5374617274696e6720696e64657820697320616c726561647920736574000000604482015290519081900360640190fd5b600f54611786576040805162461bcd60e51b815260206004820181905260248201527f5374617274696e6720696e64657820626c6f636b206d75737420626520736574604482015290519081900360640190fd5b600d54600f54408161179457fe5b06601055600f5460ff906117a9904390611d76565b11156117c457600d54600019430140816117bf57fe5b066010555b6010546117dd576010546117d9906001611bbd565b6010555b565b6117e7611904565b600a546001600160a01b03908116911614611849576040805162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b6001600160a01b03811661188e5760405162461bcd60e51b81526004018080602001828103825260268152602001806127626026913960400191505060405180910390fd5b600a546040516001600160a01b038084169216907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3600a805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0392909216919091179055565b6000610a3f600283611db8565b3390565b6000818152600460205260409020805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b038416908117909155819061194a82610b2c565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6000610a3f82611dc4565b6000611999826118f7565b6119d45760405162461bcd60e51b815260040180806020018281038252602c8152602001806127ac602c913960400191505060405180910390fd5b60006119df83610b2c565b9050806001600160a01b0316846001600160a01b03161480611a1a5750836001600160a01b0316611a0f8461086f565b6001600160a01b0316145b80611a2a5750611a2a81856116af565b949350505050565b826001600160a01b0316611a4582610b2c565b6001600160a01b031614611a8a5760405162461bcd60e51b81526004018080602001828103825260298152602001806129026029913960400191505060405180910390fd5b6001600160a01b038216611acf5760405162461bcd60e51b81526004018080602001828103825260248152602001806127886024913960400191505060405180910390fd5b611ada8383836109a7565b611ae5600082611908565b6001600160a01b0383166000908152600160205260409020611b079082611dc8565b506001600160a01b0382166000908152600160205260409020611b2a9082611dd4565b50611b3760028284611de0565b5080826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4505050565b6000610a3c8383611df6565b6000808080611b998686611e5a565b9097909650945050505050565b6000611bb3848484611ed5565b90505b9392505050565b600082820183811015610a3c576040805162461bcd60e51b815260206004820152601b60248201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604482015290519081900360640190fd5b610e8a828260405180602001604052806000815250611f9f565b611c3c848484611a32565b611c4884848484611ff1565b6111945760405162461bcd60e51b81526004018080602001828103825260328152602001806127306032913960400191505060405180910390fd5b606081611ca857506040805180820190915260018152600360fc1b6020820152610746565b8160005b8115611cc057600101600a82049150611cac565b60608167ffffffffffffffff81118015611cd957600080fd5b506040519080825280601f01601f191660200182016040528015611d04576020820181803683370190505b50859350905060001982015b8315611d6d57600a840660300160f81b82828060019003935081518110611d3357fe5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a905350600a84049350611d10565b50949350505050565b6000610a3c83836040518060400160405280601e81526020017f536166654d6174683a207375627472616374696f6e206f766572666c6f770000815250612183565b6000610a3c83836121dd565b5490565b6000610a3c83836121f5565b6000610a3c83836122bb565b6000611bb384846001600160a01b038516612305565b81546000908210611e385760405162461bcd60e51b815260040180806020018281038252602281526020018061270e6022913960400191505060405180910390fd5b826000018281548110611e4757fe5b9060005260206000200154905092915050565b815460009081908310611e9e5760405162461bcd60e51b81526004018080602001828103825260228152602001806128b46022913960400191505060405180910390fd5b6000846000018481548110611eaf57fe5b906000526020600020906002020190508060000154816001015492509250509250929050565b60008281526001840160205260408120548281611f705760405162461bcd60e51b81526004018080602001828103825283818151815260200191508051906020019080838360005b83811015611f35578181015183820152602001611f1d565b50505050905090810190601f168015611f625780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b50846000016001820381548110611f8357fe5b9060005260206000209060020201600101549150509392505050565b611fa9838361239c565b611fb66000848484611ff1565b6109a75760405162461bcd60e51b81526004018080602001828103825260328152602001806127306032913960400191505060405180910390fd5b6000612005846001600160a01b03166124ca565b61201157506001611a2a565b6060612149630a85bd0160e11b612026611904565b88878760405160240180856001600160a01b03168152602001846001600160a01b0316815260200183815260200180602001828103825283818151815260200191508051906020019080838360005b8381101561208d578181015183820152602001612075565b50505050905090810190601f1680156120ba5780820380516001836020036101000a031916815260200191505b5095505050505050604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050604051806060016040528060328152602001612730603291396001600160a01b0388169190612503565b9050600081806020019051602081101561216257600080fd5b50516001600160e01b031916630a85bd0160e11b1492505050949350505050565b600081848411156121d55760405162461bcd60e51b8152602060048201818152835160248401528351909283926044909101919085019080838360008315611f35578181015183820152602001611f1d565b505050900390565b60009081526001919091016020526040902054151590565b600081815260018301602052604081205480156122b1578354600019808301919081019060009087908390811061222857fe5b906000526020600020015490508087600001848154811061224557fe5b60009182526020808320909101929092558281526001898101909252604090209084019055865487908061227557fe5b60019003818190600052602060002001600090559055866001016000878152602001908152602001600020600090556001945050505050610a3f565b6000915050610a3f565b60006122c783836121dd565b6122fd57508154600181810184556000848152602080822090930184905584548482528286019093526040902091909155610a3f565b506000610a3f565b60008281526001840160205260408120548061236a575050604080518082018252838152602080820184815286546001818101895560008981528481209551600290930290950191825591519082015586548684528188019092529290912055611bb6565b8285600001600183038154811061237d57fe5b9060005260206000209060020201600101819055506000915050611bb6565b6001600160a01b0382166123f7576040805162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f2061646472657373604482015290519081900360640190fd5b612400816118f7565b15612452576040805162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e74656400000000604482015290519081900360640190fd5b61245e600083836109a7565b6001600160a01b03821660009081526001602052604090206124809082611dd4565b5061248d60028284611de0565b5060405181906001600160a01b038416906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b6000813f7fc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470818114801590611a2a575050151592915050565b6060611bb384846000856060612518856124ca565b612569576040805162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604482015290519081900360640190fd5b60006060866001600160a01b031685876040518082805190602001908083835b602083106125a85780518252601f199092019160209182019101612589565b6001836020036101000a03801982511681845116808217855250505050505090500191505060006040518083038185875af1925050503d806000811461260a576040519150601f19603f3d011682016040523d82523d6000602084013e61260f565b606091505b50915091508115612623579150611a2a9050565b8051156126335780518082602001fd5b60405162461bcd60e51b8152602060048201818152865160248401528651879391928392604401919085019080838360008315611f35578181015183820152602001611f1d565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106126bb57805160ff19168380011785556126e8565b828001600101855582156126e8579182015b828111156126e85782518255916020019190600101906126cd565b506126f49291506126f8565b5090565b5b808211156126f457600081556001016126f956fe456e756d657261626c655365743a20696e646578206f7574206f6620626f756e64734552433732313a207472616e7366657220746f206e6f6e20455243373231526563656976657220696d706c656d656e7465724f776e61626c653a206e6577206f776e657220697320746865207a65726f20616464726573734552433732313a207472616e7366657220746f20746865207a65726f20616464726573734552433732313a206f70657261746f7220717565727920666f72206e6f6e6578697374656e7420746f6b656e43616e206e6f74206d696e74206d6f7265207468616e2074686520746f74616c20737570706c792e4d696e74696e6720776f756c6420657863656564206d617820737570706c79206f6620546f6b656e734552433732313a20617070726f76652063616c6c6572206973206e6f74206f776e6572206e6f7220617070726f76656420666f7220616c6c4552433732313a2062616c616e636520717565727920666f7220746865207a65726f20616464726573734552433732313a206f776e657220717565727920666f72206e6f6e6578697374656e7420746f6b656e456e756d657261626c654d61703a20696e646578206f7574206f6620626f756e64734552433732313a20617070726f76656420717565727920666f72206e6f6e6578697374656e7420746f6b656e4552433732313a207472616e73666572206f6620746f6b656e2074686174206973206e6f74206f776e4552433732314d657461646174613a2055524920717565727920666f72206e6f6e6578697374656e7420746f6b656e4552433732313a20617070726f76616c20746f2063757272656e74206f776e65724552433732313a207472616e736665722063616c6c6572206973206e6f74206f776e6572206e6f7220617070726f766564a164736f6c6343000700000a65303232366235373436396564663532343062663039383563333366356431386435363930343036363961633336353935366439633662346233316365373565";

type SevenTwentyOneConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SevenTwentyOneConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class SevenTwentyOne__factory extends ContractFactory {
  constructor(...args: SevenTwentyOneConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    name: string,
    symbol: string,
    baseURI: string,
    maxNftSupply: BigNumberish,
    saleStart: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<SevenTwentyOne> {
    return super.deploy(
      name,
      symbol,
      baseURI,
      maxNftSupply,
      saleStart,
      overrides || {}
    ) as Promise<SevenTwentyOne>;
  }
  override getDeployTransaction(
    name: string,
    symbol: string,
    baseURI: string,
    maxNftSupply: BigNumberish,
    saleStart: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      name,
      symbol,
      baseURI,
      maxNftSupply,
      saleStart,
      overrides || {}
    );
  }
  override attach(address: string): SevenTwentyOne {
    return super.attach(address) as SevenTwentyOne;
  }
  override connect(signer: Signer): SevenTwentyOne__factory {
    return super.connect(signer) as SevenTwentyOne__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SevenTwentyOneInterface {
    return new utils.Interface(_abi) as SevenTwentyOneInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SevenTwentyOne {
    return new Contract(address, _abi, signerOrProvider) as SevenTwentyOne;
  }
}
