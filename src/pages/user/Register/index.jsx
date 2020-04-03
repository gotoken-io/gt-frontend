import { Button, Form, Input, Popover, Progress, message } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import styles from './style.less';

const FormItem = Form.Item;
const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <FormattedMessage id="user.password.strong" />
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <FormattedMessage id="user.password.medium" />
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <FormattedMessage id="user.password.short" />
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
          id: 'user.password.twice',
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
          id: 'user.password.required',
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
                  id: 'user.email.required',
                }),
              },
              {
                type: 'email',
                message: formatMessage({
                  id: 'user.email.wrong_format',
                }),
              },
            ],
          })(
            <Input
              size="large"
              placeholder={formatMessage({
                id: 'user.email.placeholder',
              })}
            />,
          )}
        </FormItem>

        <FormItem>
          {getFieldDecorator('username', {
            rules: [
              {
                pattern: /^[a-z0-9]+$/,
                message: formatMessage({
                  id: 'user.username.wrong_format',
                }),
              },
              {
                required: true,
                message: formatMessage({
                  id: 'user.username.required',
                }),
              },
            ],
          })(
            <Input
              size="large"
              placeholder={formatMessage({
                id: 'user.username.placeholder',
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
                  <FormattedMessage id="user.password.strength" />
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
                  id: 'user.password.placeholder',
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
                  id: 'user.password.confirm_required',
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
                id: 'user.password.confirm',
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
            <FormattedMessage id="user.sign_up" />
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
