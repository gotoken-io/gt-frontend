import React from 'react';
import { Result } from 'antd';
import check from './CheckPermissions';
import { formatMessage } from 'umi-plugin-react/locale';

const Authorized = ({
  children,
  authority,
  noMatch = <Result status="403" title="403" subTitle={formatMessage({ id: 'app.error_403' })} />,
}) => {
  const childrenRender = typeof children === 'undefined' ? null : children;
  const dom = check(authority, childrenRender, noMatch);
  return <>{dom}</>;
};

export default Authorized;
