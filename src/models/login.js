import { routerRedux } from 'dva/router';
import { stringify } from 'querystring';
import { logout, login, register, loginWithAddress, getAddressNonce } from '@/services/login';
import { setAuthority, removeAuthority } from '@/utils/authority';
import { removeCurrentUser } from '@/utils/user';
import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';

const md5 = require('md5');
const myWeb3 = global.web3;
const Model = {
  namespace: 'login',
  state: {
    // status: undefined,
  },
  effects: {
    *register({ payload }, { call, put }) {
      const response = yield call(register, payload);
      const { status } = response;

      if (status === 'success') {
        message.success('注册成功');

        yield put({
          type: 'setLoginStatus',
          payload: { ...response, noExpire: true },
        });

        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }

        yield put(routerRedux.replace(redirect || '/'));
      } else if (status === 409) {
        message.error('注册邮箱或用户名已经存在，请直接登陆');
      }
    },

    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      const { status } = response;
      if (status === 401) {
        message.error('邮箱或密码错误！');
        return;
      }
      if (status !== 'success') {
        message.error('内部服务器错误');
        return;
      }
      message.success('登陆成功');
      yield put({
        type: 'setLoginStatus',
        payload: { ...response, noExpire: payload.remember }, // 默认保存账号
      });

      const urlParams = new URL(window.location.href);
      const params = getPageQuery();
      let { redirect } = params;

      if (redirect) {
        const redirectUrlParams = new URL(redirect);

        if (redirectUrlParams.origin !== urlParams.origin) {
          window.location.href = redirect;
          return;
        }

        redirect = redirect.substr(urlParams.origin.length);
        if (redirect.match(/^\/.*#/)) {
          redirect = redirect.substr(redirect.indexOf('#') + 1);
        }
      }
      yield put(routerRedux.replace(redirect || '/'));
    },

    *loginWithAddress({ payload }, { call, put }) {
      const nonceResponse = yield call(getAddressNonce, { address: payload.address });
      if (nonceResponse.status === 404) {
        message.error('找不到地址！');
        return;
      }

      if (nonceResponse.status !== 'success') {
        message.error('服务器出问题');
        return;
      }

      var original_message = nonceResponse.nonce;
      var message_hash = web3.sha3(
        '\u0019Ethereum Signed Message:\n' + original_message.length.toString() + original_message,
      );
      console.log('KECCAC', original_message);
      const signature = yield new Promise(resolve =>
        myWeb3.personal.sign(original_message, window.ethereum.selectedAddress, (_, result) =>
          resolve(result),
        ),
      );
      if (!signature) {
        message.info('操作已取消');
        return;
      }
      const response = yield call(loginWithAddress, {
        address: payload.address,
        signature,
      });
      const { status } = response;

      if (status !== 'success') {
        message.error('内部服务器错误');
        return;
      }
      message.success('登陆成功');
      console.log(response);

      yield put({
        type: 'setLoginStatus',
        payload: { ...response, noExpire: payload.remember }, // 默认保存账号
      });
      // Login successfully
      if (status === 404) {
        message.error('找不到地址！');
        return;
      }

      if (status === 401) {
        message.error('找不到地址！');
        return;
      }
      const urlParams = new URL(window.location.href);
      const params = getPageQuery();
      let { redirect } = params;

      if (redirect) {
        const redirectUrlParams = new URL(redirect);

        if (redirectUrlParams.origin !== urlParams.origin) {
          window.location.href = redirect;
          return;
        }

        redirect = redirect.substr(urlParams.origin.length);
        if (redirect.match(/^\/.*#/)) {
          redirect = redirect.substr(redirect.indexOf('#') + 1);
        }
      }

      yield put(routerRedux.replace(redirect || '/'));
    },

    *logout({ payload }, { call, put }) {
      const response = yield call(logout, payload);
      yield put({
        type: 'removeLoginStatus',
      }); // Logout successfully

      if (response.status === 'success') {
        message.success('注销登陆');

        const { redirect } = getPageQuery(); // redirect

        if (window.location.pathname !== '/login' && !redirect) {
          yield put(
            routerRedux.replace({
              pathname: '/login',
              search: stringify({
                redirect: window.location.href,
              }),
            }),
          );
        }
      }
    },
  },
  reducers: {
    setLoginStatus(state, { payload }) {
      console.log('LoginStatus', payload);
      setAuthority(payload.Authorization, payload.noExpire);
      return state;
    },
    removeLoginStatus(state) {
      removeAuthority();
      removeCurrentUser();

      return { ...state, currentUser: {} };
    },
  },
};
export default Model;
