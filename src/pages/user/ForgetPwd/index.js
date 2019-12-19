import React from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { connect } from 'dva';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import styles from './style.less';
import layoutStyles from '@/layouts/style.less';

const ForgetPwd = props => {
  const { getFieldDecorator } = props.form;
  const { postForgetPwdLoading } = props;

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const { dispatch } = props;
        if (dispatch) {
          dispatch({
            type: 'user/postForgetPwd',
            payload: values,
          });
        }
      }
    });
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

        <Form.Item>
          <Button
            loading={postForgetPwdLoading}
            size="large"
            type="primary"
            htmlType="submit"
            className="login-form-button"
            block
          >
            发送重置密码邮件
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

const ForgetPwdWrapper = Form.create({
  name: 'forget_pwd',
})(ForgetPwd);

export default connect(({ loading }) => ({
  postForgetPwdLoading: loading.effects['user/postForgetPwd'],
}))(ForgetPwdWrapper);
