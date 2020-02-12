import React, { useState, useEffect } from 'react';
import { Form, Select, Modal } from 'antd';
import { proposalStatus } from '@/utils/proposal';

import { connect } from 'dva';
import styles from './style.less';

const { Option } = Select;

const ChangeStatusModal = props => {
  // state

  // props
  const { submiting, id, title, status_key, visible } = props;
  const { getFieldDecorator, setFieldsValue } = props.form;

  // useEffect
  useEffect(() => {
    setFieldsValue({ status_key });
  }, [visible]);

  function handleOk() {
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // filter some form value
        const payload = {
          ...values,
          id, // proposal id
        };

        console.log('payload', payload);

        const { dispatch } = props;

        if (dispatch) {
          console.log('udpate');
          dispatch({
            type: 'proposal/updateProposalStatus',
            payload,
          });
        }
      }
    });
  }

  return (
    <Modal
      title={`修改提案: ${title} 状态`}
      visible={visible}
      onOk={handleOk}
      confirmLoading={submiting}
      onCancel={props.onCancel}
    >
      <Form>
        <Form.Item label="提案状态">
          {getFieldDecorator('status_key', {
            rules: [
              {
                required: true,
                message: '请选择提案状态',
              },
            ],
          })(
            <Select style={{ width: 250 }} placeholder="请选择要改变成的状态">
              {proposalStatus.map(d => (
                <Option key={d.key} value={d.key}>
                  {d.text}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

const ChangeStatusModalWrapper = Form.create({
  name: 'change-status-modal',
})(ChangeStatusModal);

export default connect(({ loading }) => ({
  submiting: loading.effects['proposal/updateProposalStatus'],
}))(ChangeStatusModalWrapper);
