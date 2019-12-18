import React, { useState, useEffect } from 'react';
import { Typography, Tag, Button, Modal, Spin } from 'antd';
import { GridContent } from '@ant-design/pro-layout';
import { connect } from 'dva';
import Link from 'umi/link';
import styles from './style.less';
import { getFielUrl } from '@/utils/upload';
import defaultCover from '@/assets/default_cover.png';
import UserAvatar from '@/components/User/UserAvatar';
import Comments from './components/Comments';
import moment from '@/utils/moment';
import { isCreatorOrAdmin, isAdmin } from '@/utils/user';

const { Title, Paragraph, Text } = Typography;
const { confirm } = Modal;

const ZoneCover = ({ name, cover }) => {
  let cardCoverSrc = defaultCover;
  if (cover) {
    cardCoverSrc = getFielUrl(cover);
  }

  return (
    <div className={styles.cardCover} style={{ backgroundImage: `url(${cardCoverSrc})` }}>
      {/* <Typography>
        <Title className={styles.titleNo}>{name}</Title>
      </Typography> */}
    </div>
  );
};

const Detail = props => {
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
        return tags.map(t => <Tag>{t}</Tag>);
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

  return (
    <GridContent>
      {isCreatorOrAdmin({ currentUser, detail }) && (
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

      <div className={styles.container}>
        <Spin spinning={fetchDetailLoading}>
          <Typography>
            <div className={styles.summaryCard}>
              <ZoneCover {...detail.zone} />

              <div className={styles.summaryContent}>
                <div className={styles.cardHead}>
                  <div className={styles.left}>
                    <Text>{detail.zone && detail.zone.name}</Text>
                    &nbsp;&nbsp;
                    {detail.zone_proposal_id && <Text>No.{detail.zone_proposal_id}</Text>}
                  </div>
                  <div className={styles.right}>
                    {proposalAmount > 0 && (
                      <span className={styles.proposalAmount}>
                        {proposalAmount}&nbsp;
                        {detail.currency_unit && detail.currency_unit.unit}
                      </span>
                    )}
                  </div>
                </div>
                <Title level={2} className={styles.proposalTitle}>
                  {detail.title}
                </Title>
                <Paragraph>创建时间: {moment.datetime(detail.created)}</Paragraph>
                <Paragraph>{detail.summary}</Paragraph>
                <Tags tag={detail.tag} />
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

            <div className={styles.detail}>
              <Title level={3}>项目详情</Title>
              <Paragraph>
                <div dangerouslySetInnerHTML={{ __html: detail.detail }} />
              </Paragraph>
            </div>

            <div className={styles.comments}>
              <Title level={3}>评论</Title>
              {detail && <Comments id={id} />}
            </div>
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
