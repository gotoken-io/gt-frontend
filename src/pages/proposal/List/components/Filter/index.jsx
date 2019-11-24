import React from 'react';
import { Button } from 'antd';
import styles from './style.less';

const Filter = () => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>项目专区：</h3>

      <div className={styles.filters}>
        <Button type="link">GoToken</Button>
        <Button type="link">HBP</Button>
      </div>
    </div>
  );
};

export default Filter;
