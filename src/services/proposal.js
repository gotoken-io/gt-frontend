import request from '@/utils/request';

export async function createProposal(params) {
  return request('/server/proposal/', {
    method: 'POST',
    headers: {
      Authorization: localStorage.getItem('Authorization'),
    },
    data: params,
  });
}

export async function queryProposal({ id }) {
  return request(`/server/proposal/${id}`);
}

export async function queryProposalList() {
  return request('/server/proposal/');
}

export async function queryProposalZoneList() {
  return request('/server/proposal_zone/');
}

export async function queryCurrencylList() {
  return request('/server/currency/');
}
