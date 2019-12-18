import { routerRedux } from 'dva/router';
import { message } from 'antd';
import router from 'umi/router';
import {
  createProposal,
  updateProposal,
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
} from '@/services/proposal';

const ProposalModel = {
  namespace: 'proposal',
  state: {
    zone_list: [],
    zone_detail: {},
    currency_ist: [],
    list: [],
    detail: {},
  },
  effects: {
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
      let response;

      if (payload.id) {
        response = yield call(queryProposalListByZoneID, payload);
      } else {
        response = yield call(queryProposalList);
      }

      yield put({
        type: 'saveProposalList',
        payload: response.data,
      });
    },

    // get all currency
    *fetchAllCurrency(_, { call, put }) {
      const response = yield call(queryCurrencylList);
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
    },

    *updateProposal({ payload }, { call, put }) {
      const response = yield call(updateProposal, payload);
      if (response.status === 'success') {
        message.success('提案修改成功');
        router.go(-1); // 回到上一页
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
        yield put(
          routerRedux.replace({
            pathname: '/',
          }),
        );
      }
    },

    *updateProposalZone({ payload }, { call, put }) {
      const response = yield call(updateProposalZone, payload);
      if (response.status === 'success') {
        message.success('提案专区修改成功');
        router.go(-1); // 回到上一页
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

    saveProposalList(state, action) {
      return { ...state, list: action.payload || [] };
    },
    saveCurrencyList(state, action) {
      return { ...state, currency_list: action.payload || [] };
    },
    saveProposal(state, action) {
      return { ...state, detail: action.payload || {} };
    },
  },
};
export default ProposalModel;
