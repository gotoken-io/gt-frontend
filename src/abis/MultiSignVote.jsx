export const MultiSignVoteABI = [
   {
      "inputs":[
         {
            "type":"uint64",
            "name":"id"
         },
         {
            "type":"address",
            "name":"_contract"
         }
      ],
      "constant":false,
      "name":"transfer_multisig",
      "outputs":[

      ],
      "stateMutability":"nonpayable",
      "payable":false,
      "type":"function"
   },
   {
      "inputs":[
         {
            "type":"bytes32",
            "name":""
         }
      ],
      "constant":true,
      "name":"vote_status",
      "outputs":[
         {
            "type":"bool",
            "name":"exist"
         },
         {
            "type":"bool",
            "name":"determined"
         },
         {
            "type":"uint256",
            "name":"start_height"
         },
         {
            "type":"uint256",
            "name":"end_height"
         },
         {
            "type":"address",
            "name":"owner"
         },
         {
            "type":"string",
            "name":"announcement"
         },
         {
            "type":"string",
            "name":"value"
         },
         {
            "type":"uint64",
            "name":"vote_id"
         }
      ],
      "stateMutability":"view",
      "payable":false,
      "type":"function"
   },
   {
      "inputs":[

      ],
      "constant":true,
      "name":"determined_vote_number",
      "outputs":[
         {
            "type":"uint256",
            "name":""
         }
      ],
      "stateMutability":"view",
      "payable":false,
      "type":"function"
   },
   {
      "inputs":[

      ],
      "constant":true,
      "name":"created_vote_number",
      "outputs":[
         {
            "type":"uint256",
            "name":""
         }
      ],
      "stateMutability":"view",
      "payable":false,
      "type":"function"
   },
   {
      "inputs":[

      ],
      "constant":true,
      "name":"multisig_contract",
      "outputs":[
         {
            "type":"address",
            "name":""
         }
      ],
      "stateMutability":"view",
      "payable":false,
      "type":"function"
   },
   {
      "stateMutability":"nonpayable",
      "inputs":[
         {
            "type":"address",
            "name":"_multisig"
         }
      ],
      "type":"constructor",
      "payable":false
   },
   {
      "inputs":[
         {
            "indexed":false,
            "type":"bytes32",
            "name":"_hash"
         },
         {
            "indexed":false,
            "type":"uint256",
            "name":"_start_height"
         },
         {
            "indexed":false,
            "type":"uint256",
            "name":"_end_height"
         }
      ],
      "type":"event",
      "name":"VoteCreate",
      "anonymous":false
   },
   {
      "inputs":[
         {
            "indexed":false,
            "type":"bytes32",
            "name":"_hash"
         },
         {
            "indexed":false,
            "type":"uint256",
            "name":"_start_height"
         },
         {
            "indexed":false,
            "type":"uint256",
            "name":"_end_height"
         },
         {
            "indexed":false,
            "type":"string",
            "name":"announcement"
         }
      ],
      "type":"event",
      "name":"VoteChange",
      "anonymous":false
   },
   {
      "inputs":[
         {
            "indexed":false,
            "type":"bytes32",
            "name":"_hash"
         },
         {
            "indexed":false,
            "type":"string",
            "name":"_value"
         }
      ],
      "type":"event",
      "name":"VotePass",
      "anonymous":false
   },
   {
      "inputs":[
         {
            "indexed":true,
            "type":"address",
            "name":"_token"
         },
         {
            "indexed":true,
            "type":"address",
            "name":"_to"
         },
         {
            "indexed":false,
            "type":"uint256",
            "name":"_amount"
         }
      ],
      "type":"event",
      "name":"ClaimedTokens",
      "anonymous":false
   },
   {
      "inputs":[
         {
            "indexed":false,
            "type":"address",
            "name":"_old"
         },
         {
            "indexed":false,
            "type":"address",
            "name":"_new"
         }
      ],
      "type":"event",
      "name":"TransferMultiSig",
      "anonymous":false
   },
   {
      "inputs":[
         {
            "type":"bytes32",
            "name":"_hash"
         },
         {
            "type":"uint256",
            "name":"_start_height"
         },
         {
            "type":"uint256",
            "name":"_end_height"
         }
      ],
      "constant":false,
      "name":"createVote",
      "outputs":[
         {
            "type":"bool",
            "name":""
         }
      ],
      "stateMutability":"nonpayable",
      "payable":false,
      "type":"function"
   },
   {
      "inputs":[
         {
            "type":"bytes32",
            "name":"_hash"
         },
         {
            "type":"uint256",
            "name":"_start_height"
         },
         {
            "type":"uint256",
            "name":"_end_height"
         },
         {
            "type":"string",
            "name":"announcement"
         }
      ],
      "constant":false,
      "name":"changeVoteInfo",
      "outputs":[
         {
            "type":"bool",
            "name":""
         }
      ],
      "stateMutability":"nonpayable",
      "payable":false,
      "type":"function"
   },
   {
      "inputs":[
         {
            "type":"uint64",
            "name":"id"
         },
         {
            "type":"bytes32",
            "name":"_hash"
         },
         {
            "type":"string",
            "name":"_value"
         }
      ],
      "constant":false,
      "name":"vote",
      "outputs":[
         {
            "type":"bool",
            "name":""
         }
      ],
      "stateMutability":"nonpayable",
      "payable":false,
      "type":"function"
   },
   {
      "inputs":[
         {
            "type":"bytes32",
            "name":"_hash"
         }
      ],
      "constant":true,
      "name":"isVoteDetermined",
      "outputs":[
         {
            "type":"bool",
            "name":""
         }
      ],
      "stateMutability":"view",
      "payable":false,
      "type":"function"
   },
   {
      "inputs":[
         {
            "type":"bytes32",
            "name":"_hash"
         }
      ],
      "constant":true,
      "name":"checkVoteValue",
      "outputs":[
         {
            "type":"string",
            "name":"value"
         }
      ],
      "stateMutability":"view",
      "payable":false,
      "type":"function"
   },
   {
      "inputs":[
         {
            "type":"bytes32",
            "name":"_hash"
         }
      ],
      "constant":true,
      "name":"voteInfo",
      "outputs":[
         {
            "type":"bool",
            "name":"determined"
         },
         {
            "type":"uint256",
            "name":"start_height"
         },
         {
            "type":"uint256",
            "name":"end_height"
         },
         {
            "type":"address",
            "name":"owner"
         },
         {
            "type":"string",
            "name":"announcement"
         },
         {
            "type":"string",
            "name":"value"
         }
      ],
      "stateMutability":"view",
      "payable":false,
      "type":"function"
   },
   {
      "inputs":[
         {
            "type":"uint64",
            "name":"id"
         },
         {
            "type":"address",
            "name":"_token"
         },
         {
            "type":"address",
            "name":"to"
         }
      ],
      "constant":false,
      "name":"claimStdTokens",
      "outputs":[

      ],
      "stateMutability":"nonpayable",
      "payable":false,
      "type":"function"
   }
];
