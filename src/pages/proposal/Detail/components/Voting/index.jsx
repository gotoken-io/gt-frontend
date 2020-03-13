import React, { useState, useEffect } from 'react';
import AvatarList from '@/components/User/AvatarList';
import { connect } from 'dva';
import { Row, Col, Progress, Button, Spin, message } from 'antd';
import {
  CaretDownFilled,
  CaretUpFilled,
  CheckCircleFilled,
  CloseCircleFilled,
} from '@ant-design/icons';
import styles from './index.less';
import { VoteContract, VoteValueEnum } from '../../../../../services/voteContract';
import { isEmpty } from 'lodash';
import moment from 'moment';

const BigNumber = require('bignumber.js');

const Voting = props => {
  const { currentUser, detail, voteDetail, dispatch, zoneWallet } = props;

  console.log(props);

  useEffect(() => {
    if (!detail.id) {
      return;
    }
    dispatch({
      type: 'proposal/fetchVoteInformation',
      payload: { zone: detail.zone, hash: detail.onchain_hash },
    });
  }, [detail.id, voteDetail.exists]);

  if (isEmpty(detail)) {
    return null;
  }
  if (isEmpty(voteDetail)) {
    return (
      <>
        <Row type="flex" justify="center">
          <Spin />
        </Row>
      </>
    );
  }

  if (!voteDetail.exists) {
    return (
      <>
        <Row type="flex" justify="center">
          <span className={styles.votingTitle}>投票情况</span>
        </Row>
        <div className="margin" />

        <Row type="flex" justify="center">
          {currentUser && currentUser.id == detail.creator.id ? (
            <div>
              <Button type="primary" onClick={async () => createVote({ dispatch, detail })}>
                创建投票合同
              </Button>
            </div>
          ) : (
            <span>没有连锁合同</span>
          )}
        </Row>
      </>
    );
  }

  if (voteDetail.determined) {
    return (
      <>
        <Row type="flex" justify="center">
          <span className={styles.votingTitle}>投票情况</span>
        </Row>
        <div className="margin" />

        {voteDetail.value === VoteValueEnum.agree && (
          <div className="column center">
            <CheckCircleFilled style={{ color: 'green', fontSize: '48px' }} />
            <div className="margin-sm" />
            <span>该提案已获批准</span>
          </div>
        )}
        {voteDetail.value === VoteValueEnum.disagree && (
          <Row type="flex" justify="center">
            <div className="column center">
              <CloseCircleFilled style={{ color: 'red', fontSize: '48px' }} />
              <div className="margin-sm" />
              <span>提案被拒绝</span>
            </div>
          </Row>
        )}
      </>
    );
  }

  const progress =
    voteDetail.currentBlock > voteDetail.end_height
      ? 100
      : (100 * (voteDetail.currentBlock - voteDetail.start_height)) /
        (voteDetail.end_height - voteDetail.start_height);
  const canVote =
    zoneWallet && voteDetail.signers.includes(zoneWallet.address.toLowerCase()) && progress < 100;
  return (
    <>
      <div>
        <Row type="flex" justify="center">
          <span className={styles.votingTitle}>投票情况</span>
        </Row>
        <div className="margin" />
        <Row>
          <Col span={18}>
            <span>
              预计开始时间：
              {moment(new Date(voteDetail.startBlock.timestamp * 1000)).format('YYYY-MM-DD HH:mm')}
            </span>
          </Col>
          <Col span={18}>
            <span>投票时间： {detail.vote_duration_hours}小时</span>
          </Col>
          <Col span={12}>
            <span>起始块： {voteDetail.start_height}</span>
          </Col>
          <Col span={12}>
            <span>端块： {voteDetail.end_height}</span>
          </Col>
        </Row>
        <div className="margin" />

        <Row type="flex" justify="center">
          {progress !== 100 ? (
            <Progress percent={+progress.toFixed(2)} />
          ) : (
            <span>投票已完成，没有最终决定</span>
          )}
        </Row>
        <div className="margin" />
        {canVote && (
          <Row type="flex" justify="space-between">
            <Button onClick={() => vote({ dispatch, detail, value: VoteValueEnum.agree })}>
              <CaretUpFilled style={{ color: 'green', fontSize: '12px' }} />
              支持
            </Button>
            <Button onClick={() => vote({ dispatch, detail, value: VoteValueEnum.disagree })}>
              <CaretDownFilled style={{ color: 'red', fontSize: '12px' }} />
              反对
            </Button>
          </Row>
        )}
      </div>
    </>
  );
};

async function createVote({ dispatch, detail }) {
  await VoteContract.get().createVote({
    zone: detail.zone,
    hash: detail.onchain_hash,
    vote_duration_hours: detail.vote_duration_hours,
  });
  dispatch({
    type: 'proposal/fetchVoteInformation',
    payload: { zone: detail.zone, hash: detail.onchain_hash },
  });
  message.info('交易正在进行中。 等待确认后再刷新');
}

async function vote({ dispatch, value, detail }) {
  await VoteContract.get().vote({
    zone: detail.zone,
    hash: detail.onchain_hash,
    value,
  });
  dispatch({
    type: 'proposal/fetchVoteInformation',
    payload: { zone: detail.zone, hash: detail.onchain_hash },
  });
  message.info('交易正在进行中。 等待确认后再刷新');
}
export default connect(data => {
  return {
    zoneWallet:
      data.proposal.detail && data.proposal.detail.zone
        ? data.user.wallet.find(wallet => wallet.zone.id == data.proposal.detail.zone.id)
        : undefined,
    currentUser: data.user.currentUser,
    voteDetail: data.proposal.voteDetail,
  };
})(Voting);
