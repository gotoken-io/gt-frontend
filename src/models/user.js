import { queryCurrent, queryUsers, queryUserDetail } from '@/services/user';
import { setCurrentUser } from '@/utils/user';

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
  },
  reducers: {
    saveCurrentUser(state, action) {
      setCurrentUser(action.payload);
      return { ...state, currentUser: action.payload || {} };
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
