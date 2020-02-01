import React from 'react';
import { connect } from 'dva';
import ProposalForm from '../Component/Form';

const Update = props => {
  const { id } = props.match.params;

  const handleSubmit = (e, form) => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const { dispatch, match } = props;
        // get proposal id from url params
        const { id } = match.params;

        const tag = values.tag instanceof Array && values.tag.join(','); // convert array to string

        // filter some form value
        let submitData = {
          ...values,
          tag: tag === false ? '' : tag, // 如果 tag=false, 传空字符串
          detail: values.detail.toHTML(), // or values.content.toHTML()
        };

        // 无预算
        if (values['has-budget'] === 0) {
          submitData = {
            ...submitData,
            amount: '0',
            currency_id: null,
          };
        }

        console.log('submitData', submitData);

        if (id) {
          dispatch({
            type: 'proposal/updateProposal',
            payload: {
              id,
              ...submitData,
            },
          });
        } else {
          // 创建提案
          dispatch({
            type: 'proposal/createProposal',
            payload: { ...submitData },
          });
        }
      }
    });
  };

  return <ProposalForm id={id} onSubmit={handleSubmit} />;
};

export default connect(({ loading }) => ({
  submitting: loading.effects['proposal/updateProposal'],
}))(Update);
