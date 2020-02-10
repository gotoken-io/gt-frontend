import React, { useState, useEffect } from 'react';
import { Form, Input, Modal } from 'antd';

import { connect } from 'dva';
import styles from './style.less';

const EditAddressModal = props => {
  // state

  // props
  const { type, zone, currency, address, visible, submitingAdd, submitingUpdate } = props;
  const { getFieldDecorator, setFieldsValue } = props.form;

  // useEffect
  useEffect(() => {
    console.log('useEffect', address);
    setFieldsValue({ address });
  }, [visible]);

  function renderTitle() {
    let action;
    if (type === 'update') {
      action = '修改';
    }

    if (type === 'add') {
      action = '添加';
    }

    if (action && zone && currency) {
      return `${action}${zone.name}专区${currency.unit}地址`;
    }
  }

  function handleOk() {
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // filter some form value
        const payload = {
          ...values,
          zone_id: zone.id,
          currency_id: currency.id,
        };

        console.log('payload', payload);

        const { dispatch } = props;

        if (dispatch) {
          if (type === 'update') {
            console.log('udpate');
            dispatch({
              type: 'user/updateUserWallet',
              payload,
            });
          }

          if (type === 'add') {
            dispatch({
              type: 'user/addUserWallet',
              payload,
            });
          }
        }
      }
    });
  }

  return (
    <Modal
      title={renderTitle()}
      visible={visible}
      onOk={handleOk}
      confirmLoading={type === 'add' ? submitingAdd : submitingUpdate}
      onCancel={props.onCancel}
    >
      <Form>
        <Form.Item>
          {getFieldDecorator('address', {
            rules: [
              {
                required: true,
                message: '请输入钱包地址',
              },
            ],
          })(<Input placeholder="请输入钱包地址" />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};

const EditAddressModalWrapper = Form.create({
  name: 'edit-address-modal',
})(EditAddressModal);

export default connect(({ loading }) => ({
  submitingAdd: loading.effects['user/addUserWallet'],
  submitingUpdate: loading.effects['user/updateUserWallet'],
}))(EditAddressModalWrapper);
