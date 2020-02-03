import React from 'react';
import { connect } from 'dva';
import ProposalForm from '../Component/Form';

const Create = props => <ProposalForm />;

export default connect(({ loading }) => ({
  submitting: loading.effects['proposal/createProposal'],
}))(Create);
