import { Button, Form, Input, Popover, Progress, message } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import styles from './style.less';
import layoutStyles from '@/layouts/style.less';

const FormItem = Form.Item;
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

@connect(({ loading }) => ({
  submittingRegister: loading.effects['login/register'],
}))
class Register extends Component {
  state = {
    confirmDirty: false,
    visible: false,
    help: '',
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields(
      {
        force: true,
      },
      (err, values) => {
        if (!err) {
          dispatch({
            type: 'login/register',
            payload: { ...values },
          });
        }
      },
    );
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');

    if (value && value.length > 9) {
      return 'ok';
    }

    if (value && value.length > 5) {
      return 'pass';
    }

    return 'poor';
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;

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

  checkPassword = (rule, value, callback) => {
    const { visible, confirmDirty } = this.state;

    if (!value) {
      this.setState({
        help: formatMessage({
          id: 'userandregister.password.required',
        }),
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });

      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }

      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;

        if (value && confirmDirty) {
          form.validateFields(['confirm'], {
            force: true,
          });
        }

        callback();
      }
    }
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
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

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { help, visible } = this.state;
    return (
      // <div className={layoutStyles.userMain}>
      <Form onSubmit={this.handleSubmit}>
        <FormItem>
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
              placeholder={formatMessage({
                id: 'userandregister.email.placeholder',
              })}
            />,
          )}
        </FormItem>

        <FormItem>
          {getFieldDecorator('username', {
            rules: [
              {
                pattern: /^[a-z0-9]+$/,
                message: '仅支持输入小写字母(a-z)和数字(0-9)',
              },
              {
                required: true,
                message: formatMessage({
                  id: 'userandregister.userName.required',
                }),
              },
            ],
          })(
            <Input
              size="large"
              placeholder={formatMessage({
                id: 'userandregister.login.userName',
              })}
            />,
          )}
        </FormItem>

        <FormItem help={help}>
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
                {passwordStatusMap[this.getPasswordStatus()]}
                {this.renderPasswordProgress()}
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
                  validator: this.checkPassword,
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
        </FormItem>
        <FormItem>
          {getFieldDecorator('confirm', {
            rules: [
              {
                required: true,
                message: formatMessage({
                  id: 'userandregister.confirm-password.required',
                }),
              },
              {
                validator: this.checkConfirm,
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
        </FormItem>
        <FormItem>
          <Button
            size="large"
            loading={submitting}
            className={styles.submit}
            type="primary"
            htmlType="submit"
          >
            <FormattedMessage id="userandregister.register.register" />
          </Button>

          {/* <Link className={styles.login} to="/login">
              <FormattedMessage id="userandregister.register.sign-in" />
            </Link> */}
        </FormItem>
      </Form>
      // </div>
    );
  }
}

export default Form.create()(Register);
