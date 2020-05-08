export const MultiSignVoteABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_multisig',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'ClaimedTokens',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: '_old',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_new',
        type: 'address',
      },
    ],
    name: 'TransferMultiSig',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: '_hash',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_start_height',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_end_height',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'announcement',
        type: 'string',
      },
    ],
    name: 'VoteChange',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: '_hash',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_start_height',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_end_height',
        type: 'uint256',
      },
    ],
    name: 'VoteCreate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: '_hash',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'string',
        name: '_value',
        type: 'string',
      },
    ],
    name: 'VotePass',
    type: 'event',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'bytes32',
        name: '_hash',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: '_start_height',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_end_height',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'announcement',
        type: 'string',
      },
    ],
    name: 'changeVoteInfo',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'bytes32',
        name: '_hash',
        type: 'bytes32',
      },
    ],
    name: 'checkVoteValue',
    outputs: [
      {
        internalType: 'string',
        name: 'value',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint64',
        name: 'id',
        type: 'uint64',
      },
      {
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
      {
        internalType: 'address payable',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'claimStdTokens',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'bytes32',
        name: '_hash',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: '_start_height',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_end_height',
        type: 'uint256',
      },
    ],
    name: 'createVote',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'created_vote_number',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'determined_vote_number',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'bytes32',
        name: '_hash',
        type: 'bytes32',
      },
    ],
    name: 'isVoteDetermined',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'multisig_contract',
    outputs: [
      {
        internalType: 'contract MultiSigInterface',
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint64',
        name: 'id',
        type: 'uint64',
      },
      {
        internalType: 'address',
        name: '_contract',
        type: 'address',
      },
    ],
    name: 'transfer_multisig',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint64',
        name: 'id',
        type: 'uint64',
      },
      {
        internalType: 'bytes32',
        name: '_hash',
        type: 'bytes32',
      },
      {
        internalType: 'string',
        name: '_value',
        type: 'string',
      },
    ],
    name: 'vote',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'bytes32',
        name: '_hash',
        type: 'bytes32',
      },
    ],
    name: 'voteInfo',
    outputs: [
      {
        internalType: 'bool',
        name: 'determined',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'start_height',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'end_height',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'announcement',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'value',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'vote_status',
    outputs: [
      {
        internalType: 'bool',
        name: 'exist',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'determined',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'start_height',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'end_height',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'announcement',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'value',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];
