import React from 'react';
import UserAvatar from '@/components/User/UserAvatar';

const AvatarList = props => {
  const { userList, showMax } = props;
  const showFaces = Math.min(userList.length, showMax - 1);
  console.log({ userList: userList.slice(0, showFaces) });
  return (
    <>
      {userList.slice(0, showFaces).map(user => (
        <UserAvatar {...user} />
      ))}
      {/* // Display last face with + Number of hidden faces */}
      {userList.length > showFaces ? <UserAvatar {...userList[showFaces + 1]} /> : null}
    </>
  );
};
export default AvatarList;
