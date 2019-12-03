import React, { useState, useEffect } from 'react';
import { Typography } from 'antd';
import { GridContent } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { getFielUrl } from '@/utils/upload';
import defaultCover from '@/assets/default_cover.png';
import styles from './style.less';

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
  const { dispatch, zone_detail, match } = props;

  // get proposal id from url params

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'proposal/fetchProposalZone',
        payload: match.params,
      });
    }
  }, []);

  const { id, name, title, token, summary, vote_rule, vote_addr_weight_json } = zone_detail;

  return (
    <GridContent>
      <div className={styles.container}>
        <Typography>
          <div className={styles.summaryCard}>
            <ZoneCover {...zone_detail} />

            <div className={styles.summaryContent}>
              <h3 className={styles.proposalTitle}>{title}</h3>
              <h3 className={styles.proposalTitle}>{name}</h3>
              <h3 className={styles.proposalTitle}>{token}</h3>
              <Paragraph>{summary}</Paragraph>
            </div>
          </div>

          <div className={styles.detail}>
            <Title level={2}>投票规则</Title>
            <Paragraph>{vote_rule}</Paragraph>
          </div>

          <div className={styles.detail}>
            <Title level={2}>投票地址与权重</Title>
            <Paragraph>{vote_addr_weight_json}</Paragraph>
          </div>
        </Typography>
      </div>
    </GridContent>
  );
};

export default connect(({ proposal }) => ({
  zone_detail: proposal.zone_detail,
}))(Detail);
