import React from 'react';
import { Card, Typography, Icon, Tag, Badge, Divider, Progress, Steps } from 'antd';
import { getStatusTextByKey } from '@/utils/proposal';
import Image from '@/components/Image';
import LinesEllipsis from 'react-lines-ellipsis';
import Link from 'umi/link';
import moment from '@/utils/moment';
import styles from './style.less';
import UserAvatar from '@/components/User/UserAvatar';
import { getClaimStatusByKey } from '@/utils/proposal_claim';
import defaultCover from '@/assets/default_cover.png';

const { Title, Paragraph, Text } = Typography;

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1620903_d541qpvt7iw.js',
});

const Item = props => {
  const {
    title,
    id,
    zone_proposal_id,
    zone,
    summary,
    amount,
    creator,
    currency_unit,
    comments_count,
    created,
    category,
    status_key,
    claim,
  } = props;

  const { Step } = Steps;

  const proposalAmount = parseInt(amount);
  const img = require('../../../../public/metamask.jpeg')

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
        <Card className={claim ? styles['card-extra-height'] : styles.card} hoverable>
          <div className={styles.cardBody}>
            {/* <div className={styles.cardHead}>
              <div className={styles.left}> */}
            {/* <Avatar className={styles.zoneLogo} shape="square" size={32} src={zoneCover(zone.cover)} /> */}
            {/* <span className={styles.zoneLogo}>
                  <Image shape="square" size={32} src={zoneCover(zone.cover)} />
                </span> */}

            {/* &nbsp;&nbsp; */}
            {/* 如果存在 zone_proposal_id 才会显示 ID */}
            {/* {zone_proposal_id && <Text>No.{zone_proposal_id}</Text>}
                <div className={styles.right}>
                  {proposalAmount > 0 && (
                    <Tag color={zone.theme_color}>
                      {proposalAmount.toLocaleString()} {currency_unit && currency_unit.unit}
                    </Tag>
                  )}
                </div> */}
            {/* </div>
            </div> */}

            <div className={styles.cardTitle}>
              <Title level={3} className={styles.title}>
                <LinesEllipsis text={title} maxLine="2" />
              </Title>
              <div>
                <Text>{zone.name}</Text>
              </div>


              {/* {category.id && <Tag>{category.name}</Tag>} */}
            </div>
            <div className={styles.author}>
              <div className={styles.info}>
                {creator && (
                  <div className={styles.creator}>
                    <UserAvatar {...creator} />
                    <Text className={styles.byCreator}>{creator.username}</Text>
                  </div>
                )}

                {/* <div className={styles.iconList}>
                  {comments_count > 0 && (
                    <div className={styles.comment}>
                      <IconFont type="icon-comment" style={{ fontSize: '18px' }} /> {comments_count}
                    </div>
                  )}
                </div> */}
              </div>
              <span className={styles.datetime}>{moment.createTime(created)}</span>
            </div>
            <div className={styles.steps}>
              <Steps size="small" current={1}>
                <Step title="Claim" />
                <Step title="Progress" />
                <Step title="Test" />
              </Steps>
            </div>
            <div className={styles.bystatus}>
              {status_key && (
                <div className={styles.status}>
                  <span className={styles[status_key]}>{getStatusTextByKey(status_key)}</span>
                </div>
              )}
            </div>


            {/* <Paragraph className={styles.summary}>
              <LinesEllipsis text={summary} maxLine="3" />
            </Paragraph> */}

            <div className={styles.bottom}>



              {/* 申领信息 */}
              {claim && (
                <div className={styles['claim-info']}>
                  <div className={styles.head}>
                    <span>
                      <UserAvatar size={16} {...claim.claimer} />
                      <span className={styles.username}>{claim.claimer.username}</span>
                    </span>
                    <span className={styles.status}>
                      <Tag color={getClaimStatusByKey(claim.status_key).color}>
                        {getClaimStatusByKey(claim.status_key).text}
                      </Tag>
                    </span>
                  </div>

                  <div className={styles.claimContent}>
                    <div className={styles.reason}>
                      <Divider>申领理由</Divider>
                      <p className={styles.reasonText}>{claim.reason}</p>
                    </div>

                    {claim.result && (
                      <div className={styles.result}>
                        <Divider>提交结果</Divider>
                        <p className={styles.resultText}>{claim.result}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
};

export default Item;
