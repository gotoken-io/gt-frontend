import request from '@/utils/request';

export async function register(params) {
  return request('/server/user/', {
    method: 'POST',
    data: params,
  });
}
