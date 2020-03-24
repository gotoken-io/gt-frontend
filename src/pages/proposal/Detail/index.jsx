import React, { useState, useEffect } from 'react';
import { Typography, Tag, Button, Modal, Spin, Tabs, Row, Col } from 'antd';
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
      title: `确定删除提案 ${detail.zone.name} No.${detail.zone_proposal_id}?`,
      content: '点击确定后，提案将删除',
      okText: '确认',
      cancelText: '取消',

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
      onCancel() { },
    });
  }

  const details = [
    {
      title: "这里是标题",
      contents: "我们大胆奥纠结啊啊啊那看看是萨拉南卡买啊那大胆阿訇 纳丹嗲很大"
    },
    {
      title: "这里是标题2",
      contents: "我们大胆奥纠结啊啊啊那看看是萨拉南卡买啊那大胆阿訇 纳丹嗲很大"
    },
    {
      title: "这里是标题3",
      contents: "我们大胆奥纠结啊啊啊那看看是萨拉南卡买啊那大胆阿訇 纳丹嗲很大"
    }
  ]


  const { fetchDetailLoading } = props;
  const { creator, zone } = detail;
  console.log(detail);
  return (
    <GridContent>
      {isCreatorOrAdmin({ currentUser, creator }) && (
        <Link to={`/proposal/update/${id}`}>
          <Button type="primary" className={styles.actionsBtn}>
            修改提案
          </Button>
        </Link>
      )}

      {isAdmin({ currentUser }) && (
        <Button type="danger" className={styles.actionsBtn} onClick={showDelConfirm}>
          删除提案
        </Button>
      )}

      {isAdmin({ currentUser }) && (
        <>
          <Button className={styles.actionsBtn} onClick={() => setChangeStatusModalShow(true)}>
            修改提案状态
          </Button>
          <ChangeStatusModal
            {...detail}
            visible={changeStatusModalShow}
            onCancel={() => setChangeStatusModalShow(false)}
          />
        </>
      )}

      <div className={styles.container}>
        <Spin spinning={fetchDetailLoading}>
          <Typography>
            {/* <div className={styles.summaryCard}>
              <ZoneCover {...zone} />

              <div className={styles.summaryContent}>
                <div className={styles.cardHead}>
                  <div className={styles.left}>
                    <Text>{zone && zone.name}</Text>
                    &nbsp;&nbsp;
                    {detail.zone_proposal_id && <Text>No.{detail.zone_proposal_id}</Text>}
                  </div>
                  <div className={styles.right}>
                    {proposalAmount > 0 && (
                      <span
                        style={zone.theme_color && { backgroundColor: zone.theme_color }}
                        className={styles.proposalAmount}
                      >
                        {proposalAmount.toLocaleString()}&nbsp;
                        {detail.currency_unit && detail.currency_unit.unit}
                      </span>
                    )}
                  </div>
                </div>


                {detail.status_key && (
                  <div className={styles.status}>
                    <span className={styles[detail.status_key]}>
                      {getStatusTextByKey(detail.status_key)}
                    </span>
                  </div>
                )}

                {detail.category && detail.category.id && (
                  <span className={styles.category}>
                    <Tag>{detail.category.name}</Tag>
                  </span>
                )}

                


                <div>
                  标签:&nbsp;
                  <Tags tag={detail.tag} />
                </div>
              </div>
            </div> */}
            <Row>
              <Col span={17}>
                <div className={styles.userList}>
                  <Title level={2} className={styles.proposalTitle}>
                    {detail.title}
                  </Title>
                  <Paragraph className={styles.summaryText}>{detail.summary}</Paragraph>
                  <div className={styles.budget}>
                    <div>
                      <div className={styles.weight}>{detail.amount}GOO</div>
                      <div className={styles.zq}>项目预算</div>
                    </div>
                    <div>
                      <div className={styles.weight2}>{(detail.estimated_hours) / 24}天</div>
                      <div className={styles.zq}>最大执行周期</div>
                    </div>
                    <div className={styles.user}>
                      <UserAvatar {...detail.creator} />
                      <div className={styles.userContent}>
                        <Title level={4}>{detail.creator && detail.creator.username}</Title>
                        <Paragraph className={styles.createtime}>
                          提交时间: {moment.createTime(detail.created)}
                        </Paragraph>
                        {/* <Text>创建人</Text> */}
                      </div>
                    </div>
                  </div>

                </div>
                <Tabs size="large" className={styles.tabs} animated={false} defaultActiveKey="detail" onChange={() => { }}>
                  <TabPane tab="详情描述" key="detail">
                    <div className={styles.detail}>
                      <div className={styles.describe}>详情描述</div>
                      <div className={styles.details}>

                        <div className={styles.content}>
                          {
                            details.map((item, index) => {
                              return <div key={index}>
                                <div className={styles.title}>{detail.title}</div>
                                <Paragraph>
                                  <div dangerouslySetInnerHTML={{ __html: detail.detail }} />
                                </Paragraph>
                              </div>
                            })
                          }

                        </div>
                      </div>

                    </div>
                  </TabPane>

                  <TabPane tab="申领详情" key="claims">
                    <Claims
                      proposal_status_key={detail.status_key}
                      id={id}
                      proposal_creator={creator}
                    />
                  </TabPane>

                  <TabPane tab="项目进度" key="logs">
                    <div className={styles.logs}>
                      <Logs id={id} proposal_creator={creator} />
                    </div>
                  </TabPane>

                  <TabPane tab="协作看板" key="tasks">
                    <div className={styles.logs}>

                    </div>
                  </TabPane>

                  <TabPane tab="评论" key="comments">
                    <div className={styles.comments}>{detail && <Comments id={id} />}</div>
                  </TabPane>
                </Tabs>
              </Col>

              <Col span={6} offset={1}>
                <div className={styles.userList}>
                  {zone && zone.id == '2' ? (
                    <Voting detail={detail} />
                  ) : (
                      <VoteQrCode detail={detail} />
                    )}
                </div>
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
