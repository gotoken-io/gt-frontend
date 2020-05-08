import React, { useState, useEffect } from 'react';
import { Form, Select, Modal } from 'antd';
import { connect } from 'dva';
import { FormattedMessage,formatMessage } from 'umi-plugin-react/locale';
import styles from './style.less';

const { Option } = Select;

const VerifyClaimModal = props => {
  // state

  // props
  const { claimer, claim_id, visible, status_key } = props;
  const { getFieldDecorator, setFieldsValue } = props.form;
  const { submitingVerifyResult, submitingVerify } = props;

  const verifyClaimStatus = ['claiming', 'fail'];
  const verifyClaimResultStatus = ['submit_result', 'result_approve', 'result_fail'];

  function verifyType() {
    if (verifyClaimStatus.find(d => d === status_key)) {
      return 'verify';
    }

    if (verifyClaimResultStatus.find(d => d === status_key)) {
      return 'verifyResult';
    }
  }

  function handleOk() {
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // filter some form value
        const payload = {
          ...values,
          claim_id, // claim id
        };

        console.log('payload', payload);

        const { dispatch } = props;

        if (dispatch) {
          if (verifyType() === 'verify') {
            dispatch({
              type: 'proposal/verifyProposalClaim',
              payload,
            }).then(res => {
              if (res) {
                props.onCancel();
              }
            });
          }

          if (verifyType() === 'verifyResult') {
            dispatch({
              type: 'proposal/verifyProposalClaimResult',
              payload,
            }).then(res => {
              if (res) {
                props.onCancel();
              }
            });
          }
        }
      }
    });
  }

  function modalConfig() {
    if (verifyType() === 'verify') {
      return {
        title: <FormattedMessage id="proposal.detail.verifyclaims.audit_claims" />,
        submiting: submitingVerify,
      };
    }

    if (verifyType() === 'verifyResult') {
      return {
        title: <FormattedMessage id="proposal.detail.verifyclaims.audit_claims_results" />,
        submiting: submitingVerifyResult,
      };
    }

    return {
      title: '',
      submiting: submitingVerifyResult,
    };
  }

  return (
    <Modal
      title={modalConfig().title}
      visible={visible}
      onOk={handleOk}
      confirmLoading={modalConfig().submiting}
      onCancel={props.onCancel}
    >
      <Form>
        {/* {claim_id}
        {status_key} */}

        {claimer && <Form.Item label={<FormattedMessage id="proposal.detail.verifyclaims.audit_object" />}>{claimer.username}</Form.Item>}
        <Form.Item label={<FormattedMessage id="proposal.detail.verifyclaims.audit_results" />}>
          {getFieldDecorator('approve', {
            rules: [{ required: true, message: <FormattedMessage id="proposal.detail.verifyclaims.select_audit_results" /> }],
          })(
            <Select placeholder={formatMessage({id:"proposal.detail.verifyclaims.select_audit_results"})}>
              <Option value><FormattedMessage id="proposal.detail.verifyclaims.through" /></Option>
              <Option value={false}><FormattedMessage id="proposal.detail.verifyclaims.not_through" /></Option>
            </Select>,
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

const VerifyClaimModalWrapper = Form.create({
  name: 'verify-claim-modal',
})(VerifyClaimModal);

export default connect(({ loading }) => ({
  submitingVerify: loading.effects['proposal/verifyProposalClaim'],
  submitingVerifyResult: loading.effects['proposal/verifyProposalClaimResult'],
}))(VerifyClaimModalWrapper);
