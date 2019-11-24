import React from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
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
                    type="user"
                    style={{
                      color: 'rgba(0,0,0,.25)',
                    }}
                  />
                }
                placeholder="Username"
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
                placeholder="Password"
              />,
            )}
          </Form.Item>

          <Form.Item>
            {' '}
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(<Checkbox>Remember me</Checkbox>)}
          </Form.Item>

          <Form.Item>
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              className="login-form-button"
              block
            >
              Log in
            </Button>
          </Form.Item>

          <Form.Item>
            <div className={styles.links}>
              <Link to="/user/reset-pwd">Forgot password</Link>
              <Link to="/user/register">Register</Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Form.create({
  name: 'normal_login',
})(NormalLoginForm);
