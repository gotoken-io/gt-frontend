import request from '@/utils/request';
import { getAuthority } from '@/utils/authority';

export async function postComment(params) {
  return request('/server/comment/', {
    method: 'POST',
    headers: {
      Authorization: getAuthority(),
    },
    data: params,
  });
}

export async function putComment(params) {
  return request('/server/comment/', {
    method: 'PUT',
    headers: {
      Authorization: getAuthority(),
    },
    data: params,
  });
}

// id=proposal id
export async function queryProposalComment({ id }) {
  return request(`/server/proposal/comment/${id}`);
}
