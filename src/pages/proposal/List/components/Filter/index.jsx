import React from 'react';
import { Button } from 'antd';
import Link from 'umi/link';
import styles from './style.less';

const Filter = props => {
  const { zone_list } = props;
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>项目专区：</h3>

      <div className={styles.filters}>
        {zone_list.map(zone => (
          <Link to={`/proposal/list/${zone.id}`}>
            <Button type="link">{zone.name}</Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Filter;
