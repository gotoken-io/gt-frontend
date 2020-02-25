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
];

export const getClaimStatusByKey = key => proposalClaimStatus.find(d => d.key === key);

export const isClaimer = (claims, currentUser) => {
  let claimer;
  if (!isEmpty(currentUser)) {
    claimer = claims.find(
      d => d.claimer.id === currentUser.id.toString() && d.status_key === 'claiming',
    );
  } else {
    return undefined;
  }

  if (claimer) {
    return true;
  }
  return false;
};
