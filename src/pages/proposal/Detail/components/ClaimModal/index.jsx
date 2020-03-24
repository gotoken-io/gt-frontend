import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, List, Skeleton } from 'antd';
import { connect } from 'dva';
import UserAvatar from '@/components/User/UserAvatar';

import styles from './style.less';

const { TextArea } = Input;

const ClaimModal = props => {
  // state

  // props
  const { id, submiting, visible, user } = props;
  const { getFieldDecorator, setFieldsValue } = props.form;
  console.log(props);
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
          })(<TextArea rows={4} placeholder="填写申领此提案理由" />)}
        </Form.Item>
        <Form.Item label="安排时间">
          {getFieldDecorator('plan', {
            rules: [
              {
                required: true,
                message: '请输入安排时间!',
              },
            ],
          })(<TextArea rows={4} placeholder="填写领安排时间" />)}
        </Form.Item>
        <div>
          <List
            itemLayout="horizontal"
            dataSource={[user]}
            renderItem={owner => (
              <List.Item actions={[]}>
                <Skeleton avatar loading={false} title={false} active>
                  <List.Item.Meta
                    avatar={<UserAvatar size={48} {...owner} />}
                    title={'责任 ' + owner.email}
                    description={
                      <>
                        {getFieldDecorator('responsibility', {
                          rules: [
                            {
                              required: true,
                              message: '请输入员负责内容!',
                            },
                          ],
                        })(<Input placeholder="填写领安排时间" style={{ width: '80%' }} />)}
                      </>
                    }
                  />
                  {getFieldDecorator('owner_id', {
                    initialValue: user.id,
                  })(<Input type="hidden" />)}
                </Skeleton>
              </List.Item>
            )}
          />
        </div>

        <Form.Item label="收币地址">
          {getFieldDecorator('payment_address', {
            rules: [
              {
                required: true,
                message: '请输入收币地址!',
              },
            ],
          })(<Input placeholder="填写收币地址" />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};

const ClaimModalWrapper = Form.create({
  name: 'claim-modal',
})(ClaimModal);

export default connect(({ loading, user }) => ({
  submiting: loading.effects['proposal/claimProposal'],
  user: user.currentUser,
}))(ClaimModalWrapper);
