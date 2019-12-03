import React from 'react';
import { Card, Typography, Tag } from 'antd';
import Link from 'umi/link';
import styles from './style.less';
import UserAvatar from '@/components/User/UserAvatar';

const { Title, Text } = Typography;

const Item = props => {
  const { title, id, zone_proposal_id, zone, summary, amount, creator, currency_unit } = props;

  const proposalAmount = parseInt(amount);

  return (
    <div className={styles.container}>
      <Link to={`/proposal/detail/${id}`}>
        <Card className={styles.card} hoverable>
          <Typography>
            <div className={styles.cardHead}>
              <div className={styles.left}>
                <Text>{zone.name}</Text>
                {/* 如果存在 zone_proposal_id 才会显示 ID */}
                {zone_proposal_id && <Text>No.{zone_proposal_id}</Text>}
              </div>
              <div className={styles.right}>
                {proposalAmount > 0 && (
                  <span className={styles.proposalAmount}>
                    {proposalAmount} {currency_unit && currency_unit.unit}
                  </span>
                )}
              </div>
            </div>
            <h3 className={styles.proposalTitle}>{title}</h3>
            <Text>{summary}</Text>
            {creator && (
              <div className={styles.creator}>
                <UserAvatar {...creator} />
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
