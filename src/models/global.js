// import { queryNotices } from '@/services/user';
import { queryUploadConfig } from '@/services/upload';
import { setUploadConfig } from '@/utils/upload';
// import { message } from 'antd';

const GlobalModel = {
  namespace: 'global',
  state: {
    collapsed: false,
    uploadConfig: {},
  },
  effects: {
    *queryUploadConfig(_, { call, put }) {
      const resp = yield call(queryUploadConfig);

      if (resp.status === 'success') {
        yield put({
          type: 'saveUploadConfig',
          payload: resp.data,
        });
      }
    },
    // *clearNotices({ payload }, { put, select }) {
    //   yield put({
    //     type: 'saveClearedNotices',
    //     payload,
    //   });
    //   const count = yield select(state => state.global.notices.length);
    //   const unreadCount = yield select(
    //     state => state.global.notices.filter(item => !item.read).length,
    //   );
    //   yield put({
    //     type: 'user/changeNotifyCount',
    //     payload: {
    //       totalCount: count,
    //       unreadCount,
    //     },
    //   });
    // },
    // *changeNoticeReadState({ payload }, { put, select }) {
    //   const notices = yield select(state =>
    //     state.global.notices.map(item => {
    //       const notice = { ...item };
    //       if (notice.id === payload) {
    //         notice.read = true;
    //       }
    //       return notice;
    //     }),
    //   );
    //   yield put({
    //     type: 'saveNotices',
    //     payload: notices,
    //   });
    //   yield put({
    //     type: 'user/changeNotifyCount',
    //     payload: {
    //       totalCount: notices.length,
    //       unreadCount: notices.filter(item => !item.read).length,
    //     },
    //   });
    // },
  },
  reducers: {
    saveUploadConfig(state, { payload }) {
      setUploadConfig(payload);
      return { ...state, uploadConfig: payload };
    },
    changeLayoutCollapsed(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return { ...state, collapsed: payload };
    },

    // saveNotices(state, { payload }) {
    //   return {
    //     collapsed: false,
    //     ...state,
    //     notices: payload,
    //   };
    // },

    // saveClearedNotices(
    //   state = {
    //     notices: [],
    //     collapsed: true,
    //   },
    //   { payload },
    // ) {
    //   return {
    //     collapsed: false,
    //     ...state,
    //     notices: state.notices.filter(item => item.type !== payload),
    //   };
    // },
  },
  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
export default GlobalModel;
