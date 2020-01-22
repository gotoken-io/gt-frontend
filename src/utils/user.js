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
  console.log('currentUser', currentUser);
  console.log('creator', creator);

  if (currentUser && currentUser.admin === true) {
    return true;
  }

  if (
    creator &&
    Object.keys(currentUser).length !== 0 &&
    creator.id.toString() === currentUser.id.toString() &&
    currentUser.id.toString()
  ) {
    return true;
  }

  return false;
}

export function isAdmin({ currentUser }) {
  if (currentUser && currentUser.admin === true) {
    return true;
  }
  return false;
}
