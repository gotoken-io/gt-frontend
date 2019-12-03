import React, { useState, useEffect } from 'react';
import { Typography, Tag } from 'antd';
import { PageHeaderWrapper, GridContent } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';
import { getFielUrl } from '@/utils/upload';
import defaultCover from '@/assets/default_cover.png';
import UserAvatar from '@/components/User/UserAvatar';
import Comments from './components/Comments';

const { Title, Paragraph, Text } = Typography;

const ZoneCover = ({ name, cover }) => {
  let cardCoverSrc = defaultCover;
  if (cover) {
    cardCoverSrc = getFielUrl(cover);
  }

  return (
    <div className={styles.cardCover} style={{ backgroundImage: `url(${cardCoverSrc})` }}>
      <Typography>
        <Title className={styles.titleNo}>{name}</Title>
      </Typography>
    </div>
  );
};

const Detail = props => {
  const { dispatch, detail, match } = props;

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

  return (
    <GridContent>
      <div className={styles.container}>
        <Typography>
          <div className={styles.summaryCard}>
            <ZoneCover {...detail.zone} />

            <div className={styles.summaryContent}>
              <div className={styles.cardHead}>
                <div className="left">
                  <Text>No.{detail.id}</Text>
                </div>
                <div className="right">
                  {proposalAmount > 0 && (
                    <Tag color="#2db7f5">
                      {proposalAmount}
                      {detail.currency_unit && detail.currency_unit.unit}
                    </Tag>
                  )}
                </div>
              </div>
              <h3 className={styles.proposalTitle}>{detail.title}</h3>
              <Paragraph>{detail.summary}</Paragraph>
            </div>
          </div>

          <div className={styles.userList}>
            <div className={styles.user}>
              <UserAvatar {...detail.creator} />
              <div className={styles.userContent}>
                <h3>{detail.creator && detail.creator.username}</h3>
                <Text>Creator</Text>
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

export default connect(({ proposal }) => ({
  detail: proposal.detail,
}))(Detail);
