import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, Col, Row, List, Skeleton, Button, Spin } from 'antd';
import { connect } from 'dva';
import UserAvatar from '@/components/User/UserAvatar';
import { AutoCompleteCode } from '@/components/AutoCompleteCode';
import styles from './style.less';
import { searchUser } from '@/services/user';
const { TextArea } = Input;
import { FormattedMessage,formatMessage } from 'umi-plugin-react/locale';


const ClaimTeamModal = props => {
  // state

  // props
  const { claim, submitting, visible, user } = props;
  const { getFieldDecorator, setFieldsValue } = props.form;
  console.log(props);
  if (!claim) {
    return null;
  }
  function handleOk() {
    if (submitting) {
      return;
    }

    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // filter some form value
        const payload = {
          user_id: values.user_id,
          responsibility: values.responsibility,
          claim_id: claim.claim_id,
        };

        console.log('payload', payload);

        const { dispatch } = props;

        if (dispatch) {
          dispatch({
            type: 'proposal/addTeamMember',
            payload,
          });
        }
      }
    });
  }
  function handleDelete(teamMember) {
    const { dispatch } = props;

    if (dispatch) {
      dispatch({
        type: 'proposal/deleteTeamMember',
        payload: { id: teamMember.id },
      });
    }
  }
  return (
    <Modal
      title={<FormattedMessage id="proposal.detail.clsimd_proposal" />}
      visible={visible}
      confirmLoading={submitting}
      onCancel={props.onCancel}
      onOk={handleOk}
      okText={<FormattedMessage id="proposal.detail.join_members" />}
    >
      <div>
        <List
          itemLayout="horizontal"
          dataSource={claim.team}
          renderItem={teamMember => (
            <List.Item
              actions={[
                teamMember.user_id !== claim.user_id ? (
                  <a key="list-delete" onClick={() => handleDelete(teamMember)}>
                    <FormattedMessage id="app.delete" />
                  </a>
                ) : (
                  <FormattedMessage id="proposal.detail.responsibility" />
                ),
              ]}
            >
              <Skeleton avatar loading={false} title={false} active>
                <List.Item.Meta
                  avatar={<UserAvatar size={48} {...teamMember.staff} />}
                  title={teamMember.staff.email}
                  description={teamMember.responsibility}
                />
              </Skeleton>
            </List.Item>
          )}
        />
      </div>
      <div className="margin-l" />
      <Form>
      <FormattedMessage id="proposal.detail.join_new_members" />：
        <Row>
          <Col span={8}>
            <Row type="flex" justify="center" align="middle" style={{ height: '60px' }}>
              {getFieldDecorator('user_id', {})(
                <AutoCompleteCode
                  label={<FormattedMessage id="proposal.detail.email" />}
                  onAutoComplete={async content => {
                    const searchResult = await searchUser(content);
                    if (!searchResult.data) {
                      return [];
                    }
                    return searchResult.data.map(user => ({ text: user.email, value: user.id }));
                  }}
                />,
              )}
            </Row>
          </Col>
          <Col span={15} offset={1}>
            <Row type="flex" justify="center" align="middle" style={{ height: '60px' }}>
              {getFieldDecorator('responsibility', {
                rules: [
                  {
                    required: true,
                    message: <FormattedMessage id="proposal.detail.responsible_content" />,
                  },
                ],
              })(<Input placeholder={formatMessage({id:"proposal.detail.arrange_time"})} />)}
            </Row>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

const ClaimTeamModalWrapper = Form.create({
  name: 'claim-modal',
})(ClaimTeamModal);

export default connect(({ loading, user }) => {
  return {
    submitting: loading.effects['proposal/addTeamMember'],
    user: user.currentUser,
  };
})(ClaimTeamModalWrapper);
