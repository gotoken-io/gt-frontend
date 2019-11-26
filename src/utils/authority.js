import { reloadAuthorized } from './Authorized'; // use localStorage to store the authority info, which might be sent from server in actual project.

export function getAuthority() {
  return localStorage.getItem('Authorization');
}

export function setAuthority(Authorization) {
  localStorage.setItem('Authorization', Authorization); // auto reload
  reloadAuthorized();
}

export function removeAuthority() {
  localStorage.removeItem('Authorization');
}
