import { Button, Form, Input, message } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import { connect } from 'dva';
import AvatarView from './AvatarView';
import styles from './BaseView.less';

const FormItem = Form.Item;

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
class BaseView extends Component {
  view = undefined;

  componentDidMount() {
    this.setBaseInfo();
  }

  setBaseInfo = () => {
    const { currentUser, form } = this.props;

    if (currentUser) {
      Object.keys(form.getFieldsValue()).forEach(key => {
        const obj = {};
        obj[key] = currentUser[key] || null;
        form.setFieldsValue(obj);
      });
    }
  };

  getViewDom = ref => {
    this.view = ref;
  };

  handlerSubmit = event => {
    event.preventDefault();
    const { form, dispatch } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        // 发起 修改个人信息 POST API
        dispatch({
          type: 'user/postUserInfo',
          payload: { ...values },
        });
      }
    });
  };

  render() {
    // const { currentUser } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" hideRequiredMark>
            <FormItem
              label={formatMessage({
                id: 'userandaccountsettings.basic.email',
              })}
            >
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: formatMessage(
                      {
                        id: 'userandaccountsettings.basic.email-message',
                      },
                      {},
                    ),
                  },
                ],
              })(<Input disabled={true} />)}
            </FormItem>
            <FormItem
              label={formatMessage({
                id: 'userandaccountsettings.basic.nickname',
              })}
            >
              {getFieldDecorator('nickname', {
                rules: [
                  {
                    required: true,
                    message: formatMessage(
                      {
                        id: 'userandaccountsettings.basic.nickname-message',
                      },
                      {},
                    ),
                  },
                ],
              })(<Input />)}
            </FormItem>

            <FormItem
              label={formatMessage({
                id: 'userandaccountsettings.basic.profile',
              })}
            >
              {getFieldDecorator('sign', {
                rules: [
                  {
                    required: true,
                    message: formatMessage(
                      {
                        id: 'userandaccountsettings.basic.profile-message',
                      },
                      {},
                    ),
                  },
                ],
              })(
                <Input.TextArea
                  placeholder={formatMessage({
                    id: 'userandaccountsettings.basic.profile-placeholder',
                  })}
                  rows={4}
                />,
              )}
            </FormItem>

            <Button type="primary" onClick={this.handlerSubmit}>
              <FormattedMessage
                id="userandaccountsettings.basic.update"
                defaultMessage="Update Information"
              />
            </Button>
          </Form>
        </div>
        <div className={styles.right}>
          <AvatarView />
        </div>
      </div>
    );
  }
}

export default Form.create()(BaseView);
