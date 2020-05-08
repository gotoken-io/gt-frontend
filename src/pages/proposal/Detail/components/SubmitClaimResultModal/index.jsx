import React, { useState, useEffect } from 'react';
import { Form, Input, Modal } from 'antd';
import { connect } from 'dva';
import { FormattedMessage } from 'umi-plugin-react/locale';
import styles from './style.less';

const { TextArea } = Input;

const SubmitClaimResultModal = props => {
  // state

  // props
  const { id, submiting, visible } = props;
  const { getFieldDecorator, setFieldsValue } = props.form;

  function handleOk() {
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // filter some form value
        const payload = {
          ...values,
          proposal_id: id, // proposal id
        };

        console.log('payload', payload);

        const { dispatch } = props;

        if (dispatch) {
          dispatch({
            type: 'proposal/submitProposalClaimResult',
            payload,
          }).then(res => {
            if (res) {
              // close modal
              props.onCancel();
            }
          });
        }
      }
    });
  }

  return (
    <Modal
      title={<FormattedMessage id="proposal.submit_results" />}
      visible={visible}
      onOk={handleOk}
      confirmLoading={submiting}
      onCancel={props.onCancel}
    >
      <Form>
        <Form.Item label={<FormattedMessage id="proposal.detail.claims.proposal_done_results" />}>
          {getFieldDecorator('result', {
            rules: [
              {
                required: true,
                message: <FormattedMessage id="proposal.detail.claims.proposal_done" />,
              },
            ],
          })(<TextArea rows={4} />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};

const SubmitClaimResultModalWrapper = Form.create({
  name: 'submit-claim-result-modal',
})(SubmitClaimResultModal);

export default connect(({ loading }) => ({
  submiting: loading.effects['proposal/submitProposalClaimResult'],
}))(SubmitClaimResultModalWrapper);
