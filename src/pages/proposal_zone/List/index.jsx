import React, { useEffect } from 'react';
import { Button } from 'antd';
import { connect } from 'dva';
import ZoneItem from './components/ZoneItem';
import { GridContent } from '@ant-design/pro-layout';
import styles from './style.less';

const List = props => {
  const { zone_list } = props;

  useEffect(() => {
    const { dispatch } = props;
    if (dispatch) {
      dispatch({
        type: 'proposal/fetchAllProposalZone',
      });
    }
  }, []);

  return (
    <GridContent>
      <div className={styles.container}>
        {zone_list.map(zone => (
          <ZoneItem {...zone} />
        ))}
      </div>
    </GridContent>
  );
};

export default connect(({ proposal }) => ({
  zone_list: proposal.zone_list,
}))(List);
