import React, { useState, useEffect } from 'react';
import { Spin, Button, Card, Row, Col, Modal } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import moment from '@/utils/moment';
import {
  getProposalEventByKey,
  getProposalEventTextByKey,
  getStatusTextByKey,
} from '@/utils/proposal';
import { isCreatorOrAdmin, isAdmin } from '@/utils/user';
import UserAvatar from '@/components/User/UserAvatar';
import ClaimModal from '../ClaimModal';
import { isClaimer } from '@/utils/proposal_claim';
import styles from './style.less';

const { confirm } = Modal;

const { Meta } = Card;

const ClaimItem = ({ claimer, reason }) => (
  <Card>
    <Meta
      avatar={<UserAvatar {...claimer} />}
      title={claimer.username}
      description={
        <div className={styles.reason}>
          <p className={styles.subtitle}>申领理由:</p>
          <p>{reason}</p>
        </div>
      }
    />
  </Card>
);

const Claims = props => {
  // state
  const [claimModalVisible, setClaimModalVisible] = useState(false);

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
                      <ClaimItem claimer={d.claimer} reason={d.reason} />
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
