import React from 'react';
import { Card, Typography, Row, Col } from 'antd';
import Image from '@/components/Image';
import Link from 'umi/link';
import LinesEllipsis from 'react-lines-ellipsis';
import { getFielUrl } from '@/utils/upload';
import defaultCover from '@/assets/default_cover.png';
import styles from './style.less';

const { Title, Paragraph } = Typography;

const ZoneItem = props => {
  const { id, cover, title, name, summary } = props;

  let cardCoverSrc = defaultCover;
  if (cover) {
    cardCoverSrc = getFielUrl(cover);
  }

  return (
    <div className={styles.card}>
      <Link to={`/proposal/zone/detail/${id}`}>
        <Card hoverable>
          <Row>
            <Col md={8} sm={24}>
              <span className={styles.zoneImg}>
                <Image name={name} src={cardCoverSrc} size={160} />
              </span>
            </Col>
            <Col md={16} sm={24}>
              <div className={styles.zoneSummary}>
                <Title level={3}>
                  <LinesEllipsis text={title} maxLine="1" />
                </Title>
                <Paragraph className={styles.summary}>
                  <LinesEllipsis text={summary} maxLine="3" />
                </Paragraph>
              </div>
            </Col>
          </Row>
        </Card>
      </Link>
    </div>
  );
};

export default ZoneItem;
