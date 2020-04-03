/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import { Result, Button } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { getAuthorityFromRouter } from '@/utils/utils';
import logo from '../assets/gt-logo-white.png';
import site_logo from '@/assets/gt_logo_transparent.png';
import Footer from './components/Footer';
import { getAuthority } from '@/utils/authority';
import styles from './style.less';
import { web3Connectors } from '@/services/web3';
import Web3Provider from 'web3-react';
import Web3 from 'web3';

const noMatch = (
  <Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/login">登录</Link>
      </Button>
    }
  />
);

/**
 * use Authorized check all menu item
 */

const menuData = [
  {
    path: '/proposal/zone/list',
    name: formatMessage({ id: 'app.menu.proposal_zone' }),
  },
  {
    path: '/proposal/list',
    name: formatMessage({ id: 'app.menu.proposal_list' }),
  },
];

const footerRender = () => <Footer />;

const BasicLayout = props => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
  } = props;
  /**
   * constructor
   */

  useEffect(() => {
    if (dispatch) {
      // if login, get current user detail
      if (getAuthority()) {
        dispatch({
          type: 'user/fetchCurrent',
        });
      } else {
        // if not login, remove current user cache from localstorage
        dispatch({
          type: 'user/removeCurrentUser',
        });
      }

      dispatch({
        type: 'global/queryUploadConfig',
      });

      dispatch({
        type: 'settings/getSetting',
      });
    }
  }, []);
  /**
   * init variables
   */

  const handleMenuCollapse = payload => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
  };
  return (
    <ProLayout
      className={styles.contail}
      logo={logo}
      title="GoToken"
      menuHeaderRender={(logoDom, titleDom) => <Link to="/">{logoDom}</Link>}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children) {
          return defaultDom;
        }

        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      // breadcrumbRender={(routers = []) => [
      //   {
      //     path: '/',
      //     breadcrumbName: formatMessage({
      //       id: 'menu.home',
      //       defaultMessage: 'Home',
      //     }),
      //   },
      //   ...routers,
      // ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      footerRender={footerRender}
      menuDataRender={() => menuData}
      rightContentRender={rightProps => <RightContent {...rightProps} />}
      {...props}
      {...settings}
    >
      <Authorized authority={authorized.authority} noMatch={noMatch}>
        <Web3Provider connectors={web3Connectors} libraryName={'web3.js'} web3Api={Web3}>
          {children}
        </Web3Provider>
      </Authorized>
    </ProLayout>
  );
};

export default connect(({ global, settings }) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
