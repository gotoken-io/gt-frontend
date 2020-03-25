import { isEmpty } from './utils';

// status
export const proposalClaimStatus = [
  {
    key: 'claiming',
    value: 100,
    text: '申领中',
    color: 'orange',
  },
  {
    key: 'passed',
    value: 200,
    text: '申领通过',
    color: 'green',
  },
  {
    key: 'fail',
    value: 300,
    text: '申领不通过',
    color: 'red',
  },
  {
    key: 'cancel',
    value: 400,
    text: '撤销申领',
    color: 'lime',
  },
  {
    key: 'submit_result',
    value: 500,
    text: '结果已提交',
    color: 'lime',
  },
  {
    key: 'result_approve',
    value: 600,
    text: '结果审核通过',
    color: 'green',
  },
  {
    key: 'result_fail',
    value: 700,
    text: '结果审核不通过',
    color: 'red',
  },
];

export const getClaimStatusByKey = key => proposalClaimStatus.find(d => d.key === key);

export const isClaimer = (claims, currentUser) => {
  if (isEmpty(currentUser)) {
    return undefined;
  }

  return claims.some(d => d.claimer.id === currentUser.id.toString());
};

export const isClaimerByStatus = (claims, currentUser, status_keys = ['claiming']) => {
  if (isEmpty(currentUser)) {
    return undefined;
  }

  return claims.some(d => isClaimer(claims, currentUser) && status_keys.includes(d.status_key));
};
