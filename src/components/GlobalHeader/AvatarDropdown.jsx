import { Avatar, Icon, Menu, Spin } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
import HeaderDropdown from '../HeaderDropdown';
import UserAvatar from '@/components/User/UserAvatar';
import styles from './index.less';

const LoginAndRegister = () => (
  <div>
    <Link to="/login">登录</Link>
    <em>|</em>
    <Link to="/login">注册</Link>
  </div>
);

class AvatarDropdown extends React.Component {
  onMenuClick = (event, currentUser) => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;

      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }
      return;
    }

    if (key === 'account') {
      router.push(`/user/${currentUser.username}`);
    } else {
      router.push(`/account/${key}`);
    }
  };

  render() {
    const { currentUser } = this.props;
    // console.log(currentUser);
    const menuHeaderDropdown = (
      <Menu
        className={styles.menu}
        selectedKeys={[]}
        onClick={e => this.onMenuClick(e, currentUser)}
      >
        <Menu.Item key="account">
          <Icon type="user" />
          <FormattedMessage id="menu.account.center" defaultMessage="account center" />
        </Menu.Item>

        <Menu.Item key="settings">
          <Icon type="setting" />
          <FormattedMessage id="menu.account.settings" defaultMessage="account settings" />
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );
    return currentUser && currentUser.username ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <UserAvatar {...currentUser} />
          <span className={styles.name}>{currentUser.username}</span>
        </span>
      </HeaderDropdown>
    ) : (
        <LoginAndRegister />
      );
  }
}

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);
