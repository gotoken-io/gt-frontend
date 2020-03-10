import request from '@/utils/request';
import { getAuthority } from '@/utils/authority';

export async function login(params) {
  return request('/server/auth/login', {
    method: 'POST',
    data: params,
  });
}
export async function loginWithAddress(params) {
  return request('/server/auth/address', {
    method: 'POST',
    data: params,
  });
}

export async function getAddressNonce(params) {
  return request(`/server/auth/address?address=${params.address}`, {
    method: 'GET',
    headers: {
      ContentType: 'application/json',
    },
  });
}

export async function logout() {
  return request('/server/auth/logout', {
    method: 'POST',
    headers: {
      Authorization: getAuthority(),
    },
  });
}

export async function register(params) {
  return request('/server/user/', {
    method: 'POST',
    data: params,
  });
}
