import { isEmpty } from './utils';

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser'));
}

export function setCurrentUser(currentUser) {
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

export function removeCurrentUser() {
  localStorage.removeItem('currentUser');
}

export function isCreatorOrAdmin({ currentUser, creator }) {
  if (!isEmpty(currentUser) && currentUser.admin === true) {
    return true;
  }

  if (
    !isEmpty(creator) &&
    !isEmpty(currentUser) &&
    creator.id.toString() === currentUser.id.toString() &&
    currentUser.id.toString()
  ) {
    return true;
  }

  return false;
}

export function isAdmin({ currentUser }) {
  if (!isEmpty(currentUser) && currentUser.admin === true) {
    return true;
  }
  return false;
}
