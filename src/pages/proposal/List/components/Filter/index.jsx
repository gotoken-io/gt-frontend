import React, { useEffect } from 'react';
import { Button, Spin, Select } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
import styles from './style.less';

const { Option } = Select;

const Filter = props => {
  const { zone_list, proposal_category } = props;

  useEffect(() => {
    const { dispatch } = props;

    if (dispatch) {
      dispatch({
        type: 'proposal/fetchAllProposalZone',
      });

      dispatch({
        type: 'proposal/fetchAllCategory',
      });
    }
  }, []);

  const onChangeCategory = value => {
    console.log(value);
    router.push({
      pathname: window.location.pathname,
      query: {
        c: value,
      },
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.zone}>
        <h3 className={styles.title}>提案专区：</h3>

        <Spin spinning={props.loadingZone}>
          <div className={styles.zoneItems}>
            {zone_list.map(zone => (
              <Link key={zone.id} to={`/proposal/list/${zone.id}`}>
                <Button type="link">{zone.name}</Button>
              </Link>
            ))}
          </div>
        </Spin>
      </div>

      <div className={styles.filters}>
        <div className={styles.category}>
          <h3 className={styles.title}>提案分类：</h3>
          <Select
            name="category"
            placeholder="请选择提案分类"
            style={{ width: 200 }}
            onChange={onChangeCategory}
          >
            <Option key="all" value="all">
              全部
            </Option>

            {proposal_category &&
              proposal_category.map(ctg => (
                <Option key={ctg.id} value={ctg.id}>
                  {ctg.name}&nbsp;({ctg.proposals_count})
                </Option>
              ))}
          </Select>
        </div>
      </div>
    </div>
  );
};

export default connect(({ proposal, loading }) => ({
  proposal_category: proposal.proposal_category,
  zone_list: proposal.zone_list,
  loadingZone: loading.effects['proposal/fetchAllProposalZone'],
  loadingCategory: loading.effects['proposal/fetchProposal'],
}))(Filter);
