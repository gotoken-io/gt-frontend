import { DefaultFooter } from '@ant-design/pro-layout';
import React from 'react';

const Footer = () => (
  <DefaultFooter
    copyright="2019"
    links={[
      {
        key: 'GoToken',
        title: 'GoToken',
        href: 'https://gotoken.io',
        blankTarget: true,
      },
    ]}
  />
);

export default Footer;
