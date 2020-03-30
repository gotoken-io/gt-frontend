import React from 'react';
import { Card, Typography, Row, Col, Tag, Button } from 'antd';
import Image from '@/components/Image';
import Link from 'umi/link';
import LinesEllipsis from 'react-lines-ellipsis';
import { getFielUrl } from '@/utils/upload';
import defaultCover from '@/assets/default_cover.png';
import styles from './style.less';
import Zone from '@/components/Proposal/Zone';
import { connect } from 'dva';

const { Title, Paragraph } = Typography;

const ZoneItem = props => {
  const { id, cover, title, name, summary, currencies, theme_color, total_proposals } = props;

  let cardCoverSrc = defaultCover;
  if (cover) {
    cardCoverSrc = cover;
  }
  console.log(1, props);
  return (
    <div className={styles.card}>
      <Link to={`/proposal/zone/detail/${id}`}>
        <Card hoverable>
          <div
            className={styles.zoneImg}
            style={{
              background: `url(${getFielUrl(cardCoverSrc)}) center no-repeat`,
              backgroundSize: 'cover',
            }}
          >
            {/* <Image name={name} src={cardCoverSrc} size={160} /> */}
          </div>
          <div className={styles.zoneSummary}>
            <div className={styles.zoneTitle}>
              <span className={styles.iconTitle}>
                <Image src={cardCoverSrc} />
                <div className={styles.headings}>
                  <Title level={4}>
                    <LinesEllipsis text={title} maxLine="1" />
                  </Title>
                  <div className={styles.text}>
                    {total_proposals}个提案·
                    {/* ·3600人参与 */}
                  </div>
                </div>
              </span>
              <Button size="small" type="primary">
                加入专区
              </Button>
            </div>
            {/* <div className={styles.currency}>
              {currencies.length > 0 &&
                currencies.map(d => <Tag color={theme_color}> {d.unit}</Tag>)}
            </div> */}
            <div className={styles.zxxm}>最新项目</div>
            <Paragraph className={styles.summary}>
              <LinesEllipsis text={summary} maxLine="1" ellipsis="..." trimRight />
            </Paragraph>
          </div>
        </Card>
      </Link>
    </div>
  );
};

export default connect(props => {
  return {
    proposal_category: props.proposal.proposal_category,
  };
})(ZoneItem);
