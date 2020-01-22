import { postComment, putComment, deleteComment, queryProposalComment } from '@/services/comment';
import { getCurrentUser } from '@/utils/user';
import { message } from 'antd';

const Model = {
  namespace: 'comment',
  state: {
    comment_list: [],
  },
  effects: {
    *fetchProposalComment({ payload }, { call, put }) {
      const response = yield call(queryProposalComment, payload);

      yield put({
        type: 'saveCommentList',
        payload: response.data,
      });
    },
    *createComment({ payload }, { call, put }) {
      const response = yield call(postComment, payload);
      if (response.status === 'success') {
        yield put({
          type: 'saveComment',
          payload: { ...payload, ...response.data },
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
    *deleteComment({ payload }, { call, put }) {
      const response = yield call(deleteComment, payload);
      if (response.status === 'success') {
        message.success('删除成功');
        yield put({
          type: 'saveDeleteComment',
          payload,
        });
      }
    },
  },
  reducers: {
    saveCommentList(state, action) {
      return {
        ...state,
        comment_list: [...action.payload],
      };
    },

    saveComment(state, action) {
      const creator = getCurrentUser();
      const { parent_id } = action.payload;
      const new_comment = { ...action.payload, creator };

      if (parent_id) {
        // 回复
        new_comment.parent_id = parent_id;

        const new_comment_list = state.comment_list.map(comment => {
          if (comment.id === parent_id) {
            comment.replies = [...comment.replies, new_comment];
          }
          return comment;
        });

        return {
          ...state,
          comment_list: new_comment_list,
        };
      }
      // 新的评论
      new_comment.parent_id = null;
      new_comment.replies = [];

      return {
        ...state,
        comment_list: [new_comment, ...state.comment_list],
      };
    },

    updateComment(state, action) {
      // TODO: find comment to update
      return {
        ...state,
        comment_list: [action.payload, ...state.comment_list],
      };
    },

    saveDeleteComment(state, action) {
      const { id } = action.payload;
      return {
        ...state,
        comment_list: state.comment_list.filter(item => item.id !== id),
      };
    },
  },
};
export default Model;
