export const MultiSignABI = [
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 's',
        type: 'address[]',
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
        indexed: false,
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'id',
        type: 'uint64',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'propose_height',
        type: 'uint256',
      },
    ],
    name: 'function_called',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address[]',
        name: 'old_signers',
        type: 'address[]',
      },
      {
        indexed: false,
        internalType: 'address[]',
        name: 'new_signers',
        type: 'address[]',
      },
    ],
    name: 'signers_reformed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'id',
        type: 'uint64',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'current_signed_number',
        type: 'uint64',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'propose_height',
        type: 'uint256',
      },
    ],
    name: 'valid_function_sign',
    type: 'event',
  },
  {
    constant: true,
    inputs: [],
    name: 'get_signers',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
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
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
    ],
    name: 'get_unused_invoke_id',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
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
    name: 'invokes',
    outputs: [
      {
        internalType: 'uint256',
        name: 'propose_height',
        type: 'uint256',
      },
      {
        internalType: 'bytes32',
        name: 'invoke_hash',
        type: 'bytes32',
      },
      {
        internalType: 'string',
        name: 'func_name',
        type: 'string',
      },
      {
        internalType: 'uint64',
        name: 'invoke_id',
        type: 'uint64',
      },
      {
        internalType: 'bool',
        name: 'called',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'processing',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'exists',
        type: 'bool',
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
        internalType: 'address',
        name: '_addr',
        type: 'address',
      },
    ],
    name: 'is_signer',
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
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
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
        internalType: 'address[]',
        name: 's',
        type: 'address[]',
      },
    ],
    name: 'reform_signers',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'signer_join_height',
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
    name: 'signer_number',
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
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'signers',
    outputs: [
      {
        internalType: 'address',
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
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        internalType: 'bytes32',
        name: 'hash',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'update_and_check_reach_majority',
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
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'used_invoke_ids',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];
