import React, { useState, useEffect } from 'react';
import { Form, Input, Modal } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';

const { TextArea } = Input;

const UpdateProgressModal = props => {
  // state

  // props
  const { id, submiting, visible } = props;
  const { getFieldDecorator, setFieldsValue } = props.form;

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
            type: 'proposal/updateProposalProgress',
            payload,
          }).then(res => {
            if (res) {
              // close modal
              props.onCancel();
            }
          });
        }
      }
    });
  }

  return (
    <Modal
      title={<FormattedMessage id="proposal.detail.claims.update_proposal_progress" />}
      visible={visible}
      onOk={handleOk}
      confirmLoading={submiting}
      onCancel={props.onCancel}
    >
      <Form>
        <Form.Item label={<FormattedMessage id="proposal.detail.claims.progress_general_situation" />}>
          {getFieldDecorator('progress_content', {
            rules: [
              {
                required: true,
                message: <FormattedMessage id="proposal.detail.claims.input_general_situation" />,
              },
            ],
          })(<TextArea rows={4} />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};

const UpdateProgressModalWrapper = Form.create({
  name: 'update-progress-modal',
})(UpdateProgressModal);

export default connect(({ loading }) => ({
  submiting: loading.effects['proposal/updateProposalProgress'],
}))(UpdateProgressModalWrapper);
