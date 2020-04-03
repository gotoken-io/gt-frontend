import React, { useEffect } from 'react';
import { Form, message, Input, Button } from 'antd';
import { connect } from 'dva';
import { FormattedMessage } from 'umi-plugin-react/locale';
import styles from './style.less';

const { TextArea } = Input;

const ReplyForm = props => {
  const { getFieldDecorator, getFieldsError, resetFields } = props.form;
  const { submittingCreate } = props;

  const hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);

        const { dispatch, proposalDetail, parent_id, currentUser } = props;

        if (currentUser.id) {
          dispatch({
            type: 'comment/createComment',
            payload: { text: values.text, proposal_id: proposalDetail.id, parent_id },
          });

          resetFields();
        } else {
          message.error(<FormattedMessage id="proposal.detail.comments.login" />);
        }
      }
    });
  };

  return (
    <div className={styles.replyForm}>
      <Form onSubmit={handleSubmit}>
        <Form.Item>
          {getFieldDecorator('text', {
            rules: [
              { required: true, message: <FormattedMessage id="proposal.detail.comments.comments_content" /> },
              { max: 250, message: <FormattedMessage id="proposal.detail.comments.content_max" /> },
            ],
          })(<TextArea rows={4} />)}
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={hasErrors(getFieldsError()) || submittingCreate}
          >
            回复
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const ReplyFormWrapper = Form.create({ name: 'reply_form' })(ReplyForm);

export default connect(({ user, proposal, loading }) => ({
  currentUser: user.currentUser,
  proposalDetail: proposal.detail,
  submittingCreate: loading.effects['comment/createComment'],
  submittingUpdate: loading.effects['comment/updateComment'],
}))(ReplyFormWrapper);
