// status
export const proposalStatus = [
  {
    key: 'wait_to_vote',
    value: 100,
    text: '待投票',
  },
  {
    key: 'set_up_voting',
    value: 200,
    text: '立项投票中',
  },
  {
    key: 'claiming',
    value: 300,
    text: '申领中',
  },
  {
    key: 'set_up_vote_fail',
    value: 400,
    text: '投票未通过',
  },
  {
    key: 'under_way',
    value: 500,
    text: '进行中',
  },
  {
    key: 'checking',
    value: 600,
    text: '验收中',
  },
  {
    key: 'success',
    value: 700,
    text: '已完成',
  },
  {
    key: 'fail',
    value: 800,
    text: '失败',
  },
];

export const getStatusTextByKey = key => proposalStatus.find(d => d.key === key).text;

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
    text: '创建提案',
    color: 'gray',
  },
  {
    key: 'update_info',
    value: 2,
    text: '更新提案信息',
    color: 'gray',
  },
  {
    key: 'update_status',
    value: 3,
    text: '更新提案状态',
    color: 'green',
  },
  {
    key: 'update_progress',
    value: 4,
    text: '更新项目进度',
    color: 'green',
  },
  {
    key: 'onchain_success',
    value: 5,
    text: '提案上链成功',
    color: 'green',
  },
  {
    key: 'onchain_fail',
    value: 6,
    text: '提案上链失败',
    color: 'fail',
  },
  {
    key: 'vote',
    value: 7,
    text: '给提案投票',
    color: 'green',
  },
  {
    key: 'vote_result',
    value: 8,
    text: '投票结果产生',
    color: 'green',
  },
];

export const getProposalEventByKey = key => proposalEvent.find(d => d.key === key);

export const getProposalEventTextByKey = key => proposalEvent.find(d => d.key === key).text;
