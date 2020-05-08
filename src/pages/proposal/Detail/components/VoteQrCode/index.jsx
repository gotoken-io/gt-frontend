import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Row, Col, Progress, Popover, Button, Icon } from 'antd';
import QRCode from 'qrcode.react';
import styles from './index.less';
import { isEmpty } from 'lodash';
import { deleteUndefined, toQueryString } from '@/utils/utils';
import { FormattedMessage } from 'umi-plugin-react/locale';

import moment from 'moment';
const VoteQrCode = props => {
  const { currentUser, detail, dispatch, wallet } = props;
  useEffect(() => {
    if (!currentUser.id) {
      return;
    }
    // GENERATE QR CODE
  }, [currentUser.id]);

  if (isEmpty(detail)) {
    return null;
  }

  if (!detail.vote_duration_hours || !detail.onchain_hash) {
    return (
      <>
        <Row type="flex" justify="center">
          <span className={styles.votingTitle}><FormattedMessage id="proposal.detail.voteqrcode.vote" /></span>
        </Row>
        <div className="margin-l" />

        <Row type="flex" justify="center">
          <span><FormattedMessage id="proposal.detail.voteqrcode.vote_not_configuration" /></span>
        </Row>
      </>
    );
  }

  const timePast = moment().diff(moment(detail.created), 'hours');
  const progress =
    timePast < detail.vote_duration_hours ? (timePast / detail.vote_duration_hours) * 100 : 100;
  console.log(timePast, detail.vote_duration_hours, progress);
  if (progress === 100) {
    return (
      <>
        <Row type="flex" justify="center">
          <span className={styles.votingTitle}><FormattedMessage id="proposal.detail.voteqrcode.vote" /></span>
        </Row>
        <div className="margin-l" />

        <Row type="flex" justify="center">
          <span><FormattedMessage id="proposal.detail.voteqrcode.as_failed" /></span>
        </Row>
      </>
    );
  }
  console.log(wallet);
  const qrCodeData = {
    project: detail.title,
    proposal: detail.onchain_hash,
    voter: wallet ? wallet.address : undefined,
    voterName: currentUser.username,
    target: detail.voteAddress,
    action: undefined, // To be set on the action
  };
  deleteUndefined(qrCodeData);

  const voteUrl = 'gt://vote';
  return (
    <>
      <div>
        <Row type="flex" justify="center">
          <span className={styles.votingTitle}><FormattedMessage id="proposal.detail.voteqrcode.vote_in" /></span>
        </Row>
        <div className="margin-sm" />
        <span className={styles.votingTitle}><FormattedMessage id="proposal.detail.voteqrcode.vote_in" /></span>
        <div className="margin" />

        <span><FormattedMessage id="proposal.detail.voteqrcode.total_length" />：{detail.vote_duration_hours}<FormattedMessage id="app.hour" /></span>
        <div className="margin-l" />
        <Row>
          <Col span={20} offset={0}>
            <Progress percent={+progress.toFixed(2)} showInfo={false} />
          </Col>
        </Row>
        <div className="margin-l" />

        {/* {isEmpty(currentUser) && (
          <Row type="flex" justify="center">
            <span>首先登录</span>
          </Row>
        )} */}
        {/* {!!currentUser.id && !qrCodeData.voter && (
          <Row type="flex" justify="center">
            <span>找不到此区域中配置地址</span>
          </Row>
        )} */}
        {
          <Row type="flex" justify="space-between">
            <Popover
              content={
                <Row type="flex" justify="center">
                  <QRCode
                    value={`${voteUrl}?${toQueryString({
                      ...qrCodeData,
                      action: 1,
                    })}`}
                    size={150}
                  />
                </Row>
              }
              title={<FormattedMessage id="proposal.detail.voteqrcode.qr_code" />}
            >
              <Button>
                <Icon type="caret-up" theme="filled" style={{ color: 'green', fontSize: '12px' }} />
                <FormattedMessage id="proposal.detail.voteqrcode.support" />
              </Button>
            </Popover>
            <Popover
              content={
                <Row type="flex" justify="center">
                  <QRCode
                    value={`${voteUrl}?${toQueryString({
                      ...qrCodeData,
                      action: 2,
                    })}`}
                    size={150}
                  />
                </Row>
              }
              title={<FormattedMessage id="proposal.detail.voteqrcode.qr_code" />}
            >
              <Button>
                <Icon type="caret-down" theme="filled" style={{ color: 'red', fontSize: '12px' }} />
                <FormattedMessage id="proposal.detail.voteqrcode.against" />
              </Button>
            </Popover>
          </Row>
        }
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
