import { isEmpty } from './utils';
import { formatMessage } from 'umi-plugin-react/locale';

// status
export const proposalClaimStatus = [
  {
    key: 'claiming',
    value: 100,
    text: formatMessage({ id: 'proposal.claim_status.claiming' }),
    color: 'orange',
  },
  {
    key: 'passed',
    value: 200,
    text: formatMessage({ id: 'proposal.claim_status.passed' }),
    color: 'green',
  },
  {
    key: 'fail',
    value: 300,
    text: formatMessage({ id: 'proposal.claim_status.fail' }),
    color: 'red',
  },
  {
    key: 'cancel',
    value: 400,
    text: formatMessage({ id: 'proposal.claim_status.cancel' }),
    color: 'lime',
  },
  {
    key: 'submit_result',
    value: 500,
    text: formatMessage({ id: 'proposal.claim_status.submit_result' }),
    color: 'lime',
  },
  {
    key: 'result_approve',
    value: 600,
    text: formatMessage({ id: 'proposal.claim_status.result_approve' }),
    color: 'green',
  },
  {
    key: 'result_fail',
    value: 700,
    text: formatMessage({ id: 'proposal.claim_status.result_fail' }),
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
