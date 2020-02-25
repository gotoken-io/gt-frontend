import React, { useEffect } from 'react';
import { Row, Col, Spin } from 'antd';
import { connect } from 'dva';
import Item from '@/components/Proposal/Item';
import styles from './style.less';

const ProposalList = props => {
  const { proposals, fetchUserProposals, dispatch, username, p_type } = props;

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchUserProposals',
        payload: { username, p_type },
      });
    }
  }, []);

  return (
    <div className={styles.container}>
      <Spin spinning={fetchUserProposals}>
        {proposals[p_type].items.length > 0 ? (
          <Row>
            {proposals[p_type].items.map(item => (
              <Col lg={12} md={24}>
                <Item {...item} />
              </Col>
            ))}
          </Row>
        ) : (
          <div className={styles.nodata}>还没有创建任何提案</div>
        )}
      </Spin>
    </div>
  );
};

export default connect(({ user, loading }) => ({
  proposals: user.proposals,
  fetchUserProposals: loading.effects['user/fetchUserProposals'],
}))(ProposalList);
