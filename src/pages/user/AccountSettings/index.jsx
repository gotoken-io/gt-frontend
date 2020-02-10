import React, { Component } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { Menu } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import BaseView from './components/base';
import Wallet from './components/Wallet';
import { getPageHash } from '@/utils/utils';
import styles from './style.less';

const { Item } = Menu;

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
class AccountSettings extends Component {
  main = undefined;

  constructor(props) {
    // console.log('hash', window.location.hash);

    super(props);
    const menuMap = {
      base: '基本设置',
      wallet: '钱包设置',
    };

    let selectKeyDefault = 'base';
    if (window.location.hash) {
      selectKeyDefault = getPageHash();
    }

    this.state = {
      mode: 'inline',
      menuMap,
      selectKey: selectKeyDefault, // default view
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  getMenu = () => {
    const { menuMap } = this.state;
    return Object.keys(menuMap).map(item => <Item key={item}>{menuMap[item]}</Item>);
  };

  getRightTitle = () => {
    const { selectKey, menuMap } = this.state;
    return menuMap[selectKey];
  };

  selectKey = key => {
    this.setState({
      selectKey: key,
    });

    if (key !== 'base') {
      router.push({
        pathname: window.location.pathname,
        hash: key,
      });
    } else {
      router.push({
        pathname: window.location.pathname,
      });
    }
  };

  resize = () => {
    if (!this.main) {
      return;
    }

    requestAnimationFrame(() => {
      if (!this.main) {
        return;
      }

      let mode = 'inline';
      const { offsetWidth } = this.main;

      if (this.main.offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal';
      }

      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal';
      }

      this.setState({
        mode,
      });
    });
  };

  renderChildren = () => {
    const { selectKey } = this.state;

    switch (selectKey) {
      case 'base':
        return <BaseView />;

      case 'wallet':
        return <Wallet />;

      default:
        this.setState({
          selectKey: 'base',
        });
        return <BaseView />;
    }
  };

  render() {
    const { currentUser } = this.props;

    if (!currentUser.id) {
      return '';
    }

    const { mode, selectKey } = this.state;
    return (
      <GridContent>
        <div
          className={styles.main}
          ref={ref => {
            if (ref) {
              this.main = ref;
            }
          }}
        >
          <div className={styles.leftMenu}>
            <Menu mode={mode} selectedKeys={[selectKey]} onClick={({ key }) => this.selectKey(key)}>
              {this.getMenu()}
            </Menu>
          </div>
          <div className={styles.right}>
            <div className={styles.title}>{this.getRightTitle()}</div>
            {this.renderChildren()}
          </div>
        </div>
      </GridContent>
    );
  }
}

export default AccountSettings;
