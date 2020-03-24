import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { connect } from 'dva';
import UserAvatar from '@/components/User/UserAvatar';

import styles from './style.less';

const { TextArea } = Input;

const CommentForm = props => {
  const { getFieldDecorator, getFieldsError, resetFields } = props.form;
  const { submittingCreate } = props;

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

  return (
    <div className={styles.container}>
      <Form onSubmit={handleSubmit} className={styles.content}>
        {/* <UserAvatar {...creator} /> */}
        <Form.Item className={styles.input}>
          {getFieldDecorator('text', {
            rules: [
              { required: true, message: '请输入评论内容' },
              { max: 250, message: '评论内容最多250字符' },
            ],
          })(<Input allowClear />)}
        </Form.Item>

        <Form.Item className={styles.button}>
          <Button
            type="primary"
            htmlType="submit"
            loading={hasErrors(getFieldsError()) || submittingCreate}
          >
            提交
          </Button>
        </Form.Item>
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
