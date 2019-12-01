import React from 'react';
import { Avatar } from 'antd';
import { getFielUrl } from '@/utils/user';

const UserAvatar = ({ avatar, username, size = 'default' }) => {
  if (avatar) {
    return <Avatar size={size} src={getFielUrl(avatar)} alt={username} />;
  }
  return <Avatar size={size} icon="user" alt={username} />;
};

export default UserAvatar;
