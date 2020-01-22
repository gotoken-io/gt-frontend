import React, { useState, useEffect } from 'react';
import { Card, Col, Divider, Icon, Input, Row, Spin } from 'antd';
import { GridContent } from '@ant-design/pro-layout';
import Link from 'umi/link';
import { connect } from 'dva';
import ProposalList from './components/ProposalList';
import UserAvatar from '@/components/User/UserAvatar';
import styles from './style.less';

const AccountCenter = props => {
  const { userDetail, userDetailLoading, proposals, fetchUserProposals } = props;
  const [tabKey, setTabKey] = useState('created');
  const dataLoading = userDetailLoading || !(userDetail && Object.keys(userDetail).length);

  useEffect(() => {
    const { dispatch, match } = props;
    if (dispatch) {
      dispatch({
        type: 'user/fetchUserDetail',
        payload: match.params,
      });

      dispatch({
        type: 'user/fetchUserProposals',
        payload: { ...match.params, p_type: tabKey },
      });
    }
  }, []);

  const onTabChange = key => {
    // If you need to sync state to url
    // const { match } = this.props;
    // router.push(`${match.url}/${key}`);
    setTabKey(key);
  };

  const renderChildrenByTabKey = () => (
    <Spin spinning={fetchUserProposals}>
      <ProposalList data={proposals[tabKey]} />
    </Spin>
  );

  const operationTabList = () => [
    {
      key: 'created',
      tab: `创建的提案(${proposals.created.items.length})`,
    },
  ];

  return (
    <GridContent>
      <Row gutter={24}>
        <Col lg={7} md={24}>
          <Card
            bordered={false}
            style={{
              marginBottom: 24,
            }}
            loading={dataLoading}
          >
            {!dataLoading && (
              <div>
                <div className={styles.avatarHolder}>
                  <UserAvatar size={100} {...userDetail} />
                  <div className={styles.name}>用户名：{userDetail.username}</div>
                  {userDetail.nickname && (
                    <div className={styles.nickname}>昵称：{userDetail.nickname}</div>
                  )}
                  {userDetail.sign && (
                    <div className={styles.sign}>
                      <p>{userDetail.sign}</p>
                    </div>
                  )}
                </div>
                {/* <div className={styles.detail}>
                  </div> */}
              </div>
            )}
          </Card>
        </Col>
        <Col lg={17} md={24}>
          <Card
            className={styles.tabsCard}
            bordered={false}
            tabList={operationTabList()}
            activeTabKey={tabKey}
            onTabChange={onTabChange}
          >
            {renderChildrenByTabKey(tabKey)}
          </Card>
        </Col>
      </Row>
    </GridContent>
  );
};

export default connect(({ user, loading }) => ({
  userDetail: user.userDetail,
  proposals: user.proposals,
  fetchUserProposals: loading.effects['user/fetchUserProposals'],
  userDetailLoading: loading.effects['user/fetchUserDetail'],
}))(AccountCenter);
