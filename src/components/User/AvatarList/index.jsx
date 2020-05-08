import React from 'react';
import UserAvatar from '@/components/User/UserAvatar';
import { Row, Col } from 'antd';
const AvatarList = props => {
  const { userList, showMax } = props;
  const showFaces = Math.min(userList.length, showMax - 1);
  console.log({ userList: userList.slice(0, showFaces) });
  return (
    <Row type="flex">
      {userList.slice(0, showFaces).map(user => (
        <div style={{ marginRight: '12px' }}>
          <UserAvatar {...user} />
        </div>
      ))}
      {/* // Display last face with + Number of hidden faces */}
      {userList.length > showFaces ? <UserAvatar {...userList[showFaces + 1]} /> : null}
    </Row>
  );
};
export default AvatarList;
