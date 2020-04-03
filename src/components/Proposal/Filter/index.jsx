import React, { useEffect, useState } from 'react';
import { Button, Spin, Select, Row, Col } from 'antd';
import { connect } from 'dva';
import { getPageQuery } from '@/utils/utils';
import { proposalStatus } from '@/utils/proposal';
import router from 'umi/router';
import Link from 'umi/link';
import styles from './style.less';
import { FormattedMessage } from 'umi-plugin-react/locale';

const { Option } = Select;

const Filter = props => {
  // state
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('all');

  // props
  const { match, zone_list, proposal_category, zone_id = null } = props;

  // clear filter select

  useEffect(() => {
    const { dispatch } = props;

    const { c, status, sort_name } = getPageQuery();

    if (status) {
      setStatus(status);
    }

    if (sort_name) {
      setSort(sort_name);
      console.log('sort', sort_name);
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
          if (c === 'all') {
            setCategory('all');
          } else {
            setCategory(parseInt(c));
          }
        }
      });
    }
  }, []);

  // click category
  const onChangeCategory = value => {
    setCategory(value);
    const params = getPageQuery();

    const routeQuery = {
      ...params,
      c: value,
    };

    console.log(3, routeQuery);

    router.push({
      pathname: window.location.pathname,
      query: routeQuery,
    });
  };

  // click status
  const onChangeStatus = value => {
    setStatus(value);
    const params = getPageQuery();

    const routeQuery = {
      ...params,
      status: value,
    };

    console.log('routeQuery', routeQuery, status);

    router.push({
      pathname: window.location.pathname,
      query: routeQuery,
    });
  };

  const onClickSort = value => {
    // let by = 'desc';

    // if (value === sort.name) {
    //   if (sort.by === 'desc') {
    //     by = 'asc';
    //   }

    //   if (sort.by === 'asc') {
    //     by = 'desc';
    //   }
    // }
    console.log('sort', value);

    setSort(value);

    const params = getPageQuery();

    const routeQuery = {
      ...params,
      sort_name: value,
      // sort_by: by,
    };

    console.log(routeQuery);

    router.push({
      pathname: window.location.pathname,
      query: routeQuery,
    });
  };
  const sorts = [
    { key: 'createtime', name: '创建时间' },
    { key: 'amount', name: '提案金额' },
    { key: 'comments', name: '评论数' },
  ];
  // const showSortArrow = key => {
  //   if (key === sort.name) {
  //     if (sort.by === 'desc') {
  //       return <Icon type="arrow-down" />;
  //     }
  //     if (sort.by === 'asc') {
  //       return <Icon type="arrow-up" />;
  //     }
  //   }

  //   return null;
  // };

  // const sortButtons = () => {
  //   const sorts = [
  //     { key: 'createtime', name: '创建时间' },
  //     { key: 'amount', name: '提案金额' },
  //     { key: 'comments', name: '评论数' },
  //   ];

  //   return sorts.map(item => (
  //     <Button onClick={() => onClickSort(item.key)}>
  //       {item.name} {showSortArrow(item.key)}
  //     </Button>
  //   ));
  // };
  console.log({ category, proposal_category, sort, sorts });
  return (
    <div className={styles.container}>
      {/* if set zone_id, hide proposal zone choose */}
      {!zone_id && (
        <div className={styles.zone}>
          <h3 className={styles.title}><FormattedMessage id="proposal.proposal_zone" />：</h3>

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
        <Row gutter={[6, 16]}>
          <Col lg={{ span: 6, offset: 0 }} xs={{ span: 22, offset: 1 }}>
            <div className={styles.category}>
              <Select
                name="category"
                placeholder="Core"
                style={{ width: '100%' }}
                onChange={onChangeCategory}
                value={category}
              >
                <Option key="all" value="all">
                  Core
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
          </Col>
          <Col lg={{ span: 6, offset: 0 }} xs={{ span: 22, offset: 1 }}>
            <div className={styles.status}>
              <Select
                name="status"
                placeholder="In Progress"
                style={{ width: '100%' }}
                onChange={onChangeStatus}
                value={status}
              >
                <Option key="all" value="all">
                  In Progress
                </Option>

                {proposalStatus.map(d => (
                  <Option key={d.key} value={d.key}>
                    {d.text}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col lg={{ span: 6, offset: 0 }} xs={{ span: 22, offset: 1 }}>
            <div className={styles.status}>
              <Select
                name="sort"
                placeholder="Newest"
                style={{ width: '100%' }}
                onChange={onClickSort}
                value={sort}
              >
                <Option key="all" value="all">
                  Newest
                </Option>

                {sorts.map(d => (
                  <Option key={d.key} value={d.key}>
                    {d.name}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
          {/* <div className={styles.sort}>
          <Button.Group>{sortButtons()}</Button.Group>
        </div> */}
        </Row>
      </div>
    </div>
  );
};

export default connect(({ proposal, loading }) => ({
  proposal_category: proposal.proposal_category,
  zone_list: proposal.zone_list,
  loadingZone: loading.effects['proposal/fetchAllProposalZone'],
}))(Filter);
