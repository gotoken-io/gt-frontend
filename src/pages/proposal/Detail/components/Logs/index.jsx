import React, { useState, useEffect } from 'react';
import { Timeline, Spin, Button } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import moment from '@/utils/moment';
import {
  getProposalEventByKey,
  getProposalEventTextByKey,
  getStatusTextByKey,
} from '@/utils/proposal';
import { isCreatorOrAdmin, isAdmin } from '@/utils/user';
import UserAvatar from '@/components/User/UserAvatar';
import UpdateProposalProgress from '../UpdateProgressModal';
import styles from './style.less';

const Logs = props => {
  // state
  const [updateProgressVisible, setUpdateProgressVisible] = useState(false);

  const { id, logs, loading, proposal_creator, currentUser } = props;

  useEffect(() => {
    const { dispatch } = props;
    if (dispatch) {
      dispatch({
        type: 'proposal/queryProposalLogs',
        payload: {
          id,
        },
      });
    }
  }, []);

  function renderEventContent(event_key, from_value, to_value) {
    const event_text = <span>{getProposalEventTextByKey(event_key)}</span>;
    let content;
    switch (event_key) {
      case 'update_status':
        if (to_value) {
          const content_text = `${getProposalEventTextByKey(event_key)}为:${getStatusTextByKey(
            to_value,
          )}`;
          content = <span>{content_text}</span>;
        } else {
          content = event_text;
        }
        break;

      default:
        content = event_text;
        break;
    }

    return content;
  }

  return (
    <div className={styles.container}>
      {isCreatorOrAdmin({ currentUser, creator: proposal_creator }) && (
        <div className={styles.actions}>
          <Button type="primary" onClick={() => setUpdateProgressVisible(true)}>
            更新项目进度
          </Button>
          <UpdateProposalProgress
            id={id}
            visible={updateProgressVisible}
            onCancel={() => setUpdateProgressVisible(false)}
          />
        </div>
      )}

      <Spin spinning={loading}>
        <Timeline>
          {logs.length > 0 &&
            logs.map(({ operator, event_key, from_value, to_value, op_time }) => (
              <Timeline.Item color={getProposalEventByKey(event_key).color}>
                <span className={styles['op-time']}>{moment.datetime(op_time)}</span>
                <div className={styles.item}>
                  <div className={styles.head}>
                    <span className={styles.user}>
                      <UserAvatar {...operator} />
                      <Link className={styles.name} to={`/user/${operator.id}`}>
                        {operator.username}
                      </Link>
                    </span>
                    <div className={styles.content}>
                      {renderEventContent(event_key, from_value, to_value)}
                    </div>
                  </div>

                  {event_key === 'update_progress' && (
                    <div className={styles['udpate-progress']}> {to_value}</div>
                  )}
                </div>
              </Timeline.Item>
            ))}
        </Timeline>
      </Spin>
    </div>
  );
};

export default connect(({ user, proposal, loading }) => ({
  currentUser: user.currentUser,
  logs: proposal.logs,
  loading: loading.effects['proposal/queryProposalLogs'],
}))(Logs);
