import React from 'react';
import { connect } from 'dva';
import AvatarDropdown from './AvatarDropdown';
import styles from './index.less';
import { Menu, Dropdown, Row } from 'antd';
import { setLocale, FormattedMessage } from 'umi-plugin-react/locale';

const LanguageSwitch = () => {
  return (
    <Dropdown
      overlay={
        <Menu
          onClick={({ key }) => {
            setLocale(key, true);
          }}
        >
          <Menu.Item key="en-US">English</Menu.Item>
          <Menu.Item key="zh-CN">中文</Menu.Item>
        </Menu>
      }
    >
      <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
        <FormattedMessage id="app.lang" />
      </a>
    </Dropdown>
  );
};

const GlobalHeaderRight = props => {
  const { theme, layout } = props;
  let className = styles.right;

  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <div className={className}>
      <Row type="flex" gutter={[12, 12]}>
        <AvatarDropdown />
        <div className="margin" />
        <LanguageSwitch />
      </Row>
    </div>
  );
};

export default connect(({ settings }) => ({
  theme: settings.navTheme,
  layout: settings.layout,
}))(GlobalHeaderRight);
