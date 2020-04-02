import Link from 'umi/link';
import { Result, Button } from 'antd';
import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';

export default () => (
  <Result
    status="404"
    title="404"
    style={{
      background: 'none',
    }}
    subTitle={formatMessage({
      id: 'app.error_404',
    })}
    extra={
      <Link to="/">
        <Button type="primary">
          {formatMessage({
            id: 'app.back_home',
          })}
        </Button>
      </Link>
    }
  />
);
