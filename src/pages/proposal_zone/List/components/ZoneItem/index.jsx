import React from 'react';
import { Card } from 'antd';
import Link from 'umi/link';
import { getFielUrl } from '@/utils/upload';
import defaultCover from '@/assets/default_cover.png';
import styles from './style.less';

const { Meta } = Card;

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
          <Meta title={title} description={summary} />
        </Card>
      </Link>
    </div>
  );
};

export default ZoneItem;
