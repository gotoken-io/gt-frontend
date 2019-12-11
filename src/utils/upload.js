import { message } from 'antd';

export function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('只支持上传 JPG/PNG 文件!');
  }
  const isLt2M = file.size / 1024 / 1024 < 0.512;
  if (!isLt2M) {
    message.error('文件大小不能超过 512KB!');
  }
  return isJpgOrPng && isLt2M;
}

export function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

export function getFielUrl(filename) {
  const bucketBaseUrl = 'http://q27c8thto.bkt.clouddn.com/';
  return bucketBaseUrl + filename;
}
