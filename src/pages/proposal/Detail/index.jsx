import React, { useState, useEffect } from 'react';
import { Typography, Tag, Button, Modal, Spin, Tabs, Row, Col, Menu, Dropdown, Icon } from 'antd';
import { GridContent } from '@ant-design/pro-layout';
import Image from '@/components/Image';
import { connect } from 'dva';
import Link from 'umi/link';
import { StickyContainer, Sticky } from 'react-sticky';
import styles from './style.less';
import defaultCover from '@/assets/default_cover.png';
import UserAvatar from '@/components/User/UserAvatar';
import Voting from './components/Voting';

import Comments from './components/Comments';
import moment from '@/utils/moment';
import ChangeStatusModal from './components/ChangeStatusModal';
import Logs from './components/Logs';
import { isCreatorOrAdmin, isAdmin } from '@/utils/user';
import { getStatusTextByKey } from '@/utils/proposal';
import Claims from './components/Claims';
import VoteQrCode from './components/VoteQrCode';
import { FormattedMessage } from 'umi-plugin-react/locale';

const { Title, Paragraph, Text } = Typography;
const { confirm } = Modal;

const { TabPane } = Tabs;

const ZoneCover = ({ name, cover }) => {
  let cardCoverSrc = defaultCover;
  if (cover) {
    cardCoverSrc = cover;
  }

  return (
    <div className={styles.cardCover}>
      <Image name={name} src={cardCoverSrc} size={200} />
    </div>
  );
};

