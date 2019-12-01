import React, { useEffect, useState } from 'react';
import { Tooltip, Comment, Avatar, Spin } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import CommentForm from '../CommnetForm';
import ReplyForm from '../ReplyForm';
import moment from '@/utils/moment';
import styles from './style.less';

const CommentItem = ({ id, text, created, updated, creator }) => (
  <div className={styles.reply}>
    <Comment
      className={styles.comment}
      author={<Link to={`/user/${creator.id}`}>{creator.username}</Link>}
      avatar={<Avatar icon="user" alt={creator.username} />}
      content={<p>{text}</p>}
      datetime={
        <Tooltip title={moment.datetime(created)}>
          <span>{moment.fromNow(created)}</span>
        </Tooltip>
      }
    ></Comment>
  </div>
);

const CommentWrapper = props => {
  function handleClickReply(_id) {
    props.onClickReply(_id);
  }

  const { id, text, created, updated, creator, replies, showReplyForm } = props;

  return (
    <div className={styles.commentWrapper}>
      <Comment
        className={styles.comment}
        actions={[
          <span onClick={() => handleClickReply(id)} key="comment-nested-reply-to">
            回复
          </span>,
        ]}
        author={<Link to={`/user/${creator.id}`}>{creator.username}</Link>}
        avatar={<Avatar icon="user" alt={creator.username} />}
        content={<p>{text}</p>}
        datetime={
          <Tooltip title={moment.datetime(created)}>
            <span>{moment.fromNow(created)}</span>
          </Tooltip>
        }
      >
        {/* reply form */}
        {showReplyForm && <ReplyForm parent_id={id} />}

        {/* replies list */}
        {replies.map(reply => (
          <CommentItem key={reply.id} {...reply} />
        ))}
      </Comment>
    </div>
  );
};

const Comments = props => {
  const { loaddingCommentList, comment_list, dispatch, id } = props;
  const [replyFormCommentId, setReplyFormCommentId] = useState('');

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'comment/fetchProposalComment',
        payload: { id },
      });
    }
  }, []);

  function handleClickReply(_id) {
    setReplyFormCommentId(_id);
  }

  function isShowReplyForm(_id) {
    return _id === replyFormCommentId;
  }

  return (
    <div className={styles.container}>
      <CommentForm />
      {loaddingCommentList && <Spin className={styles.loading} />}
      {comment_list.map(comment => (
        <CommentWrapper
          key={comment.id}
          {...comment}
          onClickReply={handleClickReply}
          showReplyForm={isShowReplyForm(comment.id)}
        />
      ))}
    </div>
  );
};

export default connect(({ comment, loading }) => ({
  comment_list: comment.comment_list,
  loaddingCommentList: loading.effects['comment/fetchProposalComment'],
}))(Comments);
