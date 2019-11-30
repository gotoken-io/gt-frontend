import request from '@/utils/request';

export async function postComment(params) {
  return request('/server/comment/', {
    method: 'POST',
    headers: {
      Authorization: localStorage.getItem('Authorization'),
    },
    data: params,
  });
}

export async function putComment(params) {
  return request('/server/comment/', {
    method: 'PUT',
    headers: {
      Authorization: localStorage.getItem('Authorization'),
    },
    data: params,
  });
}
