import React, { useEffect } from 'react';
import { Form, Comment, Avatar } from 'antd';
import CommentForm from '../CommnetForm';
import Link from 'umi/link';
import styles from './style.less';

const CommentWrapper = ({ id, text, created, updated, creator, children }) => (
  <Comment
    // actions={[<span key="comment-nested-reply-to">Reply to</span>]}
    author={<Link to={`/user/${creator.id}`}>{creator.username}</Link>}
    avatar={
      <Avatar
        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        alt={creator.username}
      />
    }
    content={<p>{text}</p>}
  >
    {children}
  </Comment>
);

const Comments = props => {
  const { list } = props;
  return (
    <div className={styles.container}>
      <CommentForm />
      {list && list.map(comment => <CommentWrapper {...comment} />)}
    </div>
  );
};

export default Comments;
