import { routerRedux } from 'dva/router';
import { message } from 'antd';
import router from 'umi/router';
import {
  createProposal,
  updateProposal,
  updateProposalStatus,
  deleteProposalZone,
  deleteProposal,
  createProposalZone,
  updateProposalZone,
  queryProposalList,
  queryProposalListByZoneID,
  queryProposal,
  queryProposalZoneList,
  queryCurrencylList,
  queryProposalZone,
  queryCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  queryProposalLogs,
  updateProposalProgress,
} from '@/services/proposal';

const ProposalModel = {
  namespace: 'proposal',
  state: {
    zone_list: [],
    zone_detail: {},
    currency_ist: [],
    proposal_category: [],
    proposal_list: {
      items: [],
      page: 1,
      pages: 1,
      per_page: 20,
      total: 1,
    },
    detail: {},
    logs: [],
  },
  effects: {
    /*
     * Proposal Category
     */
    *fetchAllCategory(_, { call, put }) {
      const response = yield call(queryCategory);

      yield put({
        type: 'saveCategoryList',
        payload: response.data,
      });
      return true;
    },

    *createCategory({ payload }, { call, put }) {
      const response = yield call(createCategory, payload);
      if (response.status === 'success') {
        message.success('创建提案分类成功');
        yield put({
          type: 'createCategoryList',
          payload: response.data,
        });
      }

      if (response.status === 'fail') {
        message.error(response.message);
      }
    },

    *updateCategory({ payload }, { call, put }) {
      const response = yield call(updateProposal, payload);
      if (response.status === 'success') {
        message.success('修改提案分类成功');
        yield put({
          type: 'updateCategoryList',
          payload,
        });
      }

      if (response.status === 'fail') {
        message.error(response.message);
      }
    },

    *deleteCategory({ payload }, { call, put }) {
      const response = yield call(deleteCategory, payload);
      if (response.status === 'success') {
        message.success('删除提案分类成功');
        yield put({
          type: 'deleteCategoryList',
          payload,
        });
      }
    },

    // proposal zone
    *fetchAllProposalZone(_, { call, put }) {
      const response = yield call(queryProposalZoneList);
      yield put({
        type: 'saveProposalZoneList',
        payload: response.data,
      });
    },

    // proposal
    *fetchAllProposal({ payload }, { call, put }) {
      // let response;

      // if (payload.id) {
      //   response = yield call(queryProposalListByZoneID, payload);
      // } else {
      //   response = yield call(queryProposalList, payload);
      // }

      // clear state
      yield put({
        type: 'saveProposalList',
        payload: {
          items: [],
          page: 1,
          pages: 1,
          per_page: 20,
          total: 1,
        },
      });

      const response = yield call(queryProposalList, payload);

      if (response.data) {
        yield put({
          type: 'saveProposalList',
          payload: response.data,
        });
      }
    },

    // get all currency
    *fetchAllCurrency(_, { call, put }) {
      const response = yield call(queryCurrencylList);

      // console.log('saveCurrencyList', response.data);
      yield put({
        type: 'saveCurrencyList',
        payload: response.data,
      });
    },

    *fetchProposal({ payload }, { call, put }) {
      const response = yield call(queryProposal, payload);
      yield put({
        type: 'saveProposal',
        payload: response.data,
      });

      return response.data;
    },

    *fetchProposalZone({ payload }, { call, put }) {
      // clear state
      yield put({
        type: 'saveProposalZone',
        payload: {},
      });

      const response = yield call(queryProposalZone, payload);

      yield put({
        type: 'saveProposalZone',
        payload: response.data,
      });

      return response.data;
    },

    *createProposal({ payload }, { call, put }) {
      const response = yield call(createProposal, payload);
      if (response.status === 'success') {
        message.success('提案创建成功');
        yield put(
          routerRedux.replace({
            pathname: '/',
          }),
        );
      }

      if (response.status === 'fail') {
        message.error(response.message);
      }
    },

    *updateProposal({ payload }, { call, put }) {
      const response = yield call(updateProposal, payload);
      if (response.status === 'success') {
        message.success('提案修改成功');
        router.go(-1); // 回到上一页
      }
    },

    *updateProposalStatus({ payload }, { call, _ }) {
      const response = yield call(updateProposalStatus, payload);
      if (response.status === 'success') {
        message.success('提案状态修改成功');
        window.location.reload();
      }
    },

    *deleteProposal({ payload }, { call, put }) {
      const response = yield call(deleteProposal, payload);
      if (response.status === 'success') {
        message.success('提案删除成功');
        yield put(
          routerRedux.replace({
            pathname: '/',
          }),
        );
        return true;
      }
      return false;
    },

    *deleteProposalZone({ payload }, { call, put }) {
      const response = yield call(deleteProposalZone, payload);
      if (response.status === 'success') {
        message.success('提案专区删除成功');
        yield put(
          routerRedux.replace({
            pathname: '/',
          }),
        );
        return true;
      }

      return false;
    },

    *createProposalZone({ payload }, { call, put }) {
      const response = yield call(createProposalZone, payload);
      if (response.status === 'success') {
        message.success('提案专区创建成功');
        router.go(-1); // 回到上一页
      }

      if (response.status === 'fail') {
        if (response.code === 409) {
          message.error('已存在同名专区');
        }
      }
    },

    *updateProposalZone({ payload }, { call, put }) {
      const response = yield call(updateProposalZone, payload);
      if (response.status === 'success') {
        message.success('提案专区修改成功');
        router.go(-1); // 回到上一页
      }
    },

    *queryProposalLogs({ payload }, { call, put }) {
      const response = yield call(queryProposalLogs, payload);
      yield put({
        type: 'saveProposalLogs',
        payload: response.data,
      });
    },

    // update proposal progress
    *updateProposalProgress({ payload }, { call, put }) {
      const response = yield call(updateProposalProgress, payload);
      if (response.status === 'success') {
        message.success('提案进度更新成功');
        window.location.reload();
        // yield put({
        //   type: 'saveProposalLogs',
        //   payload: response.data,
        // });
      }
    },
  },
  reducers: {
    saveProposalZoneList(state, action) {
      return { ...state, zone_list: action.payload || [] };
    },
    saveProposalZone(state, action) {
      return { ...state, zone_detail: action.payload || {} };
    },

    /*
     * Proposal category
     */
    saveCategoryList(state, action) {
      return { ...state, proposal_category: action.payload };
    },

    saveProposalList(state, action) {
      return {
        ...state,
        proposal_list: action.payload || {
          items: [],
          page: 1,
          pages: 1,
          per_page: 20,
          total: 1,
        },
      };
    },
    saveCurrencyList(state, action) {
      return { ...state, currency_list: action.payload || [] };
    },
    saveProposal(state, action) {
      return { ...state, detail: action.payload || {} };
    },
    saveProposalLogs(state, action) {
      return { ...state, logs: action.payload || [] };
    },
  },
};
export default ProposalModel;
