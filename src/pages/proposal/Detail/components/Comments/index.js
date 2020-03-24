import React, { useEffect, useState } from 'react';
import { Tooltip, Comment, Spin, Modal } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import CommentForm from '../CommnetForm';
import ReplyForm from '../ReplyForm';
import moment from '@/utils/moment';
import UserAvatar from '@/components/User/UserAvatar';
import { isCreatorOrAdmin } from '@/utils/user';
import styles from './style.less';

const { confirm } = Modal;

const CommentItem = ({ id, text, created, updated, creator }) => (
  <div className={styles.reply}>
    <Comment
      className={styles.comment}
      author={<Link to={`/user/${creator.id}`}>{creator.username}</Link>}
      avatar={<UserAvatar {...creator} />}
      content={<p>{text}</p>}
      datetime={
        <Tooltip title={moment.datetime(created)}>
          <span>{moment.createTime(created)}</span>
        </Tooltip>
      }
    ></Comment>
  </div>
);

const CommentWrapper = props => {
  function handleClickReply(_id) {
    props.onClickReply(_id);
  }

  const { currentUser, data, showReplyForm } = props;
  const { id, text, created, creator, replies } = data;

  const commentActions = () => {
    const actionList = [
      <span
        className={styles.action}
        onClick={() => handleClickReply(id)}
        key="comment-nested-reply-to"
      >
        回复
      </span>,
    ];

    if (isCreatorOrAdmin({ currentUser, creator })) {
      actionList.push(
        <span onClick={() => props.onClickDelete(id, text)} key="comment-nested-delete">
          删除
        </span>,
      );
    }

    return actionList;
  };

  return (
    <div className={styles.commentWrapper}>
      <Comment
        className={styles.comment}
        actions={commentActions()}
        author={<Link to={`/user/${creator.id}`}>{creator.username}</Link>}
        avatar={<UserAvatar {...creator} />}
        content={<p>{text}</p>}
        datetime={
          <Tooltip title={moment.datetime(created)}>
            <span>{moment.createTime(created)}</span>
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
  const { loaddingCommentList, comment_list, dispatch, id, currentUser } = props;
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

  function handleDelete(_id, commentText) {
    confirm({
      title: '确定要删除这条评论吗?',
      content: commentText,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        if (dispatch) {
          // TODO: 可以改进成 promise
          dispatch({
            type: 'comment/deleteComment',
            payload: { id: _id },
          });
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
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
          data={comment}
          currentUser={currentUser}
          onClickReply={handleClickReply}
          onClickDelete={handleDelete}
          showReplyForm={isShowReplyForm(comment.id)}
        />
      ))}
    </div>
  );
};

export default connect(({ user, comment, loading }) => ({
  currentUser: user.currentUser,
  comment_list: comment.comment_list,
  deleteComment: loading.effects['comment/deleteComment'],
  loaddingCommentList: loading.effects['comment/fetchProposalComment'],
}))(Comments);
