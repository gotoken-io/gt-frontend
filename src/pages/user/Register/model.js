import { register } from './service';
import { routerRedux } from 'dva/router';
import { getPageQuery, setAuthorization } from '@/pages/user/Login/utils';

const Model = {
  namespace: 'userRegister',
  state: {
    status: undefined,
  },
  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(register, payload);
      if (response.status === 'success') {
        yield put({
          type: 'registerHandle',
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
  },
  reducers: {
    registerHandle(state, { payload }) {
      setAuthorization(payload.Authorization);
      return { ...state, status: payload.status };
    },
  },
};
export default Model;
