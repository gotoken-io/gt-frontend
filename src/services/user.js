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

export async function updateUserAvatar(params) {
  return request('/server/user/avatar', {
    method: 'POST',
    headers: {
      Authorization: localStorage.getItem('Authorization'),
    },
    data: params,
  });
}

export async function updateUserInfo(params) {
  return request('/server/user/info', {
    method: 'POST',
    headers: {
      Authorization: localStorage.getItem('Authorization'),
    },
    data: params,
  });
}

export async function queryUserDetail({ id }) {
  return request(`/server/user/${id}`);
}
