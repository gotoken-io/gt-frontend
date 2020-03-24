import React, { useEffect, useState } from 'react';
import { Button, Row, message, Spin } from 'antd';
import styles from '../index.less';
import { useWeb3Context } from 'web3-react';
import { Web3Lib } from '@/services/web3';

export default function (props) {
  const web3Info = useWeb3Context();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const result = connectResult(web3Info);
    if (!result) {
      return web3Info.unsetConnector(); // Allow to retry
    }
    return;
  }, [web3Info.error]);

  useEffect(() => {
    if (!web3Info.account) {
      return;
    }
    // Async call
    login({ props, account: web3Info.account, setLoading });
  }, [web3Info.account]);

  return (
    <Button
      size="large"
      className="login-form-button"
      block
      onClick={async () => {
        if (!web3Info.account) {
          await web3Info.setConnector('MetaMask');
        } else {
          login({ props, account: web3Info.account, setLoading });
        }
      }}
    >
      <Row type="flex" align="middle" justify="center">
        {loading ? (
          <Spin size="default" />
        ) : (
            <>
              <img src="/metamask.jpeg" className={styles.metamaskIcon} />
              {web3Info.account ? `与 ${renderAccount(web3Info.account)} 连接` : `Metamask 登记`}
            </>
          )}
      </Row>
    </Button>
  );
}

function renderAccount(account) {
  return account.substr(0, 6) + ' * * * * ' + account.substr(-4);
}
function connectResult(web3Info) {
  if (!web3Info.active && !web3Info.error) {
    // not metamask
    return false;
  }
  if (web3Info.error) {
    message.error('无法连接metamask');
    return false;
    //error
  }
  return true;
}

async function login({ props, account, setLoading }) {
  setLoading(true);
  await props.onLogin(account);
  setLoading(false);
}
