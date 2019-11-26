import request from '@/utils/request';

export async function queryUsers() {
  return request('/server/user/', {
    headers: {
      Authorization: localStorage.getItem('Authorization'),
    },
  });
}
export async function queryCurrent() {
  return request('/server/auth/login', {
    headers: {
      Authorization: localStorage.getItem('Authorization'),
    },
  });
}
export async function queryNotices() {
  return request('/api/notices');
}
