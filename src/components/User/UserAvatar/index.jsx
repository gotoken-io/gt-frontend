import React from 'react';
import { Avatar } from 'antd';
import Link from 'umi/link';
import { getFielUrl } from '@/utils/upload';

const UserAvatar = ({ id, src, avatar, username, size = 'default' }) => {
  let avatarComponent = <Avatar size={size} icon="user" alt={username} />;
  if (src) {
    avatarComponent = <Avatar size={size} src={src} alt={username} />;
  }
  if (avatar) {
    avatarComponent = <Avatar size={size} src={getFielUrl(avatar)} alt={username} />;
  }

  if (id) {
    return <Link to={`/user/${id}`}>{avatarComponent}</Link>;
  }

  return avatarComponent;
};

export default UserAvatar;
