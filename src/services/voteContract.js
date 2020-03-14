import { MultiSignVoteABI } from '../abis/MultiSignVote';
import { MultiSignABI } from '../abis/MultiSign';
import { PromiseCallback } from '../utils/promisify';
const BigNumber = require('bignumber.js');
import moment from 'moment';
import Web3 from 'web3';

const myWeb3 = global.web3;
export const VoteValueEnum = {
  agree: '1',
  disagree: '2',
  ignore: '0',
};
export class VoteContract {
  static get() {
    return new VoteContract();
  }
  async createVote({ zone, hash, vote_duration_hours }) {
    const contract = myWeb3.eth.contract(MultiSignVoteABI).at(zone.voteAddress);

    const blockRate = 14; // await this.getBlockRate(); Too Slow
    const start_height = await PromiseCallback(cb => myWeb3.eth.getBlockNumber(cb));
    const timeDifference = moment()
      .add(vote_duration_hours, 'hours')
      .diff(moment(), 'seconds');

    const end_height = Math.round(
      new BigNumber(timeDifference)
        .div(blockRate)
        .plus(start_height)
        .toNumber(),
    );
    console.log({ hash, start_height, end_height });

    const tx = await new PromiseCallback(cb =>
      contract.createVote.sendTransaction(hash, start_height, end_height, cb),
    );

    console.log(tx);
    return tx;
  }
  async vote({ zone, hash, value }) {
    const contract = myWeb3.eth.contract(MultiSignVoteABI).at(zone.voteAddress);

    const id = await this.getId({ zone, invokeName: 'vote' });
    const tx = await new PromiseCallback(cb => contract.vote.sendTransaction(id, hash, value, cb));
    console.log({ tx });
    return tx;
  }

  async getId({ zone, invokeName }) {
    const contract = myWeb3.eth.contract(MultiSignABI).at(zone.multiSigAddress);
    const id = await PromiseCallback(cb => contract.get_unused_invoke_id.call(invokeName, cb));
    return id;
  }

  getMyAddress() {
    console.log(myWeb3.eth);
    try {
      return myWeb3.eth.coinbase;
    } catch (err) {
      return '';
    }
  }

  async getSigners({ zone }) {
    const contract = myWeb3.eth.contract(MultiSignABI).at(zone.multiSigAddress);
    const signers = await PromiseCallback(cb => contract.get_signers.call({}, cb));
    return signers;
  }

  async getVoteInfo({ zone, hash }) {
    const contract = myWeb3.eth.contract(MultiSignVoteABI).at(zone.voteAddress);
    const _hash = myWeb3.fromAscii(hash);
    const currentBlock = await PromiseCallback(cb => myWeb3.eth.getBlockNumber(cb));

    const [
      exists,
      determined,
      start_height,
      end_height,
      owner,
      announcement,
      value,
    ] = await PromiseCallback(cb => contract.vote_status.call(_hash, cb));
    const startBlock = await PromiseCallback(cb => myWeb3.eth.getBlock(start_height, cb));

    return {
      exists,
      determined,
      startBlock,
      start_height: new BigNumber(start_height).toNumber(),
      end_height: new BigNumber(end_height).toNumber(),
      owner,
      currentBlock,
      announcement: myWeb3.toAscii(announcement),
      value: myWeb3.toAscii(value),
    };
  }

  async getBlockRate() {
    const span = 10;
    const times = [];
    const currentNumber = await PromiseCallback(cb => myWeb3.eth.getBlockNumber(cb));
    const firstBlock = await PromiseCallback(cb => myWeb3.eth.getBlock(currentNumber - span, cb));
    let prevTimestamp = firstBlock.timestamp;
    console.log(currentNumber);
    for (let i = currentNumber - span + 1; i <= currentNumber; i++) {
      const block = await PromiseCallback(cb => myWeb3.eth.getBlock(i, cb));
      let time = block.timestamp - prevTimestamp;
      prevTimestamp = block.timestamp;
      times.push(time);
    }
    console.log({ times });
    return Math.round(times.reduce((a, b) => a + b, 0) / times.length);
  }
}
