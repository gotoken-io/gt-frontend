import React, { useEffect } from 'react';
import { Card, Col, Tabs, Row } from 'antd';
import { GridContent } from '@ant-design/pro-layout';
import { connect } from 'dva';
import ProposalList from './components/ProposalList';
import Claims from './components/Claims';

import UserAvatar from '@/components/User/UserAvatar';
import styles from './style.less';

const { TabPane } = Tabs;

const AccountCenter = props => {
  const { userDetail, fetchUserDetail, match } = props;

  useEffect(() => {
    const { dispatch } = props;
    if (dispatch) {
      dispatch({
        type: 'user/fetchUserDetail',
        payload: match.params,
      });
    }
  }, []);

  return (
    <GridContent>
      <Row gutter={24}>
        {/* user base info */}
        <Col lg={7} md={24}>
          <Card
            bordered={false}
            style={{
              marginBottom: 24,
            }}
            loading={fetchUserDetail}
          >
            {!fetchUserDetail && (
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
              </div>
            )}
          </Card>
        </Col>
        <Col lg={17} md={24}>
          <Tabs size="large" animated={false} defaultActiveKey="detail" onChange={() => {}}>
            <TabPane tab="创建的提案" key="created">
              <ProposalList username={match.params.username} p_type="created" />
            </TabPane>

            <TabPane tab="申领的提案" key="claim">
              <Claims username={match.params.username} page={match.params.page} />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </GridContent>
  );
};

export default connect(({ user, loading }) => ({
  userDetail: user.userDetail,
  fetchUserDetail: loading.effects['user/fetchUserDetail'],
}))(AccountCenter);
