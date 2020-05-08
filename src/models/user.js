import {
  queryCurrent,
  queryUsers,
  queryUserDetail,
  queryUserProposals,
  updateUserAvatar,
  updateUserInfo,
  postForgetPwd,
  postResetPwd,
} from '@/services/user';

import { queryUserProposalClaims } from '@/services/proposal';

import { queryUserWallet, addUserWallet, updateUserWallet } from '@/services/wallet';

import { routerRedux } from 'dva/router';
import { setCurrentUser, removeCurrentUser } from '@/utils/user';
import { setAuthority, removeAuthority } from '@/utils/authority';
import { message } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
    userDetail: {},
    proposals: {
      created: {
        items: [],
        page: 1,
        pages: 1,
        per_page: 20,
        total: 1,
      },
    },
    proposal_claims: {
      items: [],
      page: 1,
      pages: 1,
      per_page: 20,
      total: 1,
    },
    wallet: [],
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);

      if (response.status !== 'success') {
        yield put({
          type: 'removeCurrentUser',
        });
        return;
      }

      yield put({
        type: 'saveCurrentUser',
        payload: response.data,
      });

      const walletResponse = yield call(queryUserWallet, _);
      if (walletResponse.data) {
        yield put({
          type: 'saveUserWallet',
          payload: walletResponse.data,
        });
      }
    },

    *fetchUserDetail({ payload }, { call, put }) {
      // 先置空，否则会把上一个用户的信息带过来
      yield put({
        type: 'saveUserDetail',
        payload: {},
      });

      const response = yield call(queryUserDetail, payload);
      if (response.data) {
        yield put({
          type: 'saveUserDetail',
          payload: response.data,
        });
      }
    },

    *fetchUserProposals({ payload }, { call, put }) {
      // 先置空，否则会把上一个用户的信息带过来
      // yield put({
      //   type: 'saveUserProposals',
      //   payload: {},
      // });

      const response = yield call(queryUserProposals, payload);
      if (response.data) {
        yield put({
          type: 'saveUserProposals',
          payload: { ...payload, data: response.data },
        });
      }
    },

    *queryUserProposalClaims({ payload }, { call, put }) {
      const response = yield call(queryUserProposalClaims, payload);
      if (response.data) {
        yield put({
          type: 'saveUserProposalClaims',
          payload: response.data,
        });
      }
    },

    *fetchCurrentUserWallet({ _ }, { call, put }) {
      const response = yield call(queryUserWallet, _);
      if (response.data) {
        yield put({
          type: 'saveUserWallet',
          payload: response.data,
        });
      }
    },

    *addUserWallet({ payload }, { call, put }) {
      const response = yield call(addUserWallet, payload);
      if (response.status === 'success') {
        message.success(formatMessage({ id: 'user.wallet.success' }));
        window.location.reload();
      }
    },

    *updateUserWallet({ payload }, { call, put }) {
      const response = yield call(updateUserWallet, payload);
      if (response.status === 'success') {
        message.success(formatMessage({ id: 'user.wallet.success' }));
        window.location.reload();
      }
    },

    *postUserAvatar({ payload }, { call, put }) {
      const response = yield call(updateUserAvatar, payload);
      if (response.status === 'success') {
        message.success(formatMessage({ id: 'user.avatar.success' }));
        window.location.reload();
        // yield put({
        //   type: 'changeUserAvatar',
        //   payload,
        // });
      }
    },

    *postUserInfo({ payload }, { call, put }) {
      const response = yield call(updateUserInfo, payload);
      if (response.status === 'success') {
        message.success(formatMessage({ id: 'user.update.success' }));

        yield put({
          type: 'saveCurrentUser',
          payload,
        });
      }
    },

    *postForgetPwd({ payload }, { call, put }) {
      const response = yield call(postForgetPwd, payload);
      if (response.status === 'success') {
        message.success(
          formatMessage({ id: 'user.password_forgotten.success' }, { email: payload.email }),
        );
        return true;
      }

      if (response.status === 'fail') {
        if (response.code === 404) {
          message.error(
            formatMessage({ id: 'user.password_forgotten.fail' }, { email: payload.email }),
          );
        }
      }

      return false;
    },

    *postResetPwd({ payload }, { call, put }) {
      const response = yield call(postResetPwd, payload);
      if (response.status === 'success') {
        message.success(formatMessage({ id: 'user.password_reset.success' }));
        yield put(
          routerRedux.replace({
            pathname: '/login',
          }),
        );
      }

      if (response.status === 'fail') {
        if (response.message === 'SignatureExpired') {
          message.error(formatMessage({ id: 'user.password_reset.expired' }));
        } else if (response.message === 'DoubleCheckError') {
          message.error(
            formatMessage({ id: 'user.password_reset.check_error' }, { email: payload.email }),
          );
        } else {
          message.error(formatMessage({ id: 'user.password_reset.fail' }));
        }
      }
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      setCurrentUser(action.payload);
      return { ...state, currentUser: { ...state.currentUser, ...action.payload } || {} };
    },

    removeCurrentUser(state) {
      removeCurrentUser();
      removeAuthority();
      return { ...state, currentUser: {} };
    },

    saveUserWallet(state, action) {
      return { ...state, wallet: action.payload || [] };
    },

    changeUserAvatar(state, action) {
      const newCurrentUserDetail = { ...state.currentUser, avatar: action.payload };
      setCurrentUser(newCurrentUserDetail);
      return { ...state, currentUser: newCurrentUserDetail };
    },

    saveUserDetail(state, action) {
      return { ...state, userDetail: action.payload || {} };
    },

    saveUserProposals(state, action) {
      const { data, p_type } = action.payload;
      if (p_type === 'created') {
        return { ...state, proposals: { created: data } };
      }

      return state;
    },

    saveUserProposalClaims(state, action) {
      return { ...state, proposal_claims: action.payload };
    },

    // changeNotifyCount(
    //   state = {
    //     currentUser: {},
    //   },
    //   action,
    // ) {
    //   return {
    //     ...state,
    //     currentUser: {
    //       ...state.currentUser,
    //       notifyCount: action.payload.totalCount,
    //       unreadCount: action.payload.unreadCount,
    //     },
    //   };
    // },
  },
};
export default UserModel;
