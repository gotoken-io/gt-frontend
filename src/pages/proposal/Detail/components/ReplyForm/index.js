import React, { useEffect } from 'react';
import { Form, Avatar, Input, Button } from 'antd';
import { connect } from 'dva';
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

        const { dispatch, proposalDetail, parent_id } = props;
        dispatch({
          type: 'comment/createComment',
          payload: { text: values.text, proposal_id: proposalDetail.id, parent_id },
        });

        resetFields();
      }
    });
  };

  return (
    <div className={styles.replyForm}>
      <Form onSubmit={handleSubmit}>
        <Form.Item>
          {getFieldDecorator('text', {
            rules: [{ required: true, message: '请输入评论内容' }],
          })(<TextArea rows={4} />)}
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={hasErrors(getFieldsError()) || submittingCreate}
          >
            回复
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const ReplyFormWrapper = Form.create({ name: 'reply_form' })(ReplyForm);

export default connect(({ proposal, loading }) => ({
  proposalDetail: proposal.detail,
  submittingCreate: loading.effects['comment/createComment'],
  submittingUpdate: loading.effects['comment/updateComment'],
}))(ReplyFormWrapper);
