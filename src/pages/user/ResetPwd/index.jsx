import React, { useState } from 'react';
import { Form, Icon, Input, Button, Popover, Progress } from 'antd';
import { connect } from 'dva';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import styles from './style.less';
import layoutStyles from '@/layouts/style.less';

const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <FormattedMessage id="userandregister.strength.strong" />
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <FormattedMessage id="userandregister.strength.medium" />
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <FormattedMessage id="userandregister.strength.short" />
    </div>
  ),
};
const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

const ResetPwd = props => {
  const [visible, setVisible] = useState(false);
  const [confirmDirty, setConfirmDirty] = useState(false);
  const [help, setHelp] = useState('');

  const { postResetPwdLoading, form, match } = props;
  const { getFieldDecorator } = form;

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        const submitValues = {
          ...values,
          token: match.params.token,
        };

        console.log('Received values of form: ', submitValues);

        const { dispatch } = props;
        if (dispatch) {
          dispatch({
            type: 'user/postResetPwd',
            payload: submitValues,
          });
        }
      }
    });
  };

  const getPasswordStatus = () => {
    const value = form.getFieldValue('password');

    if (value && value.length > 9) {
      return 'ok';
    }

    if (value && value.length > 5) {
      return 'pass';
    }

    return 'poor';
  };

  const checkConfirm = (rule, value, callback) => {
    if (value && value !== form.getFieldValue('password')) {
      callback(
        formatMessage({
          id: 'userandregister.password.twice',
        }),
      );
    } else {
      callback();
    }
  };

  const checkPassword = (rule, value, callback) => {
    if (!value) {
      setHelp(
        formatMessage({
          id: 'userandregister.password.required',
        }),
      );
      setVisible(!!value);

      callback('error');
    } else {
      setHelp('');

      if (!visible) {
        setVisible(!!value);
      }

      if (value.length < 6) {
        callback('error');
      } else {
        if (value && confirmDirty) {
          form.validateFields(['confirm'], {
            force: true,
          });
        }

        callback();
      }
    }
  };

  const renderPasswordProgress = () => {
    const value = form.getFieldValue('password');
    const passwordStatus = getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  return (
    <div className={layoutStyles.userMain}>
      <h3>重置密码</h3>

      <Form onSubmit={handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('email', {
            rules: [
              {
                required: true,
                message: formatMessage({
                  id: 'userandregister.email.required',
                }),
              },
              {
                type: 'email',
                message: formatMessage({
                  id: 'userandregister.email.wrong-format',
                }),
              },
            ],
          })(
            <Input
              size="large"
              prefix={
                <Icon
                  type="mail"
                  style={{
                    color: 'rgba(0,0,0,.25)',
                  }}
                />
              }
              placeholder="email"
            />,
          )}
        </Form.Item>

        <Form.Item help={help}>
          <Popover
            getPopupContainer={node => {
              if (node && node.parentNode) {
                return node.parentNode;
              }

              return node;
            }}
            content={
              <div
                style={{
                  padding: '4px 0',
                }}
              >
                {passwordStatusMap[getPasswordStatus()]}
                {renderPasswordProgress()}
                <div
                  style={{
                    marginTop: 10,
                  }}
                >
                  <FormattedMessage id="userandregister.strength.msg" />
                </div>
              </div>
            }
            overlayStyle={{
              width: 240,
            }}
            placement="right"
            visible={visible}
          >
            {getFieldDecorator('password', {
              rules: [
                {
                  validator: checkPassword,
                },
              ],
            })(
              <Input
                size="large"
                type="password"
                placeholder={formatMessage({
                  id: 'userandregister.password.placeholder',
                })}
              />,
            )}
          </Popover>
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('confirm', {
            rules: [
              {
                required: true,
                message: formatMessage({
                  id: 'userandregister.confirm-password.required',
                }),
              },
              {
                validator: checkConfirm,
              },
            ],
          })(
            <Input
              size="large"
              type="password"
              placeholder={formatMessage({
                id: 'userandregister.confirm-password.placeholder',
              })}
            />,
          )}
        </Form.Item>

        <Form.Item>
          <Button
            loading={postResetPwdLoading}
            size="large"
            type="primary"
            htmlType="submit"
            className="login-form-button"
            block
          >
            提交
          </Button>
        </Form.Item>
        <Form.Item className={styles.center}>
          <Link to="/">
            <Button type="link">
              {formatMessage({
                id: 'exception404.exception.back',
                defaultMessage: 'Back Home',
              })}
            </Button>
          </Link>
        </Form.Item>
      </Form>
    </div>
  );
};

const ResetPwdWrapper = Form.create({
  name: 'reset_pwd',
})(ResetPwd);

export default connect(({ loading }) => ({
  postResetPwdLoading: loading.effects['user/postResetPwd'],
}))(ResetPwdWrapper);
