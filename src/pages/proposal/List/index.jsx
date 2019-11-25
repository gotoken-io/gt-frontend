import React from 'react';
import Link from 'umi/link';
import { Pagination, Button } from 'antd';
import { GridContent } from '@ant-design/pro-layout';
import Item from '@/components/Proposal/Item';
import Filter from './components/Filter';
import styles from './style.less';

const List = props => {
  return (
    <GridContent>
      <div className={styles.filter}>
        <Filter />
      </div>

      <div className={styles.actions}>
        <Link to="/proposal/create">
          <Button type="primary">创建提案</Button>
        </Link>
      </div>

      <div className={styles.list}>
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
      </div>

      <div className={styles.pagination}>
        <Pagination defaultCurrent={1} total={50} />
      </div>
    </GridContent>
  );
};

export default List;
