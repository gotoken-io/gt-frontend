import { MultiSignVoteABI } from '../abis/MultiSignVote';
import { MultiSignABI } from '../abis/MultiSign';
import { PromiseCallback } from '../utils/promisify';
const BigNumber = require('bignumber.js');
import moment from 'moment';

export const VoteValueEnum = {
  agree: '1',
  disagree: '2',
  ignore: '0',
};
export class HpbVoteContract {
  static get() {
    return new HpbVoteContract();
  }

  async getSigners({ zone }) {
    return [];
  }

  async getVoteInfo({ zone, hash }) {
    return {};
  }

  async getHpbVoteInfo({ zone, hash }) {
    const payload = '0x368e28dd' + Buffer.from(hash, 'utf8').toString('hex');
    const url = 'https://node.myhpbwallet.com';

    const options = {
      uri: url,
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      json: {
        "jsonrpc":"2.0",
        "method":"hpb_call",
        "params":[{
          "from":"0x0000000000000000000000000000000000000000",
          "to":zone.voteAddress,
          "value":"0x0",
          "data":payload
        },"latest"],
        "id":1
      }
    };

    const parse_256bits = (data) => {
      var head_of_256bits = data.substr(0,64);
      var rest_of_data = data.substr(64);
      return [head_of_256bits, rest_of_data];
    }

    const readable_string = (str) => {
      var ascii_hex = str.match(/\d\d/gi);
      var ascii_int = ascii_hex.map(t => parseInt(t,16));
      return String.fromCharCode.apply(null, ascii_int);
    }

    const parse_dynamic_type = (data, pos) => {
      // position in bytes, one character in data stands for 4 bits
      var bytes_pos = parseInt(pos, 16);
      var char_pos = bytes_pos * 8 / 4
      data = data.substr(char_pos);
      var [len, data] = parse_256bits(data);
      if (parseInt(len,16) == 0) {
        return String();
      }
      return readable_string(data.substr(0,len*8/4));
    }

    const parseVoteInfo = (info) => {
      info = info.substr(2);
      var [exists, data] = parse_256bits(info);
      var [determined, data] = parse_256bits(data);
      var [start_height, data] = parse_256bits(data);
      var [end_height, data] = parse_256bits(data);
      var [owner, data] = parse_256bits(data);
      var [announcement_pos, data] = parse_256bits(data);
      var [value_pos, data] = parse_256bits(data);
      var announcement = parse_dynamic_type(info, announcement_pos);
      var value = parse_dynamic_type(info, value_pos);
      return [Boolean(parseInt(exists,16)),
              Boolean(parseInt(determined,16)),
              parseInt(start_height,16),
              parseInt(end_height,16),
              owner.substr(-40),announcement,value];
    }

    var request = require('request');
    const resp = await PromiseCallback(cb => request(options, cb));
    const [
      exists,
      determined,
      start_height,
      end_height,
      owner,
      announcement,
      value,
    ] = parseVoteInfo(resp.body.result);

    return {
      exists,
      determined,
      start_height: new BigNumber(start_height).toNumber(),
      end_height: new BigNumber(end_height).toNumber(),
      owner,
      announcement: announcement,
      value: value,
    };
  }

}
