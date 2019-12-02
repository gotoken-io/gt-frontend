import React, { useState, useEffect } from 'react';
import { Button, Upload, message } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import { getFielUrl } from '@/utils/user';
import UserAvatar from '@/components/User/UserAvatar';
import { beforeUpload, getBase64 } from '@/utils/upload';
import styles from './style.less';

const AvatarView = props => {
  const { currentUser, dispatch } = props;
  const [userAvatar, setUserAvatar] = useState(null);
  //   console.log(currentUser);

  useEffect(() => {
    if (currentUser.avatar) {
      setUserAvatar(getFielUrl(currentUser.avatar));
    }
  }, []);

  function handleChange(info) {
    const { status, response } = info.file;

    if (status === 'uploading') {
      // this.setState({ loading: true });
      return;
    }

    if (status === 'done') {
      //   console.log(response.data.key);
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
        <UserAvatar size={144} src={userAvatar} username={currentUser.username} />
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
