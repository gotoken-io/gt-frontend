import React, { useEffect } from 'react';
import Link from 'umi/link';
import { Pagination, Button } from 'antd';
import { GridContent } from '@ant-design/pro-layout';
import { connect } from 'dva';
import Item from '@/components/Proposal/Item';
import Filter from './components/Filter';
import styles from './style.less';

const List = props => {
  const { dispatch, list, zone_list, match } = props;
  const { id } = match.params;

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'proposal/fetchAllProposalZone',
      });

      dispatch({
        type: 'proposal/fetchAllProposal',
        payload: match.params,
      });
    }
  }, [match.params]);

  return (
    <GridContent>
      <div className={styles.filter}>
        <Filter zone_list={zone_list} />
      </div>

      <div className={styles.actions}>
        <Link to="/proposal/create">
          <Button type="primary">创建提案</Button>
        </Link>
      </div>

      <div className={styles.list}>
        {list.map(item => (
          <Item key={item.id} {...item} />
        ))}
      </div>

      {/* <div className={styles.pagination}>
        <Pagination defaultCurrent={1} total={50} />
      </div> */}
    </GridContent>
  );
};

export default connect(({ proposal }) => ({
  list: proposal.list,
  zone_list: proposal.zone_list,
}))(List);
