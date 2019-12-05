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

export async function updateProposal(params) {
  return request('/server/proposal/', {
    method: 'PUT',
    headers: {
      Authorization: localStorage.getItem('Authorization'),
    },
    data: params,
  });
}

// only admin can create proposal zone
export async function createProposalZone(params) {
  return request('/server/proposal_zone/', {
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

export async function queryProposalListByZoneID({ id }) {
  return request('/server/proposal/?zone_id=' + id);
}

export async function queryProposalZoneList() {
  return request('/server/proposal_zone/');
}

export async function queryProposalZone({ id }) {
  return request(`/server/proposal_zone/${id}`);
}

export async function queryCurrencylList() {
  return request('/server/currency/');
}
