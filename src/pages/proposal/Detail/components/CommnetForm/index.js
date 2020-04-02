import React from 'react';
import { Form, Input, Button, message, Row, Col } from 'antd';
import { connect } from 'dva';
import UserAvatar from '@/components/User/UserAvatar';

import styles from './style.less';

const { TextArea } = Input;

const CommentForm = props => {
  const { getFieldDecorator, getFieldsError, resetFields } = props.form;
  const { submittingCreate, currentUser } = props;

  const hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);

        const { dispatch, proposalDetail, currentUser } = props;
        if (currentUser.id) {
          dispatch({
            type: 'comment/createComment',
            payload: { ...values, proposal_id: proposalDetail.id },
          });

          // clear input value
          resetFields();
        } else {
          message.error('请先登陆');
        }
      }
    });
  };
  if (!currentUser) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Form onSubmit={handleSubmit}>
        <Row gutter={[16, 16]}>
          <Col lg={{ span: 1 }} xs={{ span: 4 }}>
            <Form.Item>
              <UserAvatar {...currentUser} />
            </Form.Item>
          </Col>
          <Col lg={{ span: 8 }} xs={{ span: 14 }}>
            <Form.Item>
              {getFieldDecorator('text', {
                rules: [
                  { required: true, message: '请输入评论内容' },
                  { max: 250, message: '评论内容最多250字符' },
                ],
              })(<Input allowClear style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 2 }} xs={{ span: 2 }}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={hasErrors(getFieldsError()) || submittingCreate}
              >
                提交
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

const CommentFormWrapper = Form.create({ name: 'comment_form' })(CommentForm);
export default connect(({ user, proposal, loading }) => ({
  currentUser: user.currentUser,
  proposalDetail: proposal.detail,
  submittingCreate: loading.effects['comment/createComment'],
}))(CommentFormWrapper);
