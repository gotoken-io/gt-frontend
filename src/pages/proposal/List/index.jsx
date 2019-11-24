import React, { Component } from 'react';
import Item from './components/Item';
import { Pagination } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Filter from './components/Filter';
import styles from './style.less';

class List extends Component {
  render() {
    return (
      <PageHeaderWrapper>
        <div className={styles.filter}>
          <Filter />
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
      </PageHeaderWrapper>
    );
  }
}

export default List;
