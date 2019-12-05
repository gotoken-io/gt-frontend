import request from '@/utils/request';
import { getAuthority } from '@/utils/authority';

export async function queryUsers() {
  return request('/server/user/', {
    headers: {
      Authorization: getAuthority(),
    },
  });
}
export async function queryCurrent() {
  return request('/server/auth/login', {
    headers: {
      Authorization: getAuthority(),
    },
  });
}

export async function updateUserAvatar(params) {
  return request('/server/user/avatar', {
    method: 'POST',
    headers: {
      Authorization: getAuthority(),
    },
    data: params,
  });
}

export async function updateUserInfo(params) {
  return request('/server/user/info', {
    method: 'POST',
    headers: {
      Authorization: getAuthority(),
    },
    data: params,
  });
}

export async function queryUserDetail({ id }) {
  return request(`/server/user/${id}`);
}
