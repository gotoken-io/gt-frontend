import React from 'react';
import { connect } from 'dva';
import ProposalForm from '../Component/Form';

const Update = props => {
  const { id } = props.match.params;

  return <ProposalForm id={id} />;
};

export default connect(({ loading }) => ({
  submitting: loading.effects['proposal/updateProposal'],
}))(Update);
