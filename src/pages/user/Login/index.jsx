import React from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import styles from './index.less';
import layoutStyles from '@/layouts/style.less';

class NormalLoginForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
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
            {getFieldDecorator('username', {
              rules: [
                {
                  required: true,
                  message: 'Please input your username!',
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
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: 'Please input your Password!',
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
            {' '}
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
              <Link to="/reset-pwd">忘记密码</Link>
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
})(NormalLoginForm);
