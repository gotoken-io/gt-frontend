import React, { useState, useEffect } from 'react';
import { Form, Select, Modal } from 'antd';
import { connect } from 'dva';
import styles from './style.less';

const { Option } = Select;

const VerifyClaimModal = props => {
  // state

  // props
  const { claim_id, submiting, visible } = props;
  const { getFieldDecorator, setFieldsValue } = props.form;

  function handleOk() {
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // filter some form value
        const payload = {
          ...values,
          claim_id, // claim id
        };

        console.log('payload', payload);

        const { dispatch } = props;

        if (dispatch) {
          dispatch({
            type: 'proposal/VerifyProposalClaim',
            payload,
          });
        }
      }
    });
  }

  return (
    <Modal
      title="审核提案申领"
      visible={visible}
      onOk={handleOk}
      confirmLoading={submiting}
      onCancel={props.onCancel}
    >
      <Form>
        <Form.Item label="申领理由">
          {getFieldDecorator('approve', {
            rules: [{ required: true, message: '请选择审核申领结果!' }],
          })(
            <Select placeholder="请选择审核申领结果">
              <Option value>通过</Option>
              <Option value={false}>不通过</Option>
            </Select>,
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

const VerifyClaimModalWrapper = Form.create({
  name: 'verify-claim-modal',
})(VerifyClaimModal);

export default connect(({ loading }) => ({
  submiting: loading.effects['proposal/VerifyProposalClaim'],
}))(VerifyClaimModalWrapper);
