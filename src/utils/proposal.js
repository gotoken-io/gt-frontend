import { formatMessage } from 'umi-plugin-react/locale';

// status
export const proposalStatus = [
  {
    key: 'wait_to_vote',
    value: 100,
    text: formatMessage({ id: 'proposal.status.wait_to_vote' }),
  },
  {
    key: 'set_up_voting',
    value: 200,
    text: formatMessage({ id: 'proposal.status.set_up_voting' }),
  },
  {
    key: 'claiming',
    value: 300,
    text: formatMessage({ id: 'proposal.status.claiming' }),
  },
  {
    key: 'set_up_vote_fail',
    value: 400,
    text: formatMessage({ id: 'proposal.status.set_up_vote_fail' }),
  },
  {
    key: 'under_way',
    value: 500,
    text: formatMessage({ id: 'proposal.status.under_way' }),
  },
  {
    key: 'checking',
    value: 600,
    text: formatMessage({ id: 'proposal.status.checking' }),
  },
  {
    key: 'success',
    value: 700,
    text: formatMessage({ id: 'proposal.status.success' }),
  },
  {
    key: 'fail',
    value: 800,
    text: formatMessage({ id: 'proposal.status.fail' }),
  },
];

export const getStatusByKey = key => proposalStatus.find(d => d.key === key);
export const getStatusTextByKey = key => getStatusByKey(key).text;

// event
export const proposalEvent = [
  // create = 1 # 创建提案
  // update_info = 2 # 更新提案信息
  // update_status = 3 # 更新提案状态
  // update_progress = 4 # 更新项目进度
  // onchain_success = 5 # 提案上链成功
  // onchain_fail = 6 # 提案上链失败
  // vote = 7 # 给提案投票
  // vote_result = 8 # 投票结果产生
  {
    key: 'create',
    value: 1,
    text: formatMessage({ id: 'proposal.event.create' }),
    color: 'gray',
  },
  {
    key: 'update_info',
    value: 2,
    text: formatMessage({ id: 'proposal.event.update_info' }),
    color: 'gray',
  },
  {
    key: 'update_status',
    value: 3,
    text: formatMessage({ id: 'proposal.event.update_status' }),
    color: 'green',
  },
  {
    key: 'update_progress',
    value: 4,
    text: formatMessage({ id: 'proposal.event.update_progress' }),
    color: 'green',
  },
  {
    key: 'onchain_success',
    value: 5,
    text: formatMessage({ id: 'proposal.event.onchain_success' }),
    color: 'green',
  },
  {
    key: 'onchain_fail',
    value: 6,
    text: formatMessage({ id: 'proposal.event.onchain_fail' }),
    color: 'fail',
  },
  {
    key: 'vote',
    value: 7,
    text: formatMessage({ id: 'proposal.event.vote' }),
    color: 'green',
  },
  {
    key: 'vote_result',
    value: 8,
    text: formatMessage({ id: 'proposal.event.vote_result' }),
    color: 'green',
  },
  {
    key: 'proposal_claim_claiming',
    value: 9,
    text: formatMessage({ id: 'proposal.event.proposal_claim_claiming' }),
    color: 'gray',
  },
  {
    key: 'proposal_claim_cancel',
    value: 10,
    text: formatMessage({ id: 'proposal.event.proposal_claim_cancel' }),
    color: 'gray',
  },
  {
    key: 'proposal_claim_passed',
    value: 11,
    text: formatMessage({ id: 'proposal.event.proposal_claim_passed' }),
    color: 'green',
  },
  {
    key: 'proposal_claim_fail',
    value: 12,
    text: formatMessage({ id: 'proposal.event.proposal_claim_fail' }),
    color: 'red',
  },
  {
    key: 'proposal_claim_result_submit',
    value: 13,
    text: formatMessage({ id: 'proposal.event.proposal_claim_result_submit' }),
    color: 'lime',
  },
  {
    key: 'proposal_claim_result_approve',
    value: 14,
    text: formatMessage({ id: 'proposal.event.proposal_claim_result_approve' }),
    color: 'green',
  },
  {
    key: 'proposal_claim_result_fail',
    value: 15,
    text: formatMessage({ id: 'proposal.event.proposal_claim_result_fail' }),
    color: 'red',
  },
];

export const getProposalEventByKey = key => proposalEvent.find(d => d.key === key);

export const getProposalEventTextByKey = key => getProposalEventByKey(key).text;
