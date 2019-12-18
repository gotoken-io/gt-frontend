import request from '@/utils/request';
import { getAuthority } from '@/utils/authority';

export async function createProposal(params) {
  return request('/server/proposal/', {
    method: 'POST',
    headers: {
      Authorization: getAuthority(),
    },
    data: params,
  });
}

export async function updateProposal(params) {
  return request(`/server/proposal/${params.id}`, {
    method: 'PUT',
    headers: {
      Authorization: getAuthority(),
    },
    data: params,
  });
}

// only admin can delete proposal
export async function deleteProposal(params) {
  return request(`/server/proposal/${params.id}`, {
    method: 'DELETE',
    headers: {
      Authorization: getAuthority(),
    },
  });
}

// only admin can delete proposal zone
export async function deleteProposalZone(params) {
  return request(`/server/proposal_zone/${params.id}`, {
    method: 'DELETE',
    headers: {
      Authorization: getAuthority(),
    },
  });
}

// only admin can create proposal zone
export async function createProposalZone(params) {
  return request('/server/proposal_zone/', {
    method: 'POST',
    headers: {
      Authorization: getAuthority(),
    },
    data: params,
  });
}

// only admin can update proposal zone
export async function updateProposalZone(params) {
  return request(`/server/proposal_zone/${params.id}`, {
    method: 'PUT',
    headers: {
      Authorization: getAuthority(),
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
