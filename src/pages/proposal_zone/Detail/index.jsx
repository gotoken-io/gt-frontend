import React, { useState, useEffect } from 'react';
import { Typography, Button, Modal, Spin, Tag, Icon, Progress } from 'antd';
import Image from '@/components/Image';
import { GridContent } from '@ant-design/pro-layout';
import { Collapse } from 'react-collapse';
import { getFielUrl } from '@/utils/upload';
import { connect } from 'dva';
import Link from 'umi/link';
import ProposalList from './components/ProposalList';
import defaultCover from '@/assets/default_cover.png';
import styles from './style.less';
import { QuestionCircleOutlined } from '@ant-design/icons';

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
        <div
          className={styles.image}
          style={{
            background: `url(${getFielUrl(cardCoverSrc)}) center no-repeat`,
            backgroundSize: 'cover',
          }}
        ></div>
        {/* <Image name={name} src={cardCoverSrc} size={200}/> */}
      </Link>
    </div>
  );
};

const Detail = props => {
  // state
  const [collapse, setCollapse] = useState(true);
  console.log(props);

  // props
  const { dispatch, zone_detail, match, currentUser, proposal_category } = props;
  console.log(2, proposal_category);

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

  const proposals_count = proposal_category.find(categoryInfo => categoryInfo.id == zone_detail.id);
  console.log({ proposal_category, proposals_count });

  const { fetchProposalZoneLoading, delProposalZoneLoading } = props;

  const image = require('../../../../public/metamask.jpeg');

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
              <div className={styles.content}>
                <div className={styles.summaryContent}>
                  <div>
                    <Paragraph>{summary}</Paragraph>
                  </div>
                  <div className={styles.vote}>
                    <div className={styles.toup}>
                      <span className={styles.num}>
                        {proposals_count ? proposals_count.proposals_count : 0}
                      </span>
                      <div>提案数</div>
                    </div>
                    <span>|</span>
                    <div className={styles.toul}>
                      <span className={styles.num}>2,468</span>
                      <div>参与人数</div>
                    </div>
                  </div>
                </div>
                <div className={styles.collapse} onClick={() => setCollapse(!collapse)}>
                  <span>{!collapse ? '收起全部' : '显示全部'}</span>
                  <Icon type={collapse ? 'down' : 'up'} />
                </div>
                {/* default is collapse */}
                {/* <Collapse isOpened={!collapse}>
                  <Title level={3}>介绍</Title>
                  <div className={styles.detail}>
                    <Paragraph>
                      <div dangerouslySetInnerHTML={{ __html: detail }} />
                    </Paragraph>
                  </div>

                  <Title level={3}>投票规则</Title>
                  <div className={styles.detail}>
                    {/* <Paragraph>{vote_rule}</Paragraph> */}
                    <div>
                      支持% <QuestionCircleOutlined />
                    </div>
                    <Progress type="line" percent="64" strokeColor="#29cc7a"></Progress>
                    <div className={styles.tpl}>
                      <div>
                        最少投票率% <QuestionCircleOutlined />
                      </div>
                      <Progress type="line" percent="80" strokeColor="#29cc7a"></Progress>
                    </div>
                  </div>
                </Collapse> */}
                <div className={styles.voters}>
                  <Button type="primary" size="small">
                    加入专区
                  </Button>
                </div>
              </div>
            </div>
            {/* proposal list */}
            <ProposalList zone_id={id} match={match} />
          </Typography>
        </div>
      </Spin>
    </GridContent>
  );
};

export default connect(props => {
  console.log(props);
  return {
    currentUser: props.user.currentUser,
    zone_detail: props.proposal.zone_detail,
    proposal_category: props.proposal.proposal_category,
    fetchProposalZoneLoading: props.loading.effects['proposal/fetchProposalZone'],
    delProposalZoneLoading: props.loading.effects['proposal/deleteProposalZone'],
  };
})(Detail);
