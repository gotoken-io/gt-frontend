import React from 'react';
import { Card, Typography, Tag, Avatar } from 'antd';
import Image from '@/components/Image';
import LinesEllipsis from 'react-lines-ellipsis';
import Link from 'umi/link';
import styles from './style.less';
import UserAvatar from '@/components/User/UserAvatar';
import defaultCover from '@/assets/default_cover.png';

const { Title, Paragraph, Text } = Typography;

const Item = props => {
  const { title, id, zone_proposal_id, zone, summary, amount, creator, currency_unit } = props;

  const proposalAmount = parseInt(amount);

  const zoneCover = cover => {
    let cardCoverSrc = defaultCover;
    if (cover) {
      cardCoverSrc = cover;
    }
    return cardCoverSrc;
  };

  return (
    <div className={styles.container}>
      <Link to={`/proposal/detail/${id}`}>
        <Card className={styles.card} hoverable>
          <Typography>
            <div className={styles.cardHead}>
              <div className={styles.left}>
                {/* <Avatar className={styles.zoneLogo} shape="square" size={32} src={zoneCover(zone.cover)} /> */}
                <span className={styles.zoneLogo}>
                  <Image shape="square" size={32} src={zoneCover(zone.cover)} />
                </span>
                <Text>{zone.name}</Text>
                &nbsp;&nbsp;
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

            <Title level={3} className={styles.title}>
              <LinesEllipsis text={title} maxLine="2" />
            </Title>
            <Paragraph className={styles.summary}>
              <LinesEllipsis text={summary} maxLine="2" />
            </Paragraph>
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
