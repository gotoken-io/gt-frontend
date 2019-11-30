import { postComment, putComment } from '@/services/comment';

const Model = {
  namespace: 'comment',
  state: {},
  effects: {
    *createComment({ payload }, { call, put }) {
      const response = yield call(postComment, payload);
      if (response.status === 'success') {
        yield put({
          type: 'saveComment',
          payload,
        });
      }
    },
    *updateComment({ payload }, { call, put }) {
      const response = yield call(putComment, payload);
      if (response.status === 'success') {
        yield put({
          type: 'updateComment',
          payload,
        });
      }
    },
  },
  reducers: {
    saveComment(state, action) {
      return {
        ...state,
        detail: { ...state.detail, comments: [...state.detail.comments, action.payload] },
      };
    },

    updateComment(state, action) {
      return {
        ...state,
        detail: { ...state.detail, comments: [...state.detail.comments, action.payload] },
      };
    },
  },
};
export default Model;
