import {
  queryCurrent,
  queryUsers,
  queryUserDetail,
  updateUserAvatar,
  updateUserInfo,
  postForgetPwd,
  postResetPwd,
} from '@/services/user';
import { routerRedux } from 'dva/router';
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

    *postForgetPwd({ payload }, { call, put }) {
      const response = yield call(postForgetPwd, payload);
      if (response.status === 'success') {
        message.success(`已发送邮件到${payload.email}, 请注意查收`);
      }

      if (response.status === 'fail') {
        if (response.code === 404) {
          message.error(`${payload.email} 不存在, 请再次确认`);
        }
      }
    },

    *postResetPwd({ payload }, { call, put }) {
      const response = yield call(postResetPwd, payload);
      if (response.status === 'success') {
        message.success('密码重置成功，请重新登陆');

        yield put(
          routerRedux.replace({
            pathname: '/login',
          }),
        );
      }

      if (response.status === 'fail') {
        if (response.message === 'SignatureExpired') {
          message.error('重置链接过期，请重新发送');
        } else if (response.message === 'DoubleCheckError') {
          message.error(`${payload.email} 错误, 请再次确认邮箱`);
        } else {
          message.error('密码重置失败');
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
