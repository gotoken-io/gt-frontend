import { getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet } from 'react-helmet';
import Link from 'umi/link';
import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import logo from '../assets/gt-logo.png';
import styles from './UserLayout.less';
import Footer from './components/Footer';
import { web3Connectors } from '@/services/web3';
import Web3Provider from 'web3-react';
import Web3 from 'web3';
import { useEffect } from 'react';

const UserLayout = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    breadcrumb,
    formatMessage,
    ...props,
  });

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                {/* <span className={styles.title}>GoToken</span> */}
              </Link>
            </div>
            {/* <div className={styles.desc}>GoToken</div> */}
          </div>
          <Web3Provider connectors={web3Connectors} libraryName={'web3.js'} web3Api={Web3}>
            {children}
          </Web3Provider>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
