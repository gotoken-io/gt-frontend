import request from '@/utils/request';
import { getAuthority } from '@/utils/authority';

/*
 * Proposal Category
 */
export async function queryCategory() {
  return request('/server/proposal/category');
}

// only admin can create, update, delete proposal category
export async function createCategory(params) {
  return request('/server/proposal/category', {
    method: 'POST',
    headers: {
      Authorization: getAuthority(),
    },
    data: params,
  });
}

export async function updateCategory(params) {
  return request('/server/proposal/category', {
    method: 'PUT',
    headers: {
      Authorization: getAuthority(),
    },
    data: params,
  });
}

export async function deleteCategory(params) {
  return request('/server/proposal/category', {
    method: 'DELETE',
    headers: {
      Authorization: getAuthority(),
    },
    data: params,
  });
}

/**
 * Proposal
 */
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

// only admin can update proposal status
export async function updateProposalStatus(params) {
  return request(`/server/proposal/${params.id}/status`, {
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

export async function queryProposal({ id }) {
  return request(`/server/proposal/${id}`);
}

export async function queryProposalList({ page, zone_id, c, status, sort_by, sort_name }) {
  return request('/server/proposal/', {
    params: {
      page,
      zone_id,
      category_id: c,
      status_key: status,
      sort_by,
      sort_name,
    },
  });
}

/**
 * Proposal zone
 */

export async function queryProposalZoneList() {
  return request('/server/proposal_zone/');
}

export async function queryProposalZone({ id }) {
  return request(`/server/proposal_zone/${id}`);
}

export async function queryCurrencylList() {
  return request('/server/currency/');
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

/* Proposal Logs */
export async function queryProposalLogs({ id }) {
  return request(`/server/proposal/${id}/log`);
}

export async function updateProposalProgress(params) {
  console.log(params);
  return request(`/server/proposal/${params.id}/progress`, {
    method: 'POST',
    headers: {
      Authorization: getAuthority(),
    },
    data: params,
  });
}

/* Proposal Claims */
export async function queryProposalClaims({ id }) {
  console.log(`/server/proposal_claim/proposal/${id}`);
  return request(`/server/proposal_claim/proposal/${id}`);
}

export async function claimProposal(params) {
  console.log(params);
  return request('/server/proposal_claim/', {
    method: 'POST',
    headers: {
      Authorization: getAuthority(),
    },
    data: params,
  });
}

export async function cancelClaimProposal(params) {
  console.log(params);
  return request('/server/proposal_claim/', {
    method: 'PUT',
    headers: {
      Authorization: getAuthority(),
    },
    data: params,
  });
}

export async function verifyProposalClaim(params) {
  console.log(params);
  return request('/server/proposal_claim/verify', {
    method: 'PUT',
    headers: {
      Authorization: getAuthority(),
    },
    data: params,
  });
}

export async function queryUserProposalClaims({ username, page }) {
  return request(`/server/proposal_claim/user/${username}`, {
    params: {
      page,
    },
  });
}

export async function submitProposalClaimResult(params) {
  console.log(params);
  return request('/server/proposal_claim/result', {
    method: 'POST',
    headers: {
      Authorization: getAuthority(),
    },
    data: params,
  });
}

export async function verifyProposalClaimResult(params) {
  console.log(params);
  return request('/server/proposal_claim/verify/result', {
    method: 'PUT',
    headers: {
      Authorization: getAuthority(),
    },
    data: params,
  });
}
