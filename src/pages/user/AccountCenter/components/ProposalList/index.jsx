import React from 'react';
import Item from '@/components/Proposal/Item';
import styles from './style.less';

const ProposalList = props => {
  const { list } = props;
  return <div className={styles.container}>{list && list.map(item => <Item {...item} />)}</div>;
};

export default ProposalList;
