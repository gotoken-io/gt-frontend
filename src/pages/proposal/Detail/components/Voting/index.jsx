import React, { useState, useEffect } from 'react';
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

import { useWeb3Context } from 'web3-react';

const Voting = props => {
  const { currentUser, detail, voteDetail, dispatch } = props;
  const web3Info = useWeb3Context();
  console.log(web3Info, voteDetail);

  useEffect(() => {
    if (web3Info.error) {
      web3Info.unsetConnector();
    }
    return;
  }, [web3Info.error]);

  useEffect(() => {
    if (!detail.id) {
      return;
    }
    dispatch({
      type: 'proposal/fetchVoteInformation',
      payload: { zone: detail.zone, hash: detail.onchain_hash },
    });
  }, [detail.id, voteDetail.exists, web3Info.account]);

  if (isEmpty(detail)) {
    return null;
  }

  if (isEmpty(voteDetail)) {
    return (
      <>
        <Row type="flex" justify="center" align="middle">
          <Spin />
        </Row>
      </>
    );
  }

  if (voteDetail.error) {
    return (
      <>
        <Row type="flex" justify="center">
          <span className={styles.votingTitle}>投票情况</span>
        </Row>
        <div className="margin-l" />


        <Row type="flex" justify="center">
          <span style={{ textAlign: "center" }}>为了获取投票信息，请首先启用Web3提供程序作为元掩码</span>
          <div className="margin" />

          <Button
            size="large"
            className="login-form-button"
            block
            href="https://metamask.io/download.html"
            target="_blank"
          >
            <Row type="flex" align="middle" justify="center">
              <>
                <img src="/metamask.jpeg" className={styles.metamaskIcon} />
                {`安装掩码`}
              </>
            </Row>
          </Button>
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
              <Button
                type="primary"
                onClick={async () => {
                  if (web3Info.account) {
                    createVote({ dispatch, detail, web3Info });
                  } else {
                    await web3Info.setConnector('MetaMask');
                  }
                }}
              >
                创建投票合约
              </Button>
            </div>
          ) : (
              <span>提案尚未上链</span>
            )}
        </Row>
      </>
    );
  }

  if (voteDetail.determined) {
    return (
      <>
        <Row type="flex" justify="center">
          <span className={styles.votingTitle}>投票结果</span>
        </Row>
        <div className="margin" />
        {voteDetail.value}
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
    currentUser.id &&
    voteDetail.signers.includes((web3Info.account || '').toLowerCase()) &&
    progress < 100;
  console.log(voteDetail, web3Info);
  return (
    <>
      <div>
        <Row type="flex" justify="center">
          <span className={styles.votingTitle}>投票状况</span>
        </Row>
        <div className="margin" />
        <Row>
          {/* <Col span={18}>
            <span>
              预计开始时间：
              {moment(new Date(voteDetail.startBlock.timestamp * 1000)).format('YYYY-MM-DD HH:mm')}
            </span>
          </Col> */}
          <Col span={18}>
            <span>总 时 长：{detail.vote_duration_hours}小时</span>
          </Col>
          <Col span={12}>
            <span>起始区块： {voteDetail.start_height}</span>
          </Col>
          <Col span={12}>
            <span>结束区块： {voteDetail.end_height}</span>
          </Col>
        </Row>
        <div className="margin" />

        <Row type="flex" justify="center">
          {progress !== 100 ? (
            <Progress percent={+progress.toFixed(2)} />
          ) : (
              <span>投票已截止，未能达成决议</span>
            )}
        </Row>
        <div className="margin" />
        {!web3Info.account && currentUser.id && (
          <Button
            size="large"
            className="login-form-button"
            block
            onClick={async () => {
              if (!web3Info.account) {
                await web3Info.setConnector('MetaMask');
              }
              dispatch({
                type: 'proposal/fetchVoteInformation',
                payload: { zone: detail.zone, hash: detail.onchain_hash },
              });
            }}
          >
            <Row type="flex" align="middle" justify="center">
              <>
                <img src="/metamask.jpeg" className={styles.metamaskIcon} />
                {`连接Metamask`}
              </>
            </Row>
          </Button>
        )}
        {canVote && (
          <Row type="flex" justify="space-between">
            <Button
              onClick={() => vote({ dispatch, detail, value: VoteValueEnum.agree, web3Info })}
            >
              <CaretUpFilled style={{ color: 'green', fontSize: '12px' }} />
              支持
            </Button>
            <Button
              onClick={() => vote({ dispatch, detail, value: VoteValueEnum.disagree, web3Info })}
            >
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
  message.info('交易已提交，请稍后检查Metamask确认交易结果');
}

async function vote({ dispatch, value, detail, web3Info }) {
  if (!web3Info.account) {
    await web3Info.setConnector('MetaMask');
    return;
  }
  await VoteContract.get().vote({
    zone: detail.zone,
    hash: detail.onchain_hash,
    value,
  });
  dispatch({
    type: 'proposal/fetchVoteInformation',
    payload: { zone: detail.zone, hash: detail.onchain_hash },
  });
  message.info('交易已提交，请稍后检查Metamask确认交易结果');
}
export default connect(data => {
  return {
    currentUser: data.user.currentUser,
    voteDetail: data.proposal.voteDetail,
  };
})(Voting);
