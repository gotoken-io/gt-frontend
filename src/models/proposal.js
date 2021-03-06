import { routerRedux } from 'dva/router';
import { message } from 'antd';
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
  queryProposalClaims,
  claimProposal,
  cancelClaimProposal,
  verifyProposalClaim,
  submitProposalClaimResult,
  verifyProposalClaimResult,
  addTeam,
  deleteTeam,
} from '@/services/proposal';

import { showMsgReload, showMsgGoBack } from '@/utils/utils';
import { VoteContract } from '../services/voteContract';
import { HpbVoteContract } from '../services/hpbVoteContract';
import { formatMessage } from 'umi-plugin-react/locale';

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
    voteDetail: {},
    logs: [],
    claims: [],
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
        message.success(formatMessage({ id: 'proposal.models.category_success' }));
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
        message.success(formatMessage({ id: 'proposal.models.category_updated' }));
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
        message.success(formatMessage({ id: 'proposal.models.delete_category' }));
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
      const detail = response.data;
      const responseZone = yield call(queryProposalZone, { id: detail.zone_proposal_id });
      detail.zone_detail = responseZone.data;
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
        message.success(formatMessage({ id: 'proposal.models.create_proposal_success' }));
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
        showMsgGoBack(formatMessage({ id: 'proposal.models.proposal_updated' }));
      }
    },

    *updateProposalStatus({ payload }, { call, _ }) {
      const response = yield call(updateProposalStatus, payload);
      if (response.status === 'success') {
        showMsgReload(formatMessage({ id: 'proposal.models.proposal_status_updated' }));
        return true;
      }
    },

    *deleteProposal({ payload }, { call, put }) {
      const response = yield call(deleteProposal, payload);
      if (response.status === 'success') {
        message.success(formatMessage({ id: 'proposal.models.proposal_deleted' }));
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
        message.success(formatMessage({ id: 'proposal.models.delete_proposal_zone_success' }));
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
        showMsgGoBack(formatMessage({ id: 'proposal.models.create_proposal_success' }));
      }

      if (response.status === 'fail') {
        if (response.code === 409) {
          message.error(formatMessage({ id: 'proposal.models.proposal_zone_duplicated' }));
        }
      }
    },

    *updateProposalZone({ payload }, { call, put }) {
      const response = yield call(updateProposalZone, payload);
      if (response.status === 'success') {
        showMsgGoBack(formatMessage({ id: 'proposal.models.edit_proposal_zone_success' }));
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
        showMsgReload(formatMessage({ id: 'proposal.models.proposal_progress_updated' }));

        return true;
      }
    },

    /*
     * Proposal claim
     */
    *queryProposalClaims({ payload }, { call, put }) {
      const response = yield call(queryProposalClaims, payload);
      yield put({
        type: 'saveProposalClaims',
        payload: response.data,
      });
    },

    *claimProposal({ payload }, { call, put }) {
      const response = yield call(claimProposal, {
        reason: payload.reason,
        payment_address: payload.payment_address,
        plan: payload.plan,
        proposal_id: payload.proposal_id,
      });
      if (response.status !== 'success') {
        message.error(formatMessage({ id: 'proposal.models.claim_failed' }));
        return true;
      }
      const addTeamResponse = yield call(addTeam, {
        claim_id: response.data.claim_id,
        user_id: payload.owner_id,
        responsibility: payload.responsibility,
      });

      if (addTeamResponse.status !== 'success') {
        message.error(formatMessage({ id: 'proposal.models.claim_failed' }));
        return true;
      }
      showMsgReload(formatMessage({ id: 'proposal.models.claim_created' }));
      return true;
    },
    *addTeamMember({ payload }, { call, put }) {
      const addTeamResponse = yield call(addTeam, {
        claim_id: payload.claim_id,
        user_id: payload.user_id,
        responsibility: payload.responsibility,
      });

      if (addTeamResponse.status !== 'success') {
        message.error(formatMessage({ id: 'proposal.models.claim_failed' }));
        return true;
      }
      showMsgReload(formatMessage({ id: 'proposal.models.claim_created' }));
      return true;
    },
    *deleteTeamMember({ payload }, { call, put }) {
      const result = yield call(deleteTeam, {
        id: payload.id,
        user_id: payload.user_id,
        responsibility: payload.responsibility,
      });

      if (result.status !== 'success') {
        message.error(formatMessage({ id: 'proposal.models.delete_team_member_failed' }));
        return true;
      }
      showMsgReload(formatMessage({ id: 'proposal.models.team_member_deleted' }));
      return true;
    },

    *cancelClaimProposal({ payload }, { call, put }) {
      const response = yield call(cancelClaimProposal, payload);
      if (response.status === 'success') {
        showMsgReload(formatMessage({ id: 'proposal.models.claim_canceled' }));

        return true;
      }
    },

    *verifyProposalClaim({ payload }, { call, put }) {
      const response = yield call(verifyProposalClaim, payload);
      if (response.status === 'success') {
        showMsgReload(formatMessage({ id: 'proposal.models.claim_audited' }));

        return true;
      }
    },

    *submitProposalClaimResult({ payload }, { call, put }) {
      const response = yield call(submitProposalClaimResult, payload);
      if (response.status === 'success') {
        showMsgReload(formatMessage({ id: 'proposal.models.claim_submit_result' }));

        return true;
      }
    },

    *verifyProposalClaimResult({ payload }, { call, put }) {
      const response = yield call(verifyProposalClaimResult, payload);
      if (response.status === 'success') {
        showMsgReload(formatMessage({ id: 'proposal.models.claim_result_verified' }));
        return true;
      }
    },
    *fetchVoteInformation({ payload }, { call, put }) {
      if (payload.zone.name === 'GT') {
        const vote = VoteContract.get();
        if (!vote) {
          yield put({
            type: 'saveVoteInfo',
            payload: {
              error: 'No Metamask',
            },
          });
          return;
        }
        const signers = yield call(vote.getSigners, { zone: payload.zone });
        const voteInfo = yield call(vote.getVoteInfo, { zone: payload.zone, hash: payload.hash });
        yield put({
          type: 'saveVoteInfo',
          payload: {
            signers,
            ...voteInfo,
          },
        });
        return;
      }
      if (payload.zone.name.substr(0,3) === 'HPB') {
        const vote = HpbVoteContract.get();
        const signers = [];
        const voteInfo = yield call(vote.getHpbVoteInfo, { zone: payload.zone, hash: payload.hash });
        console.log(voteInfo)
        yield put({
          type: 'saveVoteInfo',
          payload: {
            signers,
            ...voteInfo,
          },
        });
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
    saveVoteInfo(state, action) {
      return { ...state, voteDetail: action.payload || {} };
    },

    saveProposalLogs(state, action) {
      return { ...state, logs: action.payload || [] };
    },
    /* Proposal Claims */
    saveProposalClaims(state, action) {
      return { ...state, claims: action.payload || [] };
    },
  },
};
export default ProposalModel;
