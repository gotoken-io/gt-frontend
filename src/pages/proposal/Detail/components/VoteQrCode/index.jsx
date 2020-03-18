import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import QRCode from 'qrcode.react';
import styles from './index.less';
import { isEmpty } from 'lodash';
import { deleteUndefined } from '@/utils/utils';

const VoteQrCode = props => {
  const { currentUser, detail, dispatch, wallet } = props;
  console.log(wallet);
  useEffect(() => {
    if (!currentUser.id) {
      return;
    }
    // GENERATE QR CODE
  }, [currentUser.id]);

  if (isEmpty(detail)) {
    return null;
  }
  if (isEmpty(currentUser)) {
    return (
      <>
        <Row type="flex" justify="center">
          <span className={styles.votingTitle}>投票情况</span>
        </Row>
        <div className="margin-l" />

        <Row type="flex" justify="center">
          <span>首先登录</span>
        </Row>
      </>
    );
  }
  if (isEmpty(wallet)) {
    return (
      <>
        <Row type="flex" justify="center">
          <span className={styles.votingTitle}>投票情况</span>
        </Row>
        <div className="margin-l" />

        <Row type="flex" justify="center">
          <span>找不到此区域中配置地址</span>
        </Row>
      </>
    );
  }
  const qrCodeData = {
    project: detail.title,
    proposal: detail.onchain_hash,
    voter: wallet.address,
    voterName: currentUser.username,
    target: detail.voteAddress,
    action: undefined, // To be set on the action
  };
  deleteUndefined(qrCodeData);

  return (
    <>
      <div>
        <Row type="flex" justify="center">
          <span className={styles.votingTitle}>投票状况</span>
        </Row>
        <div className="margin" />
        <Row>
          <Col span={12}>
            <div class="column center">
              <span>支持</span>
              <div className="margin-sm" />
              <QRCode value={JSON.stringify({ ...qrCodeData, action: 1 })} size={80} />
            </div>
          </Col>
          <Col span={12}>
            <div class="column center">
              <span>反对</span>
              <div className="margin-sm" />
              <QRCode value={JSON.stringify({ ...qrCodeData, action: 2 })} size={80} />
            </div>
          </Col>
        </Row>
        <div className="margin" />

        <Row type="flex" justify="center">
          {/* // QR CODE */}
        </Row>
        <div className="margin" />
      </div>
    </>
  );
};

export default connect(data => {
  return {
    currentUser: data.user.currentUser,
    wallet: isEmpty(data.proposal.detail)
      ? undefined
      : data.user.wallet.find(wallet => wallet.zone.id == data.proposal.detail.zone.id),
  };
})(VoteQrCode);
