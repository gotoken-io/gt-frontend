import React, { useState, useEffect } from 'react';
import { Typography, Button, Modal, Spin, Tag } from 'antd';
import Image from '@/components/Image';
import { GridContent } from '@ant-design/pro-layout';
import { connect } from 'dva';
import Link from 'umi/link';
import defaultCover from '@/assets/default_cover.png';
import styles from './style.less';

const { Title, Paragraph, Text } = Typography;
const { confirm } = Modal;

const ZoneCover = ({ id, name, cover }) => {
  let cardCoverSrc = defaultCover;
  if (cover) {
    cardCoverSrc = cover;
  }

  return (
    <div className={styles.cardCover}>
      <Link to={`/proposal/list/${id}`}>
        <Image name={name} src={cardCoverSrc} size={200} />
      </Link>
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

  const {
    id,
    name,
    title,
    token,
    summary,
    detail,
    vote_rule,
    vote_addr_weight_json,
    currencies,
    theme_color,
  } = zone_detail;
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
                <Link to={`/proposal/list/${id}`}>
                  <Title level={2}>{title}</Title>
                </Link>

                {/* <h3 className={styles.proposalTitle}>简称: {name}</h3> */}
                {/* <h3 className={styles.proposalTitle}>Token: {token}</h3> */}
                <div className={styles.currency}>
                  {currencies &&
                    currencies.length > 0 &&
                    currencies.map(d => <Tag color={theme_color}> {d.unit}</Tag>)}
                </div>

                <Paragraph>{summary}</Paragraph>
              </div>
            </div>

            <Title level={3}>专区详情</Title>
            <div className={styles.detail}>
              <Paragraph>
                <div dangerouslySetInnerHTML={{ __html: detail }} />
              </Paragraph>
            </div>

            <Title level={3}>投票规则</Title>
            <div className={styles.detail}>
              <Paragraph>{vote_rule}</Paragraph>
            </div>

            <Title level={3}>投票地址与权重</Title>
            <div className={styles.detail}>
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
