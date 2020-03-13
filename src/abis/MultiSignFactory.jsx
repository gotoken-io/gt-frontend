export const MultiSignFactoryABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'addr',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address[]',
        name: 'signers',
        type: 'address[]',
      },
    ],
    name: 'NewMultiSig',
    type: 'event',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address[]',
        name: '_signers',
        type: 'address[]',
      },
    ],
    name: 'createMultiSig',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
