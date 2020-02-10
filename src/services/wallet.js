import request from '@/utils/request';
import { getAuthority } from '@/utils/authority';

const userWalletUrl = '/server/user/wallet';

export async function queryUserWallet() {
  return request(userWalletUrl, {
    headers: {
      Authorization: getAuthority(),
    },
  });
}

export async function addUserWallet(params) {
  return request(userWalletUrl, {
    method: 'POST',
    headers: {
      Authorization: getAuthority(),
    },
    data: params,
  });
}

export async function updateUserWallet(params) {
  return request(userWalletUrl, {
    method: 'PUT',
    headers: {
      Authorization: getAuthority(),
    },
    data: params,
  });
}
