import React, { Component } from 'react';
import { Form, Input, Select, Radio, Button } from 'antd';
import styles from './style.less';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';

const { TextArea } = Input;
const { Option } = Select;

class Create extends Component {
  state = {
    editorState: null,
  };

  handleChange = value => {
    console.log(`selected ${value}`);
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  async componentDidMount() {
    // 假设此处从服务端获取html格式的编辑器内容
    const htmlContent = '';
    // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorState数据
    this.setState({
      editorState: BraftEditor.createEditorState(htmlContent),
    });
  }

  submitContent = async () => {
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    const htmlContent = this.state.editorState.toHTML();
    // const result = await saveEditorContent(htmlContent);
  };

  handleEditorChange = editorState => {
    this.setState({ editorState });
  };

  render() {
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

    const children = [];
    for (let i = 10; i < 36; i++) {
      children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
    }

    return (
      <PageHeaderWrapper>
        <div className={styles.container}>
          <Form className={styles.formContainer} {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item label="提案专区">
              {getFieldDecorator('zone', {
                rules: [
                  {
                    required: true,
                    message: '请选择提案专区!',
                  },
                ],
              })(
                <Select style={{ width: 120 }} onChange={this.handleChange}>
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                </Select>,
              )}
            </Form.Item>

            <Form.Item label="提案名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入提案名称!',
                  },
                ],
              })(<Input />)}
            </Form.Item>

            <Form.Item label="提案简介">
              {getFieldDecorator('summary', {
                rules: [
                  {
                    required: true,
                    message: '请输入提案简介!',
                  },
                ],
              })(<TextArea rows={4} />)}
            </Form.Item>

            <Form.Item label="提案预算">
              {getFieldDecorator('has-budget', {
                rules: [
                  {
                    required: true,
                    message: '请输入提案简介!',
                  },
                ],
              })(
                <Radio.Group onChange={this.handleChange}>
                  <Radio value={1}>A</Radio>
                  <Radio value={4}>D</Radio>
                </Radio.Group>,
              )}

              <div className={styles.budget}>
                {getFieldDecorator('budget', {
                  rules: [
                    {
                      required: true,
                      message: '请输入提案预算!',
                    },
                  ],
                })(<Input style={{ width: 200 }} />)}

                <Select style={{ width: 120, marginLeft: 10 }} onChange={this.handleChange}>
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                </Select>
              </div>
            </Form.Item>

            <Form.Item label="提案标签">
              {getFieldDecorator('tag', {
                rules: [],
              })(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  placeholder="Tags Mode"
                  onChange={this.handleChange}
                >
                  {children}
                </Select>,
              )}
            </Form.Item>

            <Form.Item label="提案详情">
              {getFieldDecorator('content', {
                validateTrigger: 'onBlur',
                rules: [
                  {
                    required: true,
                    validator: (_, value, callback) => {
                      if (value.isEmpty()) {
                        callback('请输入正文内容');
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
                  placeholder="请输入正文内容"
                />,
              )}
            </Form.Item>

            <Form.Item {...tailFormItemLayout} className={styles.buttons}>
              <Button size="large" type="primary" htmlType="submit">
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
