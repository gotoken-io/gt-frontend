import request from '@/utils/request';

export async function queryUploadConfig() {
  return request('/server/upload/config/');
}
