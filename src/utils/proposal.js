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
