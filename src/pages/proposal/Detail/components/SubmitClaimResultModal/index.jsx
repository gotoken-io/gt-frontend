import React, { useState, useEffect } from 'react';
import { Form, Input, Modal } from 'antd';
import { connect } from 'dva';
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
      title="提交结果"
      visible={visible}
      onOk={handleOk}
      confirmLoading={submiting}
      onCancel={props.onCancel}
    >
      <Form>
        <Form.Item label="提案完成结果">
          {getFieldDecorator('result', {
            rules: [
              {
                required: true,
                message: '请输入提案完成结果!',
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
