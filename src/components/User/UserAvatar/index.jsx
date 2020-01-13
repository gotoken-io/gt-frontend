import React, { useEffect, useState } from 'react';
import { Avatar } from 'antd';
import Link from 'umi/link';
import { getFielUrl } from '@/utils/upload';
import gtLogoTrans from '@/assets/gt_logo_transparent.png';

const UserAvatar = ({ id, src, avatar, username, size = 'default', shape = 'circle' }) => {
  let avatarComponent = <Avatar size={size} icon="user" alt={username} />;
  const [avatarSrc, setAvatarSrc] = useState(gtLogoTrans);

  useEffect(() => {
    setAvatarSrc(getFielUrl(avatar));
  }, [avatar]);

  // use for upload image preview
  if (src) {
    avatarComponent = <Avatar size={size} src={src} alt={username} />;
  } else if (avatar) {
    avatarComponent = (
      <Avatar
        shape={shape}
        size={size}
        src={avatarSrc}
        alt={username}
        onError={() => {
          setAvatarSrc(gtLogoTrans);
        }}
      />
    );
  }

  if (id) {
    return <Link to={`/user/${id}`}>{avatarComponent}</Link>;
  }

  return avatarComponent;
};

export default UserAvatar;
