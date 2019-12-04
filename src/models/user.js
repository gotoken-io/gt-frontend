import {
  queryCurrent,
  queryUsers,
  queryUserDetail,
  updateUserAvatar,
  updateUserInfo,
} from '@/services/user';
import { setCurrentUser, removeCurrentUser } from '@/utils/user';
import { setAuthority, removeAuthority } from '@/utils/authority';
import { message } from 'antd';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
    userDetail: {},
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

      if (response.status === 'success') {
        yield put({
          type: 'saveCurrentUser',
          payload: response.data,
        });
      } else {
        yield put({
          type: 'removeCurrentUser',
        });
      }
    },

    *fetchUserDetail({ payload }, { call, put }) {
      const response = yield call(queryUserDetail, payload);
      yield put({
        type: 'saveUserDetail',
        payload: response.data,
      });
    },

    *postUserAvatar({ payload }, { call, put }) {
      const response = yield call(updateUserAvatar, payload);
      if (response.status === 'success') {
        message.success('用户头像更新成功');
        yield put({
          type: 'changeUserAvatar',
          payload,
        });
      }
    },

    *postUserInfo({ payload }, { call, put }) {
      const response = yield call(updateUserInfo, payload);
      if (response.status === 'success') {
        message.success('更新个人信息成功');

        yield put({
          type: 'saveCurrentUser',
          payload,
        });
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

    changeUserAvatar(state, action) {
      const newCurrentUserDetail = { ...state.currentUser, avatar: action.payload };
      setCurrentUser(newCurrentUserDetail);
      return { ...state, currentUser: newCurrentUserDetail };
    },

    saveUserDetail(state, action) {
      return { ...state, userDetail: action.payload || {} };
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
