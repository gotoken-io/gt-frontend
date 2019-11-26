import request from '@/utils/request';

export async function login(params) {
  return request('/server/auth/login', {
    method: 'POST',
    data: params,
  });
}

export async function logout() {
  return request('/server/auth/logout', {
    method: 'POST',
    headers: {
      Authorization: localStorage.getItem('Authorization'),
    },
  });
}
