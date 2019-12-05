import React, { Component } from 'react';
import { Form, Input, Select, Radio, Button } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import BraftEditor from 'braft-editor';
import router from 'umi/router';
import { connect } from 'dva';
import 'braft-editor/dist/index.css';
import styles from './style.less';

const { TextArea } = Input;
const { Option } = Select;

@connect(({ proposal, loading }) => ({
  detail: proposal.detail,
  zone_list: proposal.zone_list,
  currency_list: proposal.currency_list,
  submitting: loading.effects['proposal/createProposal'],
}))
class Create extends Component {
  state = {
    // editorState: null,
    form: {},
  };

  async componentDidMount() {
    const { dispatch, match } = this.props;
    // get proposal id from url params
    const { id } = match.params;

    if (dispatch) {
      // 存在 id && 编辑提案
      if (id) {
        dispatch({
          type: 'proposal/fetchProposal',
          payload: { id },
        }).then(data => {
          this.setFormValues(data);
        });
        // 回填表单内容
        //
      }

      dispatch({
        type: 'proposal/fetchAllProposalZone',
      });

      dispatch({
        type: 'proposal/fetchAllCurrency',
      });
    }

    // 假设此处从服务端获取html格式的编辑器内容
    // const htmlContent = '';
    // // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorState数据
    // this.setState({
    //   editorState: BraftEditor.createEditorState(htmlContent),
    // });
  }

  setFormValues = detail => {
    const { form } = this.props;

    if (detail) {
      Object.keys(form.getFieldsValue()).forEach(key => {
        const obj = {};
        obj[key] = detail[key] || null;

        switch (key) {
          case 'has-budget':
            if (obj['amount'] === '0') {
              obj['has-budget'] = 0;
            } else {
              obj['has-budget'] = 1;
              // form.setFieldsValue({ amount: detail['amount'] });
              this.setState({
                form: { ...form, 'has-budget': obj['has-budget'] },
              });

              form.setFieldsValue({ currency_id: detail['currency_unit']['id'] });
            }
            form.setFieldsValue({ 'has-budget': obj['has-budget'] });
            form.setFieldsValue({ amount: detail['amount'] });

            break;
          case 'zone_id':
            form.setFieldsValue({ zone_id: detail['zone']['id'] });
            break;
          case 'detail':
            form.setFieldsValue({ detail: BraftEditor.createEditorState(detail['detail']) });
            break;
          case 'tag':
            if (detail.tag === '') {
              form.setFieldsValue({ tag: [] });
            } else {
              form.setFieldsValue({ tag: detail.tag.split(',') });
            }
            break;
          default:
            form.setFieldsValue(obj);
            break;
        }
        // console.log(obj);
      });
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const { dispatch, match } = this.props;
        // get proposal id from url params
        const { id } = match.params;

        let tag = values.tag instanceof Array && values.tag.join(','); // convert array to string

        // filter some form value
        let submitData = {
          ...values,
          tag: tag === false ? '' : tag, // 如果 tag=false, 传空字符串
          detail: values.detail.toHTML(), // or values.content.toHTML()
        };

        // 无预算
        if (values['has-budget'] === 0) {
          submitData = {
            ...submitData,
            amount: '0',
            currency_id: null,
          };
        }

        console.log('submitData', submitData);

        if (id) {
          dispatch({
            type: 'proposal/updateProposal',
            payload: {
              id,
              ...submitData,
            },
          });
        } else {
          // 创建提案
          dispatch({
            type: 'proposal/createProposal',
            payload: { ...submitData },
          });
        }
      }
    });
  };

  handleChange = e => {
    console.log(e);
    this.setState({
      form: { ...this.state.form, [e.target.name]: e.target.value },
    });
  };

  // submitContent = async () => {
  //   // 在编辑器获得焦点时按下ctrl+s会执行此方法
  //   // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
  //   const htmlContent = this.state.editorState.toHTML();
  //   // const result = await saveEditorContent(htmlContent);
  // };

  // handleEditorChange = editorState => {
  //   this.setState({ editorState });
  // };

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

    const { form } = this.state;
    const { zone_list, currency_list, match } = this.props;
    const { id } = match.params;

    return (
      <PageHeaderWrapper title="创建提案">
        <div className={styles.container}>
          <Form className={styles.formContainer} {...formItemLayout} onSubmit={this.handleSubmit}>
            {!id && (
              <Form.Item label="提案专区">
                {getFieldDecorator('zone_id', {
                  rules: [
                    {
                      required: true,
                      message: '请选择提案专区!',
                    },
                  ],
                })(
                  <Select style={{ width: 120 }} name="proposal-zone">
                    {zone_list.map(zone => (
                      <Option key={zone.id} value={zone.id}>
                        {zone.name}
                      </Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            )}

            <Form.Item label="提案名称">
              {getFieldDecorator('title', {
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
                <Radio.Group name="has-budget" onChange={this.handleChange}>
                  <Radio value={0}>无预算</Radio>
                  <Radio value={1}>有预算</Radio>
                </Radio.Group>,
              )}

              {/* 选择了 有预算 */}
              {form['has-budget'] === 1 && (
                <div className={styles.budget}>
                  {getFieldDecorator('amount', {
                    rules: [
                      {
                        required: true,
                        message: '请输入提案预算!',
                      },
                    ],
                  })(<Input style={{ width: 200 }} placeholder="请输入预算金额" />)}

                  {getFieldDecorator('currency_id', {
                    rules: [],
                  })(
                    <Select name="budget-unit" style={{ width: 120, marginLeft: 10 }}>
                      {currency_list &&
                        currency_list.map(currency => (
                          <Option key={currency.id} value={currency.id}>
                            {currency.unit}
                          </Option>
                        ))}
                    </Select>,
                  )}
                </div>
              )}
            </Form.Item>

            <Form.Item label="提案标签">
              {getFieldDecorator('tag')(
                <Select mode="tags" style={{ width: '100%' }} placeholder="提案标签">
                  {/* {children} */}
                </Select>,
              )}
            </Form.Item>

            <Form.Item label="提案详情">
              {getFieldDecorator('detail', {
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

              <Button onClick={() => router.go(-1)} size="large">
                取消
              </Button>
            </Form.Item>
          </Form>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create({ name: 'create-proposal' })(Create);
