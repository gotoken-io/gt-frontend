import request from '@/utils/request';

export async function login(params) {
  return request('/server/auth/login', {
    method: 'POST',
    data: params,
  });
}
