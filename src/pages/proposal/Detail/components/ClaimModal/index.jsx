import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, List, Skeleton } from 'antd';
import { connect } from 'dva';
import UserAvatar from '@/components/User/UserAvatar';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

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
      title={<FormattedMessage id="proposal.detail.claim_proposal" />}
      visible={visible}
      onOk={handleOk}
      confirmLoading={submiting}
      onCancel={props.onCancel}
    >
      <Form>
        <Form.Item label={<FormattedMessage id="proposal.claims_reason" />}>
          {getFieldDecorator('reason', {
            rules: [
              {
                required: true,
                message: <FormattedMessage id="proposal.detail.claims.input_fill_reason" />,
              },
            ],
          })(
            <TextArea
              rows={4}
              placeholder={formatMessage({ id: 'proposal.detail.claims.fill_reason' })}
            />,
          )}
        </Form.Item>
        <Form.Item label={<FormattedMessage id="proposal.detail.arrange_time" />}>
          {getFieldDecorator('plan', {
            rules: [
              {
                required: true,
                message: <FormattedMessage id="proposal.detail.claims.input_arrange_time" />,
              },
            ],
          })(
            <TextArea
              rows={4}
              placeholder={formatMessage({ id: 'proposal.detail.claims.arrange_time' })}
            />,
          )}
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
                    title={
                      <FormattedMessage
                        id="proposal.detail.claims.responsibility"
                        values={{ owner_email: owner.email }}
                      />
                    }
                    description={
                      <>
                        {getFieldDecorator('responsibility', {
                          rules: [
                            {
                              required: true,
                              message: (
                                <FormattedMessage id="proposal.detail.responsible_content" />
                              ),
                            },
                          ],
                        })(
                          <Input
                            placeholder={formatMessage({
                              id: 'proposal.detail.claims.input_arrange_time',
                            })}
                            style={{ width: '80%' }}
                          />,
                        )}
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

        <Form.Item label={<FormattedMessage id="proposal.detail.claims.collect_address" />}>
          {getFieldDecorator('payment_address', {
            rules: [
              {
                required: true,
                message: <FormattedMessage id="proposal.detail.claims.input_collect_address" />,
              },
            ],
          })(<Input placeholder={formatMessage({ id: 'proposal.detail.claims.fill_collect' })} />)}
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
