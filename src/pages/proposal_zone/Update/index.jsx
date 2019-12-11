import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Divider, Upload, Icon, message } from 'antd';
import ImgCrop from 'antd-img-crop';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { beforeUpload, getFielUrl } from '@/utils/upload';
import BraftEditor from 'braft-editor';
import { connect } from 'dva';
import router from 'umi/router';
import 'braft-editor/dist/index.css';
import styles from './style.less';

const { TextArea } = Input;

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

const controls = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator'];

const Create = props => {
  const [cover, setCover] = useState('');
  const [fileList, setFileList] = useState([]);

  const { submitting, dispatch, match, zone_detail } = props;
  const { getFieldDecorator } = props.form;

  const setFormValues = detail => {
    const { form } = props;

    if (detail) {
      setCover(detail.cover);
      setFileList([
        {
          uid: '1',
          name: detail.cover,
          status: 'done',
          url: getFielUrl(detail.cover),
        },
      ]);

      Object.keys(form.getFieldsValue()).forEach(key => {
        const obj = {};
        obj[key] = detail[key] || null;

        form.setFieldsValue(obj);

        switch (key) {
          case 'detail':
            form.setFieldsValue({ detail: BraftEditor.createEditorState(detail['detail']) });
            break;
          default:
            form.setFieldsValue(obj);
            break;
        }
        // console.log(obj);
      });
    }
  };

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'proposal/fetchProposalZone',
        payload: match.params,
      }).then(detail => {
        setFormValues(detail);
      });
    }
  }, [match.params]);

  const handleUploadChange = info => {
    const { status, response } = info.file;
    console.log(info.file);

    if (status === 'uploading') {
      // update file list
      setFileList([
        {
          uid: info.file.uid,
          name: info.file.name,
          status: info.file.status,
          url: info.file.originFileObj,
        },
      ]);

      return true;
    }
    if (status === 'done') {
      // console.log(response.data.key);
      const filename = response.data.key;

      setCover(filename);
      // update file list
      setFileList([
        {
          uid: info.file.uid,
          name: filename,
          status: 'done',
          url: getFielUrl(filename),
        },
      ]);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);

        // filter some form value
        const submitData = {
          ...values,
          cover,
          theme_style: values.theme_style ? values.theme_style : '',
          vote_addr_weight_json: values.vote_addr_weight_json ? values.vote_addr_weight_json : '',
          vote_rule: values.vote_rule ? values.vote_rule : '',
          detail: values.detail.toHTML(), // or values.content.toHTML()
        };

        // console.log(submitData);

        if (dispatch) {
          if (match.params.id) {
            dispatch({
              type: 'proposal/updateProposalZone',
              payload: { ...submitData, id: match.params.id },
            });
          } else {
            // 发起 创建提案 POST API
            dispatch({
              type: 'proposal/createProposalZone',
              payload: { ...submitData },
            });
          }
        }
      }
    });
  };

  return (
    <PageHeaderWrapper title="创建提案专区">
      <div className={styles.container}>
        <Form className={styles.formContainer} {...formItemLayout} onSubmit={handleSubmit}>
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
            {cover && (
              <ImgCrop>
                <Upload
                  action="/server/upload/image/"
                  beforeUpload={beforeUpload}
                  fileList={fileList}
                  onChange={handleUploadChange}
                >
                  <Button>
                    <Icon type="upload" /> 选择封面
                  </Button>
                </Upload>
              </ImgCrop>
            )}
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

            <Button
              onClick={() => {
                router.go(-1);
              }}
              size="large"
            >
              取消
            </Button>
          </Form.Item>
        </Form>
      </div>
    </PageHeaderWrapper>
  );
};

const CreateWrapper = Form.create({ name: 'create-proposal' })(Create);

export default connect(({ proposal, loading }) => ({
  zone_detail: proposal.zone_detail,
  currency_list: proposal.currency_list,
  submitting: loading.effects['proposal/createProposalZone'],
}))(CreateWrapper);
