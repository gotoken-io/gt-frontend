export function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser'));
}

export function setCurrentUser(currentUser) {
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

export function removeCurrentUser() {
  localStorage.removeItem('currentUser');
}

export function getFielUrl(filename) {
  const bucketBaseUrl = 'http://q1tvwz2mb.bkt.clouddn.com/';
  return bucketBaseUrl + filename;
}
