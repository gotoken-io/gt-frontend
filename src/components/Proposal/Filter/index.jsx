import React, { useEffect, useState } from 'react';
import { Button, Spin, Select, Icon } from 'antd';
import { connect } from 'dva';
import { getPageQuery } from '@/utils/utils';
import router from 'umi/router';
import Link from 'umi/link';
import styles from './style.less';

const { Option } = Select;

const Filter = props => {
  // state
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState({
    name: 'createtime',
    by: 'desc',
  });

  // props
  const { zone_list, proposal_category, zone_id = null } = props;

  useEffect(() => {
    const { dispatch } = props;

    const { c, sort_name, sort_by } = getPageQuery();

    if (sort_name && sort_by) {
      setSort({
        name: sort_name,
        by: sort_by,
      });

      console.log('sort', sort);
    }

    if (dispatch) {
      dispatch({
        type: 'proposal/fetchAllProposalZone',
      });

      dispatch({
        type: 'proposal/fetchAllCategory',
      }).then(res => {
        console.log(res);
        if (c) {
          setCategory(parseInt(c));
        }
      });
    }
  }, []);

  const onChangeCategory = value => {
    setCategory(value);
    const params = getPageQuery();

    const routeQuery = {
      ...params,
      c: value,
    };

    console.log(routeQuery);

    router.push({
      pathname: window.location.pathname,
      query: routeQuery,
    });
  };

  const onClickSort = value => {
    let by = 'desc';

    if (value === sort.name) {
      if (sort.by === 'desc') {
        by = 'asc';
      }

      if (sort.by === 'asc') {
        by = 'desc';
      }
    }

    setSort({
      name: value,
      by,
    });

    const params = getPageQuery();

    const routeQuery = {
      ...params,
      sort_name: value,
      sort_by: by,
    };

    console.log(routeQuery);

    router.push({
      pathname: window.location.pathname,
      query: routeQuery,
    });
  };

  const showSortArrow = key => {
    if (key === sort.name) {
      if (sort.by === 'desc') {
        return <Icon type="arrow-down" />;
      }
      if (sort.by === 'asc') {
        return <Icon type="arrow-up" />;
      }
    }

    return null;
  };

  const sortButtons = () => {
    const sorts = [
      { key: 'createtime', name: '创建时间' },
      { key: 'amount', name: '提案金额' },
      { key: 'comments', name: '评论数' },
    ];

    return sorts.map(item => (
      <Button onClick={() => onClickSort(item.key)}>
        {item.name} {showSortArrow(item.key)}
      </Button>
    ));
  };

  return (
    <div className={styles.container}>
      {/* if set zone_id, hide proposal zone choose */}
      {!zone_id && (
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
      )}

      <div className={styles.filters}>
        <div className={styles.category}>
          <h3 className={styles.title}>提案分类：</h3>
          <Select
            name="category"
            placeholder="请选择提案分类"
            style={{ width: 200 }}
            onChange={onChangeCategory}
            value={category}
          >
            <Option key="all" value="all">
              全部
            </Option>

            {proposal_category &&
              proposal_category.map(ctg => (
                <Option key={ctg.id} value={ctg.id}>
                  {ctg.name}
                  {!zone_id && <span className={styles.count}>({ctg.proposals_count})</span>}
                </Option>
              ))}
          </Select>
        </div>

        <div className={styles.sort}>
          <h3 className={styles.title}>排序：</h3>
          <Button.Group>{sortButtons()}</Button.Group>
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
