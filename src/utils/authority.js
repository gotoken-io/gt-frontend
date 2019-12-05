import { reloadAuthorized } from './Authorized'; // use localStorage to store the authority info, which might be sent from server in actual project.

export function getAuthority() {
  let Authorization;
  if (sessionStorage.getItem('Authorization')) {
    Authorization = sessionStorage.getItem('Authorization');
  } else if (localStorage.getItem('Authorization')) {
    Authorization = localStorage.getItem('Authorization');
  }

  return Authorization;
}

export function setAuthority(Authorization, noExpire) {
  if (noExpire) {
    localStorage.setItem('Authorization', Authorization);
  } else {
    console.log('session');
    sessionStorage.setItem('Authorization', Authorization);
  }
  reloadAuthorized(); // auto reload
}

export function removeAuthority() {
  localStorage.removeItem('Authorization');
}
