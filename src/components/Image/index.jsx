import React, { useEffect, useState } from 'react';
import { Avatar } from 'antd';
import Link from 'umi/link';
import { getFielUrl } from '@/utils/upload';
// import gtLogoTrans from '@/assets/gt_logo_transparent.png';
import gtLogo from '@/assets/default_cover.png';

const Image = ({ prefix, id, name, src, size = 'default', shape = 'square' }) => {
  let avatarComponent = <Avatar size={size} alt={name} />;
  const [avatarSrc, setAvatarSrc] = useState(gtLogo);

  useEffect(() => {
    setAvatarSrc(getFielUrl(src));
  }, [src]);

  if (src) {
    avatarComponent = (
      <Avatar
        shape={shape}
        size={size}
        src={avatarSrc}
        alt={name}
        onError={() => {
          setAvatarSrc(gtLogo);
        }}
      />
    );
  }

  if (prefix) {
    return <Link to={`/${prefix}/${id}`}>{avatarComponent}</Link>;
  }
  return avatarComponent;
};

export default Image;
