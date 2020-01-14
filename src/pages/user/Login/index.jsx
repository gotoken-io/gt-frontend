import React from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import { connect } from 'dva';
import styles from './index.less';
import layoutStyles from '@/layouts/style.less';

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class Login extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
        const { dispatch } = this.props;
        dispatch({
          type: 'login/login',
          payload: { ...values },
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={layoutStyles.userMain}>
        <h3>
          <FormattedMessage id="userandregister.login.login" />
        </h3>

        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator('email', {
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: 'userandregister.email.required',
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
                placeholder="email 或 用户名"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: 'userandregister.password.required',
                  }),
                },
              ],
            })(
              <Input
                size="large"
                prefix={
                  <Icon
                    type="lock"
                    style={{
                      color: 'rgba(0,0,0,.25)',
                    }}
                  />
                }
                type="password"
                placeholder="密码"
              />,
            )}
          </Form.Item>

          <Form.Item>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(<Checkbox>记住密码</Checkbox>)}
          </Form.Item>

          <Form.Item>
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              className="login-form-button"
              block
            >
              登录
            </Button>
          </Form.Item>

          <Form.Item>
            <div className={styles.links}>
              <Link to="/forget-password">忘记密码</Link>
              <Link to="/register">注册</Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Form.create({
  name: 'login',
})(Login);
