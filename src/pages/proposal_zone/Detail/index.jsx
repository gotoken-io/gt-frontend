import React, { useState, useEffect } from 'react';
import { Typography, Button, Modal, Spin } from 'antd';
import Image from '@/components/Image';
import { GridContent } from '@ant-design/pro-layout';
import { connect } from 'dva';
import Link from 'umi/link';
import { getFielUrl } from '@/utils/upload';
import defaultCover from '@/assets/default_cover.png';
import styles from './style.less';

const { Title, Paragraph, Text } = Typography;
const { confirm } = Modal;

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
  const { dispatch, zone_detail, match, currentUser } = props;

  // get proposal id from url params

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'proposal/fetchProposalZone',
        payload: match.params,
      });
    }
  }, []);

  const handleDelete = e => {
    e.preventDefault();

    confirm({
      title: `确定删除提案专区: ${zone_detail.name} ?`,
      content: '点击确定后，提案专区及其下的提案将一并删除',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        return new Promise((resolve, reject) => {
          if (dispatch) {
            dispatch({
              type: 'proposal/deleteProposalZone',
              payload: match.params,
            }).then(res => {
              resolve(res);
            });
          }
        });
      },
      onCancel() {},
    });
  };

  const { id, name, title, token, summary, detail, vote_rule, vote_addr_weight_json } = zone_detail;
  const { fetchProposalZoneLoading, delProposalZoneLoading } = props;

  return (
    <GridContent>
      {currentUser.admin && (
        <div className={styles.actionBtn}>
          <Link to={`/proposal/zone/update/${id}`}>
            <Button type="primary">编辑</Button>
          </Link>
          <Button onClick={handleDelete} type="danger">
            删除
          </Button>
        </div>
      )}

      <Spin spinning={fetchProposalZoneLoading}>
        <div className={styles.container}>
          <Typography>
            <div className={styles.summaryCard}>
              <ZoneCover {...zone_detail} />

              <div className={styles.summaryContent}>
                <Title level={1}>{title}</Title>
                <h3 className={styles.proposalTitle}>简称: {name}</h3>
                <h3 className={styles.proposalTitle}>Token: {token}</h3>
                <Paragraph>{summary}</Paragraph>
              </div>
            </div>

            <div className={styles.detail}>
              <Title level={3}>专区详情</Title>
              <Paragraph>
                <div dangerouslySetInnerHTML={{ __html: detail }} />
              </Paragraph>
            </div>

            <div className={styles.detail}>
              <Title level={3}>投票规则</Title>
              <Paragraph>{vote_rule}</Paragraph>
            </div>

            <div className={styles.detail}>
              <Title level={3}>投票地址与权重</Title>
              <Paragraph>{vote_addr_weight_json}</Paragraph>
            </div>
          </Typography>
        </div>
      </Spin>
    </GridContent>
  );
};

export default connect(({ user, proposal, loading }) => ({
  currentUser: user.currentUser,
  zone_detail: proposal.zone_detail,
  fetchProposalZoneLoading: loading.effects['proposal/fetchProposalZone'],
  delProposalZoneLoading: loading.effects['proposal/deleteProposalZone'],
}))(Detail);
