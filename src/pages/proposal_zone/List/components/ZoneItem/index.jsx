import React from 'react';
import { Card, Typography } from 'antd';
import Link from 'umi/link';
import LinesEllipsis from 'react-lines-ellipsis';
import { getFielUrl } from '@/utils/upload';
import defaultCover from '@/assets/default_cover.png';
import styles from './style.less';

const { Title, Paragraph, Text } = Typography;

const ZoneItem = props => {
  const { id, cover, title, name, summary } = props;

  let cardCoverSrc = defaultCover;
  if (cover) {
    cardCoverSrc = getFielUrl(cover);
  }

  return (
    <div className={styles.card}>
      <Link to={`/proposal/zone/detail/${id}`}>
        <Card
          hoverable
          style={{ width: 200, height: 200 }}
          cover={<img alt={name} src={cardCoverSrc} />}
        >
          <div>
            <Title level={3}>
              <LinesEllipsis text={title} maxLine="1" />
            </Title>
            <Paragraph className={styles.summary}>
              <LinesEllipsis text={summary} maxLine="3" />
            </Paragraph>
          </div>
        </Card>
      </Link>
    </div>
  );
};

export default ZoneItem;
