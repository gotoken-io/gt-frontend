import { parse } from 'querystring';
import { message } from 'antd';
import pathRegexp from 'path-to-regexp';
import router from 'umi/router';
import { formatMessage } from 'umi-plugin-react/locale';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = path => reg.test(path);
export const isAntDesignPro = () => window.location.hostname === 'preview.pro.ant.design'; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

export const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};
export const getPageQuery = () => parse(window.location.href.split('?')[1]);

export const getPageHash = () => window.location.hash.split('#')[1];

/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */

export const getAuthorityFromRouter = (router = [], pathname) => {
  const authority = router.find(({ path }) => path && pathRegexp(path).exec(pathname));
  if (authority) return authority;
  return undefined;
};

export const isEmpty = obj => {
  if (!obj) {
    return true;
  }
  return !Object.keys(obj).length;
};

export const isJSON = str => {
  if (typeof str === 'string') {
    try {
      const obj = JSON.parse(str);
      if (typeof obj === 'object' && obj) {
        return true;
      }
      return false;
    } catch (e) {
      // console.log(`error：${str}!!!${e}`);
      return false;
    }
  }

  return false;
};

// conver hours to days and hours
export const converHoursToDayAndHour = hours => ({
  day: Math.floor(hours / 24),
  hour: Math.floor(hours) % 24,
});

export const convertToDayHourText = obj =>
  formatMessage(
    { id: 'app.dayAndHour' },
    {
      day: obj.day,
      hour: obj.hour,
    },
  );

export const converHoursToDayHourText = hours => {
  const obj = converHoursToDayAndHour(hours);
  return convertToDayHourText(obj);
};

export function showMsgGoBack(text = '提交成功') {
  message.success(text).then(() => {
    router.go(-1); // 回到上一页
  });
}

export function showMsgReload(text = '提交成功') {
  message.success(text).then(() => {
    window.location.reload();
  });
}

export function deleteUndefined(list) {
  Object.keys(list)
    .filter(key => list[key] === undefined)
    .forEach(key => delete list[key]);
}

export const toQueryString = d => {
  return Object.keys(d)
    .sort()
    .map(k => `${k}=${d[k]}`)
    .join('&');
};
