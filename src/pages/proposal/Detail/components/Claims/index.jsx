import React, { useState, useEffect } from 'react';
import { Spin, Button, Card, Row, Col, Modal, Tag, Divider } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import moment from '@/utils/moment';
import { getClaimStatusByKey, isClaimer, isClaimerByStatus } from '@/utils/proposal_claim';
import { isCreatorOrAdmin, isAdmin } from '@/utils/user';
import UserAvatar from '@/components/User/UserAvatar';
import ClaimModal from '../ClaimModal';
import VerifyClaimModal from '../VerifyClaimModal';
import SubmitClaimResultModal from '../SubmitClaimResultModal';

import styles from './style.less';

const { confirm } = Modal;

const { Meta } = Card;

const Claims = props => {
  // state
  const [claimModalVisible, setClaimModalVisible] = useState(false);
  const [submitClaimResultModalVisible, setSubmitClaimResultModalVisible] = useState(false);

  // verify
  const [verifyClaimId, setVerifyClaimId] = useState();
  const [verifyClaimer, setVerifyClaimer] = useState();
  const [verifyClaimStatus, setVerifyClaimStatus] = useState();
  const [verifyClaimModalVisible, setVerifyClaimModalVisible] = useState(false);

  const { id, claims, loading, proposal_creator, currentUser } = props;

  useEffect(() => {
    const { dispatch } = props;
    if (dispatch) {
      dispatch({
        type: 'proposal/queryProposalClaims',
        payload: {
          id,
        },
      });
    }
  }, []);

  function handleVerify({ claim_id, claimer, status_key }) {
    setVerifyClaimId(claim_id);
    setVerifyClaimer(claimer);
    setVerifyClaimStatus(status_key);
    // console.log(claim_id, claimer, status_key);
    if (claim_id && claimer && status_key) {
      setVerifyClaimModalVisible(true);
    }
  }

  const ClaimItem = ({ claim_id, claimer, reason, status_key, result }) => (
    <Card>
      <Meta
        className={styles['claim-item']}
        avatar={<UserAvatar {...claimer} />}
        title={
          <div className={styles.head}>
            <span>{claimer.username}</span>
            <span className={styles.status}>
              <Tag color={getClaimStatusByKey(status_key).color}>
                {getClaimStatusByKey(status_key).text}
              </Tag>
            </span>
            {isAdmin({ currentUser }) && (
              <span className={styles.actions}>
                {status_key !== 'cancel' && (
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => handleVerify({ claim_id, claimer, status_key })}
                  >
                    审核
                  </Button>
                )}
              </span>
            )}
          </div>
        }
        description={
          <div className={styles.claimContent}>
            <div className={styles.reason}>
              <Divider>申领理由</Divider>
              <p className={styles.reasonText}>{reason}</p>
            </div>

            {result && (
              <div className={styles.result}>
                <Divider>提交结果</Divider>
                <p className={styles.resultText}>{result}</p>
              </div>
            )}
          </div>
        }
      />
    </Card>
  );

  function showCancelClaimConfirm() {
    confirm({
      title: '确定要取消申领此提案吗?',
      //   content: 'Some descriptions',
      okText: '确定',
      okType: 'danger',
      cancelText: '关闭',
      onOk() {
        handleCancelClaim();
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  function handleCancelClaim() {
    const { dispatch } = props;
    if (dispatch) {
      dispatch({
        type: 'proposal/cancelClaimProposal',
        payload: {
          proposal_id: id,
        },
      });
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.actions}>
        {isClaimer(claims, currentUser) === false && (
          <>
            <Button type="primary" onClick={() => setClaimModalVisible(true)}>
              申领
            </Button>
            <ClaimModal
              id={id}
              visible={claimModalVisible}
              onCancel={() => setClaimModalVisible(false)}
            />
          </>
        )}

        {isClaimerByStatus(claims, currentUser, ['claiming']) === true && (
          <Button type="primary" onClick={showCancelClaimConfirm}>
            取消申领
          </Button>
        )}
        {/* 可提交结果, 状态包括:申领通过, 结果提交中, 结果审核失败 */}
        {isClaimerByStatus(claims, currentUser, ['passed', 'submit_result', 'result_fail']) ===
          true && (
          <>
            <Button type="primary" onClick={() => setSubmitClaimResultModalVisible(true)}>
              提交结果
            </Button>
            <SubmitClaimResultModal
              id={id}
              visible={submitClaimResultModalVisible}
              onCancel={() => setSubmitClaimResultModalVisible(false)}
            />
          </>
        )}

        <VerifyClaimModal
          claim_id={verifyClaimId}
          claimer={verifyClaimer}
          status_key={verifyClaimStatus}
          visible={verifyClaimModalVisible}
          onCancel={() => setVerifyClaimModalVisible(false)}
        />
      </div>

      <Spin spinning={loading}>
        {claims.length > 0 ? (
          <div className={styles.list}>
            <Row gutter={[16, 16]}>
              {claims.map(
                d =>
                  d.status_key !== 'cancel' && (
                    <Col md={12} sm={24}>
                      <ClaimItem {...d} />
                    </Col>
                  ),
              )}
            </Row>
          </div>
        ) : (
          <div className={styles.nodata}>当前无人申领</div>
        )}
      </Spin>
    </div>
  );
};

export default connect(({ user, proposal, loading }) => ({
  currentUser: user.currentUser,
  claims: proposal.claims,
  loading: loading.effects['proposal/queryProposalClaims'],
}))(Claims);
