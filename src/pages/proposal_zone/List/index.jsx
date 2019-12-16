import React, { useEffect } from 'react';
import { Button, Row, Col } from 'antd';
import { connect } from 'dva';
import { GridContent } from '@ant-design/pro-layout';
import Link from 'umi/link';
import ZoneItem from './components/ZoneItem';
import styles from './style.less';

const List = props => {
  const { zone_list, currentUser } = props;

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
      {currentUser.admin && (
        <Link to="/proposal/zone/create">
          <Button type="primary">创建提案专区</Button>
        </Link>
      )}

      <div className={styles.container}>
        <Row>
          {zone_list.map(zone => (
            <Col md={12} sm={24}>
              <ZoneItem key={zone.id} {...zone} />
            </Col>
          ))}
        </Row>
      </div>
    </GridContent>
  );
};

export default connect(({ user, proposal }) => ({
  currentUser: user.currentUser,
  zone_list: proposal.zone_list,
}))(List);
