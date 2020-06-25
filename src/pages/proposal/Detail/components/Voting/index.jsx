import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Row, Col, Progress, Button, Spin, message, Icon } from 'antd';
import styles from './index.less';
import { VoteContract, VoteValueEnum } from '../../../../../services/voteContract';
import { isEmpty } from 'lodash';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

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
          <span className={styles.votingTitle}>
            <FormattedMessage id="proposal.detail.voteqrcode.vote" />
          </span>
        </Row>
        <div className="margin-l" />

        <Row type="flex" justify="center">
          <span style={{ textAlign: 'center' }}>
            <FormattedMessage id="proposal.detail.voting.enable_web3" />
          </span>
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
                {<FormattedMessage id="proposal.detail.voting.installation_mask" />}
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
          <span className={styles.votingTitle}>
            <FormattedMessage id="proposal.detail.voteqrcode.vote" />
          </span>
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
                <FormattedMessage id="proposal.detail.voting.create_contract" />
              </Button>
            </div>
          ) : (
            <span>
              <FormattedMessage id="proposal.detail.voting.not_chain" />
            </span>
          )}
        </Row>
      </>
    );
  }

  if (voteDetail.determined) {
    return (
      <>
        <Row type="flex" justify="center">
          <span className={styles.votingTitle}>
            <FormattedMessage id="proposal.detail.voting.vote_results" />
          </span>
        </Row>
        <div className="margin" />
        {voteDetail.value === VoteValueEnum.agree && (
          <div className="column center">
            <Icon type="check-circle" theme="filled" style={{ color: 'green', fontSize: '48px' }} />
            <div className="margin-sm" />
            <span>
              <FormattedMessage id="proposal.detail.voting.approval" />
            </span>
          </div>
        )}
        {voteDetail.value === VoteValueEnum.disagree && (
          <Row type="flex" justify="center">
            <div className="column center">
              <Icon type="close-circle" theme="filled" style={{ color: 'red', fontSize: '48px' }} />
              <div className="margin-sm" />
              <span>
                <FormattedMessage id="proposal.detail.voting.refused" />
              </span>
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
    // currentUser.id &&
    // voteDetail.signers.includes((web3Info.account || '').toLowerCase()) &&
    web3Info.account && progress < 100;
  console.log(voteDetail, web3Info);
  return (
    <>
      <div>
        <Row type="flex" justify="center">
          <span className={styles.votingTitle}>
            <FormattedMessage id="proposal.detail.voteqrcode.vote_in" />
          </span>
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
            <span>
              <FormattedMessage id="proposal.detail.voteqrcode.total_length" />：
              {detail.vote_duration_hours}
              <FormattedMessage id="app.hour" />
            </span>
          </Col>
          <Col span={12}>
            <span>
              <FormattedMessage id="proposal.detail.voting.starting_blocks" />：{' '}
              {voteDetail.start_height}
            </span>
          </Col>
          <Col span={12}>
            <span>
              <FormattedMessage id="proposal.detail.voting.ending_blocks" />：{' '}
              {voteDetail.end_height}
            </span>
          </Col>
        </Row>
        <div className="margin" />

        <Row>
          <Col span={20} offset={0}>
            {progress !== 100 ? (
              <Progress percent={+progress.toFixed(2)} />
            ) : (
              <span>
                <FormattedMessage id="proposal.detail.voteqrcode.as_failed" />
              </span>
            )}
          </Col>
        </Row>
        <div className="margin" />
        {!web3Info.account && (
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
                {<FormattedMessage id="proposal.detail.voting.connection_metamask" />}
              </>
            </Row>
          </Button>
        )}
        {canVote && (
          <Row type="flex" justify="space-between">
            <Button
              onClick={() => vote({ dispatch, detail, value: VoteValueEnum.agree, web3Info })}
            >
              <Icon type="caret-up" theme="filled" style={{ color: 'green', fontSize: '12px' }} />
              <FormattedMessage id="proposal.detail.voteqrcode.support" />
            </Button>
            <Button
              onClick={() => vote({ dispatch, detail, value: VoteValueEnum.disagree, web3Info })}
            >
              <Icon type="caret-down" theme="filled" style={{ color: 'red', fontSize: '12px' }} />
              <FormattedMessage id="proposal.detail.voteqrcode.against" />
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
  message.info(formatMessage({ id: 'proposal.detail.voting.trading_submit' }));
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
  message.info(formatMessage({ id: 'proposal.detail.voting.trading_submit' }));
}
export default connect(data => {
  return {
    currentUser: data.user.currentUser,
    voteDetail: data.proposal.voteDetail,
  };
})(Voting);
