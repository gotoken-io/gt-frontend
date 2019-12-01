import { queryCurrent, queryUsers, queryUserDetail, updateUserAvatar } from '@/services/user';
import { setCurrentUser } from '@/utils/user';
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
  },
  reducers: {
    saveCurrentUser(state, action) {
      setCurrentUser(action.payload);
      return { ...state, currentUser: action.payload || {} };
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
