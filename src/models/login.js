import { routerRedux } from 'dva/router';
import { stringify } from 'querystring';
import { logout, login, register } from '@/services/login';
import { setAuthority, removeAuthority } from '@/utils/authority';
import { removeCurrentUser } from '@/utils/user';
import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *register({ payload }, { call, put }) {
      const response = yield call(register, payload);
      if (response.status === 'success') {
        message.success('注册成功');

        yield put({
          type: 'setLoginStatus',
          payload: response,
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
      }
    },

    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      if (response.status === 'success') {
        message.success('登陆成功');

        yield put({
          type: 'setLoginStatus',
          payload: response,
        }); // Login successfully

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
      }
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
      setAuthority(payload.Authorization);
      return { ...state, status: payload.status, token: payload.Authorization };
    },
    removeLoginStatus(state) {
      removeAuthority();
      removeCurrentUser();

      return { ...state, currentUser: {} };
    },
  },
};
export default Model;
