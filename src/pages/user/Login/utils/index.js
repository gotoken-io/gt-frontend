import { parse } from 'qs';

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}
export function setAuthorization(token) {
  localStorage.setItem('Authorization', token);
}
