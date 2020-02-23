import React, { useState, useEffect } from 'react';
import { Typography, Tag, Button, Modal, Spin, Tabs } from 'antd';
import { GridContent } from '@ant-design/pro-layout';
import Image from '@/components/Image';
import { connect } from 'dva';
import Link from 'umi/link';
import { StickyContainer, Sticky } from 'react-sticky';
import styles from './style.less';
import defaultCover from '@/assets/default_cover.png';
import UserAvatar from '@/components/User/UserAvatar';
import Comments from './components/Comments';
import moment from '@/utils/moment';
import ChangeStatusModal from './components/ChangeStatusModal';
import Logs from './components/Logs';
import { isCreatorOrAdmin, isAdmin } from '@/utils/user';
import { getStatusTextByKey } from '@/utils/proposal';
import Claims from './components/Claims';

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
      onCancel() {},
    });
  }

  const { fetchDetailLoading } = props;
  const { creator, zone } = detail;

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
            <div className={styles.summaryCard}>
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
                <Title level={2} className={styles.proposalTitle}>
                  {detail.title}
                </Title>

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

                <Paragraph className={styles.createtime}>
                  创建时间: {moment.datetime(detail.created)}
                </Paragraph>
                <Paragraph className={styles.summaryText}>{detail.summary}</Paragraph>

                <div>
                  标签:&nbsp;
                  <Tags tag={detail.tag} />
                </div>
              </div>
            </div>

            <div className={styles.userList}>
              <div className={styles.user}>
                <UserAvatar {...detail.creator} />
                <div className={styles.userContent}>
                  <Title level={3}>{detail.creator && detail.creator.username}</Title>
                  <Text>创建人</Text>
                </div>
              </div>
            </div>

            <Tabs size="large" animated={false} defaultActiveKey="detail" onChange={() => {}}>
              <TabPane tab="提案详情" key="detail">
                <div className={styles.detail}>
                  <div className={styles.content}>
                    <Paragraph>
                      <div dangerouslySetInnerHTML={{ __html: detail.detail }} />
                    </Paragraph>
                  </div>
                </div>
              </TabPane>

              <TabPane tab="提案日志" key="logs">
                <div className={styles.logs}>
                  <Logs id={id} proposal_creator={creator} />
                </div>
              </TabPane>
              <TabPane tab="申领" key="claims">
                <Claims id={id} proposal_creator={creator} />
              </TabPane>
              <TabPane tab="评论" key="comments">
                <div className={styles.comments}>{detail && <Comments id={id} />}</div>
              </TabPane>
            </Tabs>
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
