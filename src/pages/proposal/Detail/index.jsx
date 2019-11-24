import React from 'react';
import { Comment, Typography, Tag } from 'antd';
import styles from './style.less';
import btc_cover from '@/assets/card/btc.png';
import Avatar from '@/components/User/Avatar';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const { Title, Paragraph, Text } = Typography;

const Cover = () => (
  <div className={styles.cardCover} style={{ backgroundImage: `url(${btc_cover})` }}>
    <Typography>
      <Title className={styles.titleNo}>No.101</Title>
    </Typography>
  </div>
);

const CommentWrapper = ({ children }) => (
  <Comment
    actions={[<span key="comment-nested-reply-to">Reply to</span>]}
    author={<a>Han Solo</a>}
    avatar={
      <Avatar
        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        alt="Han Solo"
      />
    }
    content={
      <p>
        We supply a series of design principles, practical patterns and high quality design
        resources (Sketch and Axure).
      </p>
    }
  >
    {children}
  </Comment>
);

const Detail = props => {
  return (
    <PageHeaderWrapper>
      <div className={styles.container}>
        <Typography>
          <div className={styles.summaryCard}>
            <Cover />

            <div className={styles.summaryContent}>
              <div className={styles.cardHead}>
                <div className="left">
                  <Text>Token Name No.111</Text>
                </div>
                <div className="right">
                  <Tag color="#2db7f5">1000 ETH</Tag>
                </div>
              </div>
              <h3 className={styles.proposalTitle}>proposal title ......</h3>
              <Paragraph>
                proposal summary proposal summaryproposal summaryproposal summaryproposal summary
                ... proposal summary proposal summaryproposal summaryproposal summaryproposal
                summary ...
              </Paragraph>
            </div>
          </div>

          <div className={styles.userList}>
            <div className={styles.user}>
              <Avatar />
              <div className={styles.userContent}>
                <h3>username</h3>
                <Text>Creator</Text>
              </div>
            </div>
          </div>

          <div className={styles.detail}>
            <Title level={2}>项目详情</Title>
            <Paragraph>
              In the process of internal desktop applications development, many different design
              specs and implementations would be involved, which might cause designers and
              developers difficulties and duplication and reduce the efficiency of development.
            </Paragraph>
          </div>

          <div className={styles.comments}>
            <Title level={2}>评论</Title>
            <CommentWrapper>
              <CommentWrapper></CommentWrapper>
              <CommentWrapper></CommentWrapper>
            </CommentWrapper>
          </div>
        </Typography>
      </div>
    </PageHeaderWrapper>
  );
};

export default Detail;
