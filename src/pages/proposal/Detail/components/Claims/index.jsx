import React, { useState, useEffect } from 'react';
import { Spin, Button, Card, Row, Col, Modal, Tag } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import moment from '@/utils/moment';
import { getClaimStatusByKey, isClaimer } from '@/utils/proposal_claim';
import { isCreatorOrAdmin, isAdmin } from '@/utils/user';
import UserAvatar from '@/components/User/UserAvatar';
import ClaimModal from '../ClaimModal';
import VerifyClaimModal from '../VerifyClaimModal';

import styles from './style.less';

const { confirm } = Modal;

const { Meta } = Card;

const Claims = props => {
  // state
  const [claimModalVisible, setClaimModalVisible] = useState(false);
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

  const ClaimItem = ({ claim_id, claimer, reason, status_key }) => (
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
                    onClick={() => setVerifyClaimModalVisible(true)}
                  >
                    审核
                  </Button>
                )}

                <VerifyClaimModal
                  claim_id={claim_id}
                  visible={verifyClaimModalVisible}
                  onCancel={() => setVerifyClaimModalVisible(false)}
                />
              </span>
            )}
          </div>
        }
        description={
          <div className={styles.reason}>
            <p className={styles.subtitle}>申领理由:</p>
            <p>{reason}</p>
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

        {isClaimer(claims, currentUser) === true && (
          <Button type="primary" onClick={showCancelClaimConfirm}>
            取消申领
          </Button>
        )}
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