const Detail = props => {
  // states

  // change proposal status modal show
  const [changeStatusModalShow, setChangeStatusModalShow] = useState(false);

  const { dispatch, detail, match, currentUser } = props;

  // get proposal id from url params
  const { id } = match.params;

  const proposalAmount = parseInt(detail.amount, 10);

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'proposal/fetchProposal',
        payload: { id },
      });
    }
  }, []);

  const Tags = ({ tag }) => {
    if (tag) {
      const tags = tag.split(',');
      const tagCount = tags.length;

      if (tagCount) {
        return tags.map(t => <Tag>#{t}</Tag>);
      }
    }

    return null;
  };

  function showDelConfirm() {
    confirm({
      title: (
        <FormattedMessage
          id="proposal.delete.title"
          values={{ zone_name: detail.zone.name, zone_proposal_id: detail.zone_proposal_id }}
        />
      ),
      content: <FormattedMessage id="proposal.detail.comments" />,
      okText: <FormattedMessage id="app.confirm" />,
      cancelText: <FormattedMessage id="app.cancel" />,

      onOk() {
        return new Promise((resolve, reject) => {
          if (dispatch) {
            dispatch({
              type: 'proposal/deleteProposal',
              payload: { id },
            }).then(res => {
              resolve(res);
            });
          }
        });
      },
      onCancel() {},
    });
  }

  const { fetchDetailLoading } = props;
  const { creator, zone } = detail;

  console.log('detail', detail);
  console.log(props);

  const menu = (
    <Menu>
      {isCreatorOrAdmin({ currentUser, creator }) && (
        <Menu.Item key="1">
          <Link to={`/proposal/update/${id}`}>
            <Icon type="form" /> <FormattedMessage id="proposal.detail.update" />
          </Link>
        </Menu.Item>
      )}

      {isAdmin({ currentUser }) && (
        <Menu.Item key="2" onClick={showDelConfirm}>
          <Icon type="close-circle" /> <FormattedMessage id="proposal.detail.delete" />
        </Menu.Item>
      )}
      {isAdmin({ currentUser }) && (
        <Menu.Item key="3" onClick={() => setChangeStatusModalShow(true)}>
          <Icon type="undo" />
          <FormattedMessage id="proposal.detail.modify" />
          <ChangeStatusModal
            {...detail}
            visible={changeStatusModalShow}
            onCancel={() => setChangeStatusModalShow(false)}
          />
        </Menu.Item>
      )}
    </Menu>
  );

  console.log(detail);
  return (
    <GridContent>
      <div className={styles.container}>
        <Spin spinning={fetchDetailLoading}>
          <Typography>
            <div className="margin-l"></div>
            <Row gutter={[16, 16]} type="flex" align="middle">
              <Col lg={{ span: 16, offset: 0 }} xs={{ span: 22, offset: 1 }}>
                <div className={styles.userList}>
                  <Row type="flex" justify="space-between">
                    <Title level={2} className={styles.proposalTitle}>
                      {detail.title}
                    </Title>
                    {isCreatorOrAdmin({ currentUser, creator }) && (
                      <Dropdown overlay={menu}>
                        <Button size="small" className={styles.shezhi}>
                          <Icon type="setting" />
                        </Button>
                      </Dropdown>
                    )}
                  </Row>

                  <Paragraph className={styles.summaryText}>{detail.summary}</Paragraph>

                  <div className={styles.budget}>
                    <Row gutter={[16, 16]}>
                      <Col md={8} xs={24}>
                        <div className={styles.user}>
                          <UserAvatar {...detail.creator} size={48} />
                          <div className="margin-sm"></div>
                          <Row>
                            <span className={styles.weight2}>
                              {detail.creator && detail.creator.username}
                            </span>
                            <br />
                            <FormattedMessage id="proposal.detail.submit_time" />:{' '}
                            {moment.createTime(detail.created)}
                          </Row>
                        </div>
                      </Col>
                      {detail.amount && detail.currency_unit > 0 && (
                        <Col md={4} xs={12}>
                          <div>
                            <div className={styles.weight}>
                              {detail.amount} {detail.currency_unit.unit}
                            </div>
                            <div className={styles.zq}>
                              <FormattedMessage id="proposal.detail.project_budget" />
                            </div>
                          </div>
                        </Col>
                      )}
                      <Col md={6} xs={12}>
                        <div>
                          <div className={styles.weight2}>
                            {(detail.estimated_hours / 24).toFixed(2)}{' '}
                            <FormattedMessage id="app.day" />
                          </div>
                          <div className={styles.zq}>
                            <FormattedMessage id="proposal.detail.max_lifecycle" />
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>

              <Col lg={{ span: 8, offset: 0 }} xs={{ span: 22, offset: 1 }}>
                <div className={styles.userList}>
                  {zone && zone.id == '2' ? (
                    <Voting detail={detail} />
                  ) : (
                    <VoteQrCode detail={detail} />
                  )}
                </div>
              </Col>
            </Row>
            <div className="margin-l"></div>

            <Row>
              <Col lg={{ span: 24, offset: 0 }} xs={{ span: 22, offset: 1 }}>
                <Tabs
                  size="large"
                  className={styles.tabs}
                  animated={false}
                  defaultActiveKey="detail"
                  onChange={() => {}}
                >
                  <TabPane
                    tab={<FormattedMessage id="proposal.detail.details_description" />}
                    key="detail"
                  >
                    <div className={styles.detail}>
                      <div className={styles.describe}>
                        <FormattedMessage id="proposal.detail.submit_time" />
                      </div>
                      <div className={styles.details}>
                        <div className={styles.content}>
                          {/* {details.map((item, index) => {
                            return ( */}
                          <div>
                            <div className={styles.title}>{detail.title}</div>
                            <Paragraph>
                              <div dangerouslySetInnerHTML={{ __html: detail.detail }} />
                            </Paragraph>
                          </div>
                          {/* );
                          })} */}
                        </div>
                      </div>
                    </div>
                  </TabPane>

                  <TabPane
                    tab={<FormattedMessage id="proposal.detail.claims_details" />}
                    key="claims"
                  >
                    <Claims
                      proposal_status_key={detail.status_key}
                      id={id}
                      proposal_creator={creator}
                    />
                  </TabPane>

                  <TabPane
                    tab={<FormattedMessage id="proposal.detail.project_progress" />}
                    key="logs"
                  >
                    <div className={styles.logs}>
                      <Logs id={id} proposal_creator={creator} />
                    </div>
                  </TabPane>

                  <TabPane
                    tab={<FormattedMessage id="proposal.detail.collaboration_kanban" />}
                    key="tasks"
                  >
                    <div className={styles.logs}></div>
                  </TabPane>

                  <TabPane tab={<FormattedMessage id="proposal.detail.comments" />} key="comments">
                    <div className={styles.comments}>{detail && <Comments id={id} />}</div>
                  </TabPane>
                </Tabs>
              </Col>
            </Row>
          </Typography>
        </Spin>
      </div>
    </GridContent>
  );
};

export default connect(({ user, proposal, loading }) => ({
  currentUser: user.currentUser,
  detail: proposal.detail,
  fetchDetailLoading: loading.effects['proposal/fetchProposal'],
}))(Detail);
