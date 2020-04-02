import React from 'react';
import { Form, Icon, Input, Button, Checkbox, Row, Tabs } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import { connect } from 'dva';
import styles from './index.less';
import layoutStyles from '@/layouts/style.less';
import MetamaskLogin from './utils/MetamaskLogin';
import Register from '../Register/index';

const { TabPane } = Tabs;
@connect(({ login, loading }) => ({
  // login,
  // submitting: loading.effects['login/login'],
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

  loginWithAddress(address) {
    console.log('Login with address', address);
    this.props.dispatch({
      type: 'login/loginWithAddress',
      payload: { address, remember: this.props.form.getFieldValue('remember') },
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    console.log(this.props);
    return (
      <div className={layoutStyles.userMain}>
        <div className={styles.contom}>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Tabs>
              <TabPane tab="SIGN IN" key="1" style={{ marginTop: 20 }}>
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
                    Sign In
                  </Button>
                </Form.Item>

                <Form.Item>
                  <div className={styles.links}>
                    <Link to="/forget-password">忘记密码</Link>
                    {/* <Link to="/register">注册</Link> */}
                  </div>
                </Form.Item>
                <div className="margin" />
                <Form.Item>
                  <MetamaskLogin onLogin={address => this.loginWithAddress(address)} />
                </Form.Item>
              </TabPane>
              <TabPane tab="SIGN UP" key="2" style={{ marginTop: 20 }}>
                <Register />
              </TabPane>
            </Tabs>
          </Form>
        </div>
      </div>
    );
  }
}

export default Form.create({
  name: 'login',
})(Login);
