import React, { useEffect } from 'react';
import Link from 'umi/link';
import { Pagination, Button, message, Row, Col, Spin } from 'antd';
import { GridContent } from '@ant-design/pro-layout';
import { connect } from 'dva';
import router from 'umi/router';
import { getPageQuery } from '@/utils/utils';
import Item from '@/components/Proposal/Item';
import Filter from './components/Filter';
import styles from './style.less';

const List = props => {
  const {
    dispatch,
    proposal_list,
    zone_list,
    match,
    currentUser,
    fetchProposalListLoading,
    fetchProposalZoneLoading,
  } = props;

  const { zone_id } = match.params;

  // useEffect(() => {
  //   if (dispatch) {
  //     const params = getPageQuery();

  //     console.log('params', params);

  //     dispatch({
  //       type: 'proposal/fetchAllProposal',
  //       payload: { ...params },
  //     });
  //   }
  // }, []);

  useEffect(() => {
    console.log('match', match);

    const params = getPageQuery();
    console.log('params', params);

    if (dispatch) {
      dispatch({
        type: 'proposal/fetchAllProposalZone',
      });

      dispatch({
        type: 'proposal/fetchAllProposal',
        payload: { ...match.params, ...params },
      });
    }
  }, [match.params]);

  const handleCreateProposal = () => {
    if (currentUser.id) {
      router.push('/proposal/create');
    } else {
      message.error('请先登陆');
    }
  };

  const handleFetchProposals = page => {
    router.push({
      pathname: match.url,
      query: {
        page,
      },
    });
  };

  return (
    <GridContent>
      <div className={styles.filter}>
        <Spin spinning={fetchProposalZoneLoading}>
          <Filter zone_list={zone_list} />
        </Spin>
      </div>

      <div className={styles.actions}>
        <Button onClick={handleCreateProposal} type="primary">
          创建提案
        </Button>
      </div>
      <Spin spinning={fetchProposalListLoading}>
        <div className={styles.list}>
          <Row>
            {proposal_list.items.map(item => (
              <Col md={8} sm={24}>
                <Item key={item.id} {...item} />
              </Col>
            ))}
          </Row>
        </div>
      </Spin>

      <Spin spinning={fetchProposalListLoading}>
        <div className={styles.pagination}>
          <Pagination
            defaultCurrent={1}
            current={proposal_list.page}
            pageSize={proposal_list.per_page}
            total={proposal_list.total}
            onChange={handleFetchProposals}
          />
        </div>
      </Spin>
    </GridContent>
  );
};

export default connect(({ user, proposal, loading }) => ({
  currentUser: user.currentUser,
  proposal_list: proposal.proposal_list,
  zone_list: proposal.zone_list,
  fetchProposalZoneLoading: loading.effects['proposal/fetchAllProposalZone'],
  fetchProposalListLoading: loading.effects['proposal/fetchAllProposal'],
}))(List);
