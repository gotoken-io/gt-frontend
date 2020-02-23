import React, { useState, useEffect } from 'react';
import { Form, Input, Modal } from 'antd';
import { connect } from 'dva';
import styles from './style.less';

const { TextArea } = Input;

const ClaimModal = props => {
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
            type: 'proposal/claimProposal',
            payload,
          });
        }
      }
    });
  }

  return (
    <Modal
      title="申领提案"
      visible={visible}
      onOk={handleOk}
      confirmLoading={submiting}
      onCancel={props.onCancel}
    >
      <Form>
        <Form.Item label="申领理由">
          {getFieldDecorator('reason', {
            rules: [
              {
                required: true,
                message: '请输入申领此提案理由!',
              },
            ],
          })(<TextArea rows={4} />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};

const ClaimModalWrapper = Form.create({
  name: 'claim-modal',
})(ClaimModal);

export default connect(({ loading }) => ({
  submiting: loading.effects['proposal/claimProposal'],
}))(ClaimModalWrapper);
