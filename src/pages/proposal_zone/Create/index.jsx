import React, { Component } from 'react';
import { Form, Input, Button, Divider, Upload, Icon, message } from 'antd';
import ImgCrop from 'antd-img-crop';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { beforeUpload } from '@/utils/upload';
import BraftEditor from 'braft-editor';
import { connect } from 'dva';
import 'braft-editor/dist/index.css';
import styles from './style.less';

const { TextArea } = Input;

const ImgCropConfig = {
  width: 400,
  height: 400,
};

@connect(({ proposal, loading }) => ({
  currency_list: proposal.currency_list,
  submitting: loading.effects['proposal/createProposalZone'],
}))
class Create extends Component {
  state = {
    cover: '',
  };

  handleUploadChange = info => {
    const { status, response } = info.file;

    if (status === 'uploading') {
      // this.setState({ loading: true });
      return;
    }
    if (status === 'done') {
      console.log(response.data.key);
      this.setState({ cover: response.data.key });
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        const { cover } = this.state;

        console.log('Received values of form: ', values);

        // filter some form value
        const submitData = {
          ...values,
          cover,
          theme_style: values.theme_style ? values.theme_style : '',
          vote_addr_weight_json: values.vote_addr_weight_json ? values.vote_addr_weight_json : '',
          vote_rule: values.vote_rule ? values.vote_rule : '',
          detail: values.detail.toHTML(), // or values.content.toHTML()
        };

        console.log(submitData);

        // 发起 创建提案 POST API
        dispatch({
          type: 'proposal/createProposalZone',
          payload: { ...submitData },
        });
      }
    });
  };

  render() {
    const { submitting } = this.props;
    const { getFieldDecorator } = this.props.form;

    const controls = [
      'bold',
      'italic',
      'underline',
      'text-color',
      'separator',
      'link',
      'separator',
    ];

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    return (
      <PageHeaderWrapper title="创建提案专区">
        <div className={styles.container}>
          <Form className={styles.formContainer} {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item label="提案专区简称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入提案专区简称',
                  },
                ],
              })(<Input />)}
            </Form.Item>

            <Form.Item label="提案专区标题">
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: '请输入提案专区标题',
                  },
                ],
              })(<Input />)}
            </Form.Item>

            <Form.Item label="提案专区token名称">
              {getFieldDecorator('token', {
                rules: [
                  {
                    required: true,
                    message: '请输入提案专区token名称!',
                  },
                ],
              })(<Input />)}
            </Form.Item>

            <Form.Item label="提案专区简介">
              {getFieldDecorator('summary', {
                rules: [
                  {
                    required: true,
                    message: '请输入提案专区简介!',
                  },
                ],
              })(<TextArea rows={4} />)}
            </Form.Item>

            <Form.Item label="提案专区详情">
              {getFieldDecorator('detail', {
                validateTrigger: 'onBlur',
                rules: [
                  {
                    required: true,
                    validator: (_, value, callback) => {
                      if (value.isEmpty()) {
                        callback('请输入提案专区详情内容');
                      } else {
                        callback();
                      }
                    },
                  },
                ],
              })(
                <BraftEditor
                  className={styles.richEditor}
                  controls={controls}
                  placeholder="请输入提案专区详情内容"
                />,
              )}
            </Form.Item>

            <Form.Item label="上传提案专区封面">
              <ImgCrop {...ImgCropConfig}>
                <Upload
                  action="/server/upload/image/"
                  beforeUpload={beforeUpload}
                  onChange={this.handleUploadChange}
                >
                  <Button>
                    <Icon type="upload" /> 选择封面
                  </Button>
                </Upload>
              </ImgCrop>
            </Form.Item>

            <Divider />

            <Form.Item label="提案专区风格(css)">
              {getFieldDecorator('theme_style')(<TextArea placeholder="" rows={4} />)}
            </Form.Item>

            <Form.Item label="投票规则">
              {getFieldDecorator('vote_rule')(<TextArea placeholder="" rows={4} />)}
            </Form.Item>

            <Form.Item label="可投票地址权重分配">
              {getFieldDecorator('vote_addr_weight_json')(<TextArea placeholder="" rows={4} />)}
            </Form.Item>

            <Form.Item {...tailFormItemLayout} className={styles.buttons}>
              <Button size="large" type="primary" htmlType="submit" disabled={submitting}>
                提交
              </Button>

              <Button size="large">取消</Button>
            </Form.Item>
          </Form>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create({ name: 'create-proposal' })(Create);
