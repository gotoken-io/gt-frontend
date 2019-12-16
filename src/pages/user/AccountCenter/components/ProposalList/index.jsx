import React from 'react';
import { Row, Col } from 'antd';
import Item from '@/components/Proposal/Item';
import styles from './style.less';

const ProposalList = props => {
  const { list } = props;
  return (
    <div className={styles.container}>
      <Row>
        {list &&
          list.map(item => (
            <Col lg={12} md={24}>
              <Item {...item} />
            </Col>
          ))}
      </Row>
    </div>
  );
};

export default ProposalList;
