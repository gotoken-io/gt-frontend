import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  createProposal,
  createProposalZone,
  queryProposalList,
  queryProposal,
  queryProposalZoneList,
  queryCurrencylList,
} from '@/services/proposal';

const ProposalModel = {
  namespace: 'proposal',
  state: {
    zone_list: [],
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
    *fetchAllProposal(_, { call, put }) {
      const response = yield call(queryProposalList);
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
  },
  reducers: {
    saveProposalZoneList(state, action) {
      return { ...state, zone_list: action.payload || [] };
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
