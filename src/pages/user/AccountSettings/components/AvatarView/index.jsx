import React, { useState, useEffect } from 'react';
import { Button, Upload, message, Avatar } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { getFielUrl } from '@/utils/user';
import { connect } from 'dva';
import styles from './style.less';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

const AvatarView = props => {
  const { currentUser, dispatch } = props;
  const [userAvatar, setUserAvatar] = useState(null);
  //   console.log(currentUser);

  useEffect(() => {
    setUserAvatar(getFielUrl(currentUser.avatar));
  }, []);

  function handleChange(info) {
    const { status, response } = info.file;

    if (status === 'uploading') {
      // this.setState({ loading: true });
      return;
    }

    if (status === 'done') {
      console.log(response.data.key);
      // post update avatar request
      if (dispatch) {
        dispatch({
          type: 'user/postUserAvatar',
          payload: {
            avatar: response.data.key,
          },
        });

        // change user avatar
        getBase64(info.file.originFileObj, imageUrl => {
          setUserAvatar(imageUrl);
        });
      }
    }
  }

  return (
    <div className={styles.avatarView}>
      <div className={styles.avatar_title}>
        <FormattedMessage id="userandaccountsettings.basic.avatar" defaultMessage="Avatar" />
      </div>
      <div className={styles.avatar}>
        {userAvatar ? <Avatar size={144} src={userAvatar} /> : <Avatar size={144} icon="user" />}
      </div>
      <Upload
        action="/server/upload/image/"
        beforeUpload={beforeUpload}
        onChange={handleChange}
        showUploadList={false}
      >
        <div className={styles.button_view}>
          <Button icon="upload">
            <FormattedMessage
              id="userandaccountsettings.basic.change-avatar"
              defaultMessage="Change avatar"
            />
          </Button>
        </div>
      </Upload>
    </div>
  );
};

export default connect(({ user, loading }) => ({
  currentUser: user.currentUser,
  loaddingPostUserAvatar: loading.effects['user/postUserAvatar'],
}))(AvatarView);
