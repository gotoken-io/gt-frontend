import React, { useState, useEffect } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { connect } from 'dva';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import styles from './style.less';
import layoutStyles from '@/layouts/style.less';

const ForgetPwd = props => {
  const { getFieldDecorator } = props.form;
  const { postForgetPwdLoading } = props;

  const [count, setCount] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      if (count > 0) {
        setCount(c => c - 1);
      }
    }, 1000);
  }, [count]);

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
          }).then(res => {
            if (res) {
              // 设置倒计时, 使按钮禁用
              setCount(60);
            }
          });
        }
      }
    });
  };

  return (
    <div className={layoutStyles.userMain}>
      <h3>
        <FormattedMessage id="user.reset_password" />
      </h3>

      <Form onSubmit={handleSubmit} className="login-form">
        <Form.Item>
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
            disabled={count > 0}
            loading={postForgetPwdLoading}
            size="large"
            type="primary"
            htmlType="submit"
            className="login-form-button"
            block
          >
            <FormattedMessage id="user.reset_password.emails_sent" values={{ count }} />
            <FormattedPlural value={count} zero="" other={`(${count})`} />
          </Button>
        </Form.Item>
        <Form.Item className={styles.center}>
          <Link to="/">
            <Button type="link">
              {formatMessage({
                id: 'app.back_home',
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
