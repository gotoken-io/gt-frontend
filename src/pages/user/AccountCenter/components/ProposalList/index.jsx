import React from 'react';
import Item from '@/components/Proposal/Item';
import styles from './style.less';

const ProposalList = props => {
  return (
    <div className={styles.container}>
      <Item />
      <Item />
      <Item />
      <Item />
      <Item />
    </div>
  );
};

export default ProposalList;
