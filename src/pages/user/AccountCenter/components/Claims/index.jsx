import React, { useState, useEffect } from 'react';
import { Spin, Card, Row, Col, Modal, Tag } from 'antd';
import { connect } from 'dva';
import ProposalItem from '@/components/Proposal/Item';
import styles from './style.less';
import { FormattedMessage } from 'umi-plugin-react/locale';

const { Meta } = Card;

const Claims = props => {
  const { loading, proposal_claims, username, page } = props;

  useEffect(() => {
    const { dispatch } = props;
    if (dispatch) {
      dispatch({
        type: 'user/queryUserProposalClaims',
        payload: { username, page },
      });
    }
  }, []);

  return (
    <div className={styles.container}>
      <Spin spinning={loading}>
        {proposal_claims.items.length > 0 ? (
          <div className={styles.list}>
            <Row gutter={[16, 16]}>
              {proposal_claims.items.map(
                d =>
                  d.status_key !== 'cancel' && (
                    <Col md={12} sm={24}>
                      <ProposalItem {...d.proposal} claim={d} />
                    </Col>
                  ),
              )}
            </Row>
          </div>
        ) : (
          <div className={styles.nodata}>
            <FormattedMessage id="user.claims.noData" />
          </div>
        )}
      </Spin>
    </div>
  );
};

export default connect(({ user, loading }) => ({
  currentUser: user.currentUser,
  proposal_claims: user.proposal_claims,
  loading: loading.effects['user/queryUserProposalClaims'],
}))(Claims);
