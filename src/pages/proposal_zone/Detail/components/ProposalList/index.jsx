import React, { useEffect } from 'react';
import Link from 'umi/link';
import { Pagination, Button, message, Row, Col, Spin } from 'antd';
import { GridContent } from '@ant-design/pro-layout';
import { connect } from 'dva';
import router from 'umi/router';
import { getPageQuery } from '@/utils/utils';
import Item from '@/components/Proposal/Item';
import Filter from '@/components/Proposal/Filter';
import styles from './style.less';

const ProposalList = props => {
  const { dispatch, proposal_list, match, loading } = props;

  useEffect(() => {
    console.log('match', match);

    const params = getPageQuery();
    console.log('params', params);

    const zone_id = match.params.id;

    if (dispatch) {
      const payload = {
        zone_id,
        ...match.params,
        ...params,
      };

      if (zone_id) {
        console.log('payload', payload);

        dispatch({
          type: 'proposal/fetchAllProposal',
          payload,
        });
      }
    }
  }, [window.location.href]);

  const handleFetchProposals = page => {
    const params = getPageQuery();

    const routeQuery = {
      ...params,
      page,
    };

    console.log(routeQuery);

    router.push({
      pathname: window.location.pathname,
      query: routeQuery,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.filter}>
        <Filter zone_id={match.params.id} match={match} />
      </div>

      <Spin spinning={loading}>
        <div className={styles.list}>
          <Row>
            {proposal_list.items.map(item => (
              <Col md={8} sm={24}>
                <Item key={item.id} {...item} />
              </Col>
            ))}
          </Row>
        </div>

        {proposal_list.items.length > 0 && (
          <div className={styles.pagination}>
            <Pagination
              defaultCurrent={1}
              current={proposal_list.page}
              pageSize={proposal_list.per_page}
              total={proposal_list.total}
              onChange={handleFetchProposals}
            />
          </div>
        )}
      </Spin>
    </div>
  );
};

export default connect(({ proposal, loading }) => ({
  proposal_list: proposal.proposal_list,
  loading: loading.effects['proposal/fetchAllProposal'],
}))(ProposalList);
