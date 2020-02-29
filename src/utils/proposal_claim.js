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
  let isClaimer;
  if (!isEmpty(currentUser)) {
    isClaimer = claims.find(d => {
      let findItem;
      if (d.claimer.id === currentUser.id.toString()) {
        findItem = d;
      }
      return findItem;
    });
  } else {
    return undefined;
  }

  if (isClaimer) {
    return true;
  }
  return false;
};

export const isClaimerByStatus = (claims, currentUser, status_keys = ['claiming']) => {
  let isClaimerStatus;
  if (!isEmpty(currentUser)) {
    isClaimerStatus = claims.find(d => {
      let findItem;
      if (d.claimer.id === currentUser.id.toString()) {
        status_keys.forEach(s_key => {
          if (d.status_key === s_key) {
            findItem = d;
          }
        });
      }
      return findItem;
    });
  } else {
    return undefined;
  }

  if (isClaimerStatus) {
    return true;
  }
  return false;
};
