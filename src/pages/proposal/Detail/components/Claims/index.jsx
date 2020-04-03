import React, { useState, useEffect } from 'react';
import { Spin, Button, Card, Row, Col, Modal, Tag, Divider } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import moment from '@/utils/moment';
import { getClaimStatusByKey, isClaimer, isClaimerByStatus } from '@/utils/proposal_claim';
import { isCreatorOrAdmin, isAdmin } from '@/utils/user';
import UserAvatar from '@/components/User/UserAvatar';
import ClaimModal from '../ClaimModal';
import ClaimTeamModal from '../ClaimTeamModal';
import VerifyClaimModal from '../VerifyClaimModal';
import SubmitClaimResultModal from '../SubmitClaimResultModal';
import AvatarList from '@/components/User/AvatarList';
import styles from './style.less';
import { FormattedMessage } from 'umi-plugin-react/locale';

const { confirm } = Modal;

const { Meta } = Card;

const Claims = props => {
  // state
  const [claimModalVisible, setClaimModalVisible] = useState(false);
  const [claimTeamModalVisible, setClaimTeamModalVisible] = useState(false);

  const [submitClaimResultModalVisible, setSubmitClaimResultModalVisible] = useState(false);

  // verify
  const [verifyClaimId, setVerifyClaimId] = useState();
  const [verifyClaimer, setVerifyClaimer] = useState();
  const [verifyClaimStatus, setVerifyClaimStatus] = useState();
  const [verifyClaimModalVisible, setVerifyClaimModalVisible] = useState(false);

  const { id, claims, loading, proposal_creator, currentUser, proposal_status_key } = props;

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

  const ClaimItem = ({ claim_id, claimer, reason, status_key, result, plan, team }) => (
    <Card className={styles['claim-item']}>
      <Row>
        <Col span={12}>
          <div className={styles.user}>
            <UserAvatar {...claimer} size={48} />
            <div className="margin-sm"></div>
            <Row>
              <span className="subtitle"><FormattedMessage id="proposal.detail.claims.head" /></span>
              <br />
              <span>{claimer.username}</span>
            </Row>
          </div>
        </Col>
        <Col>
          <Row type="flex" justify="end">
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
                    <FormattedMessage id="proposal.detail.claims.audit" />
                  </Button>
                )}
              </span>
            )}
          </Row>
        </Col>
      </Row>
      <div className="margin-l" />
      <div className={styles.claimContent}>
        <div className={styles.reason}>
          <p className={styles.reasonText}>
            <span className="highlight"><FormattedMessage id="proposal.claims_reason" />：</span>
            {reason}
          </p>
          <div className="margin-l" />
          {plan && (
            <p className={styles.reasonText}>
              <span className="highlight"><FormattedMessage id="proposal.detail.claims.claims_plan" />：</span>
              {plan}
            </p>
          )}
        </div>

        {result && (
          <div className={styles.result}>
            <Divider><FormattedMessage id="proposal.submit_results" /></Divider>
            <p className={styles.resultText}>{result}</p>
          </div>
        )}
      </div>
      <div>
        {team ? (
          <>
            <span> <FormattedMessage id="proposal.detail.claims.team_members" /></span>
            <div className="margin" />
            <AvatarList userList={team.slice(1).map(teamInfo => teamInfo.staff)} showMax={10} />
          </>
        ) : (
          undefined
        )}
      </div>
    </Card>
  );

  function showCancelClaimConfirm() {
    confirm({
      title: <FormattedMessage id="proposal.detail.claims.confirm_cancel" />,
      //   content: 'Some descriptions',
      okText: <FormattedMessage id="app.confirm" />,
      okType: 'danger',
      cancelText: <FormattedMessage id="app.shutdown" />,
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
  console.log({ claims });
  return (
    <div className={styles.container}>
      <div className={styles.actions}>
        <div className="margin-l"></div>
        {isClaimer(claims, currentUser) === false && proposal_status_key === 'claiming' && (
          <>
            <Button type="primary" size="small" onClick={() => setClaimModalVisible(true)}>
            <FormattedMessage id="proposal.detail.claims.claims" />
            </Button>
            <ClaimModal
              id={id}
              visible={claimModalVisible}
              onCancel={() => setClaimModalVisible(false)}
            />
          </>
        )}

        {isClaimerByStatus(claims, currentUser, ['claiming']) === true && (
          <Button.Group>
            <Button type="primary" size="small" onClick={showCancelClaimConfirm}>
            <FormattedMessage id="proposal.detail.claims.claims_cancel" />
            </Button>
            <Button type="primary" size="small" onClick={() => setClaimTeamModalVisible(true)}>
              <FormattedMessage id="proposal.detail.claims.join" />
            </Button>
            <ClaimTeamModal
              id={id}
              visible={claimTeamModalVisible}
              claim={claims.find(claim => claim.user_id == currentUser.id)}
              onCancel={() => setClaimTeamModalVisible(false)}
            />
          </Button.Group>
        )}
        {/* 可提交结果, 状态包括:申领通过, 结果提交中, 结果审核失败 */}
        {isClaimerByStatus(claims, currentUser, ['passed', 'submit_result', 'result_fail']) ===
          true && (
          <>
            <Button
              type="primary"
              size="small"
              onClick={() => setSubmitClaimResultModalVisible(true)}
            >
               <FormattedMessage id="proposal.submit_results" />
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
                    <Col md={8} sm={24}>
                      <ClaimItem {...d} />
                    </Col>
                  ),
              )}
            </Row>
          </div>
        ) : (
          <div className={styles.nodata}><FormattedMessage id="proposal.detail.claims.no_claims" />
          </div>
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
