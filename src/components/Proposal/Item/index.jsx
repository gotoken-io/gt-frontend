import React from 'react';
import { Card, Typography, Tag } from 'antd';
import Link from 'umi/link';
import styles from './style.less';
import Avatar from '@/components/User/Avatar';

const { Title, Text } = Typography;

const Item = props => {
  const { title, id, zone, summary, amount, creator, currency_unit } = props;

  const proposalAmount = parseInt(amount);

  return (
    <div className={styles.container}>
      <Link to={`/proposal/detail/${id}`}>
        <Card className={styles.card} hoverable>
          <Typography>
            <div className={styles.cardHead}>
              <div className="left">
                <Text>
                  {zone.name} No.{id}
                </Text>
              </div>
              <div className="right">
                <Tag color="#2db7f5">
                  {proposalAmount} {currency_unit && currency_unit.unit}
                </Tag>
              </div>
            </div>
            <h3 className={styles.proposalTitle}>{title}</h3>
            <Text>{summary}</Text>
            {creator && (
              <div className={styles.creator}>
                <Avatar />
                <Text className={styles.byCreator}>By {creator.username}</Text>
              </div>
            )}
          </Typography>
        </Card>
      </Link>
    </div>
  );
};

export default Item;
