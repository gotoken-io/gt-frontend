import React, { useState, useEffect } from 'react';
import { Typography, Tag, Button } from 'antd';
import { GridContent } from '@ant-design/pro-layout';
import { connect } from 'dva';
import Link from 'umi/link';
import styles from './style.less';
import { getFielUrl } from '@/utils/upload';
import defaultCover from '@/assets/default_cover.png';
import UserAvatar from '@/components/User/UserAvatar';
import Comments from './components/Comments';
import moment from '@/utils/moment';
import { isCreatorOrAdmin } from '@/utils/user';

const { Title, Paragraph, Text } = Typography;

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

  return (
    <GridContent>
      {isCreatorOrAdmin({ currentUser, detail }) && (
        <Link to={`/proposal/update/${id}`}>
          <Button type="primary" className={styles.edit}>
            修改提案
          </Button>
        </Link>
      )}

      <div className={styles.container}>
        <Typography>
          <div className={styles.summaryCard}>
            <ZoneCover {...detail.zone} />

            <div className={styles.summaryContent}>
              <div className={styles.cardHead}>
                <div className={styles.left}>
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
              <h3 className={styles.proposalTitle}>{detail.title}</h3>
              <Paragraph>创建时间: {moment.datetime(detail.created)}</Paragraph>
              <Paragraph>{detail.summary}</Paragraph>
              <Tags tag={detail.tag} />
            </div>
          </div>

          <div className={styles.userList}>
            <div className={styles.user}>
              <UserAvatar {...detail.creator} />
              <div className={styles.userContent}>
                <h3>{detail.creator && detail.creator.username}</h3>
                <Text>创建人</Text>
              </div>
            </div>
          </div>

          <div className={styles.detail}>
            <Title level={2}>项目详情</Title>
            <Paragraph>
              <div dangerouslySetInnerHTML={{ __html: detail.detail }} />
            </Paragraph>
          </div>

          <div className={styles.comments}>
            <Title level={2}>评论</Title>
            {detail && <Comments id={id} />}
          </div>
        </Typography>
      </div>
    </GridContent>
  );
};

export default connect(({ user, proposal }) => ({
  currentUser: user.currentUser,
  detail: proposal.detail,
}))(Detail);
