import { isEmpty } from './utils';

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
