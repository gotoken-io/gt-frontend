import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Radio, Button, Spin, List, Typography } from 'antd';
import { connect } from 'dva';
import EditAddressModal from './EditAddressModal';
import styles from './style.less';
import { FormattedMessage } from 'umi-plugin-react/locale';

const Wallet = props => {
  // state
  const [visible, setVisible] = useState(false);
  const [modalValue, setModalValue] = useState({});

  // props
  const { zone_list, wallet } = props;

  useEffect(() => {
    const { dispatch } = props;

    if (dispatch) {
      dispatch({
        type: 'proposal/fetchAllProposalZone',
      });

      dispatch({
        type: 'user/fetchCurrentUserWallet',
      });
    }
  }, []);

  // get wallet address by zone id, currency id
  function getWalletAddress(zone_id, currency_id) {
    const settedWallet = wallet.find(d => d.zone.id === zone_id && d.currency.id === currency_id);
    if (settedWallet) {
      return settedWallet.address;
    }
  }

  function onBtnClick(type, zone, currency, address = null) {
    setModalValue({
      type,
      zone,
      currency,
      address,
    });
    setVisible(true);
  }

  return (
    <div>
      <Spin spinning={props.fetchAllProposalZone && props.fetchCurrentUserWallet}>
        {zone_list.map(
          (zone, index) =>
            zone.currencies.length > 0 && (
              <div className={styles.zone} key={index}>
                <h4 className={styles.title}>
                  {zone.name} <FormattedMessage id="user.zone" />
                </h4>
                <div className={styles.addresses}>
                  {zone.currencies.map(currency => (
                    <div className={styles.currency}>
                      <span className={styles.token}>
                        {currency.unit}
                        <span className={styles.name}> {currency.name}</span>
                      </span>
                      <span className={styles.address}>
                        {getWalletAddress(zone.id, currency.id)}
                      </span>
                      <div className={styles.button}>
                        {getWalletAddress(zone.id, currency.id) ? (
                          <Button
                            onClick={() =>
                              onBtnClick(
                                'update',
                                zone,
                                currency,
                                getWalletAddress(zone.id, currency.id),
                              )
                            }
                          >
                            <FormattedMessage id="app.modify" />
                          </Button>
                        ) : (
                          <Button type="primary" onClick={() => onBtnClick('add', zone, currency)}>
                            <FormattedMessage id="app.create" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ),
        )}
      </Spin>
      <EditAddressModal visible={visible} onCancel={() => setVisible(false)} {...modalValue} />
    </div>
  );
};

const WalletWrapper = Form.create({
  name: 'proposal-form',
})(Wallet);

export default connect(({ proposal, user, loading }) => ({
  zone_list: proposal.zone_list,
  wallet: user.wallet,
  fetchAllProposalZone: loading.effects['proposal/fetchAllProposalZone'],
  fetchCurrentUserWallet: loading.effects['user/fetchCurrentUserWallet'],
  submitingUpdate: loading.effects['proposal/updateProposal'],
}))(WalletWrapper);
