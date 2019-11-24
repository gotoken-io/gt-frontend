import React from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import styles from './style.less';
import layoutStyles from '@/layouts/style.less';

class ResetPwd extends React.Component {
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
            {getFieldDecorator('email', {
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
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              className="login-form-button"
              block
            >
              重置密码
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Form.create({
  name: 'reset_pwd',
})(ResetPwd);
