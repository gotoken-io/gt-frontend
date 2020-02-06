import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Divider, Upload, Icon, Spin, Slider } from 'antd';
import ImgCrop from 'antd-img-crop';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getFielUrl, beforeUpload, getBase64 } from '@/utils/upload';
import { connect } from 'dva';
import 'rc-color-picker/assets/index.css';
import ColorPicker from 'rc-color-picker';

import BraftEditor from 'braft-editor';
import Image from '@/components/Image';
import 'braft-editor/dist/index.css';
import styles from './style.less';

const { TextArea } = Input;

const ImgCropConfig = {
  width: 400,
  height: 400,
};

const controls = [
  'undo',
  'redo',
  'separator',
  'font-size',
  'line-height',
  'letter-spacing',
  'separator',
  'text-color',
  'bold',
  'italic',
  'underline',
  'strike-through',
  'separator',
  'superscript',
  'subscript',
  'remove-styles',
  'emoji',
  'separator',
  'text-indent',
  'text-align',
  'separator',
  'headings',
  'list-ul',
  'list-ol',
  'blockquote',
  'code',
  'separator',
  'link',
  'separator',
  'hr',
  'separator',
  'separator',
  'clear',
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

const VOTE_DURATION_MIN = 5;
const VOTE_DURATION_MAX = 1000;
const VOTE_DURATION_DEFAULT = [24, 72];

const ProposalZoneForm = props => {
  // state
  const [cover, setCover] = useState(null);
  const [coverStream, setCoverStream] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [voteDuration, setVoteDuration] = useState(VOTE_DURATION_DEFAULT);
  const [themeColor, setThemeColor] = useState(props.primaryColor);

  // prpos
  const { id, dispatch, zone_detail } = props;
  const { getFieldDecorator } = props.form;

  useEffect(() => {
    // 清空 state, 防止从 update proposal zone 中带数据来
    setCover(null);
    setCoverStream(null);
    setThemeColor(props.primaryColor);

    if (dispatch) {
      if (id) {
        dispatch({
          type: 'proposal/fetchProposalZone',
          payload: { id },
        }).then(detail => {
          setFormValues(detail);
        });
      }
    }

    // if (zone_detail.cover) {
    //   setCoverStream(getFielUrl(zone_detail.cover));
    // }
  }, []);

  function setFormValues(detail) {
    const { form } = props;

    if (detail) {
      if (detail.cover) {
        setCover(detail.cover);
        setCoverStream(getFielUrl(detail.cover));
      }

      if (detail.theme_color) {
        setThemeColor(detail.theme_color);
      }

      if (detail.vote_duration_hours_min && detail.vote_duration_hours_max) {
        setVoteDuration([detail.vote_duration_hours_min, detail.vote_duration_hours_max]);
      }

      Object.keys(form.getFieldsValue()).forEach(key => {
        const obj = {};
        obj[key] = detail[key] || null;

        form.setFieldsValue(obj);

        switch (key) {
          case 'detail':
            form.setFieldsValue({ detail: BraftEditor.createEditorState(detail.detail) });
            break;
          default:
            form.setFieldsValue(obj);
            break;
        }
        // console.log(obj);
      });
    }
  }

  function handleUploadChange(info) {
    const { status, response } = info.file;
    console.log(info.file);

    if (status === 'uploading') {
      setUploading(true);
    }

    if (status === 'done') {
      // console.log(response.data.key);

      setUploading(false);
      const filename = response.data;

      setCover(filename);

      // change proposal zone cover
      getBase64(info.file.originFileObj, imageUrl => {
        setCoverStream(imageUrl);
      });
    }
  }

  function onVoteDurationChange(value) {
    console.log('onVoteDurationChange', value);
    setVoteDuration(value);
  }

  function changeHandler(colors) {
    console.log(colors);
    setThemeColor(colors.color);
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);

        // filter some form value
        const submitData = {
          ...values,
          cover,
          theme_color: themeColor,
          vote_addr_weight_json: values.vote_addr_weight_json ? values.vote_addr_weight_json : '',
          vote_rule: values.vote_rule ? values.vote_rule : '',
          detail: values.detail.toHTML(), // or values.content.toHTML()
          vote_duration_hours_min: voteDuration[0],
          vote_duration_hours_max: voteDuration[1],
        };

        console.log(submitData);

        if (dispatch) {
          if (id) {
            // update proposal zone
            dispatch({
              type: 'proposal/updateProposalZone',
              payload: { ...submitData, id },
            });
          } else {
            // create proposal zone
            dispatch({
              type: 'proposal/createProposalZone',
              payload: { ...submitData },
            });
          }
        }
      }
    });
  }

  const FormContent = (
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
          {coverStream && (
            <div>
              <Image base64={coverStream} src={cover} size={200} />
            </div>
          )}

          <ImgCrop {...ImgCropConfig}>
            <Upload
              action="/server/upload/image/"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleUploadChange}
            >
              <Button type="primary" loading={uploading}>
                {uploading ? (
                  '上传中...'
                ) : (
                  <span>
                    <Icon type="upload" />
                    选择封面
                  </span>
                )}
              </Button>
            </Upload>
          </ImgCrop>
        </Form.Item>

        <Divider />

        <Form.Item label="提案专区风格(css)">
          <div className={styles.colorPicker}>
            <ColorPicker animation="slide-up" color={themeColor} onChange={changeHandler} />
          </div>
        </Form.Item>

        <Form.Item label="投票规则">
          {getFieldDecorator('vote_rule')(<TextArea placeholder="" rows={4} />)}
        </Form.Item>

        <Form.Item label="投票持续时间(小时)">
          {getFieldDecorator('vote_duration')(
            <Slider
              range
              min={VOTE_DURATION_MIN}
              max={VOTE_DURATION_MAX}
              onChange={onVoteDurationChange}
            />,
          )}
          <div>
            <span>
              {voteDuration[0]}小时 ~ {voteDuration[1]}小时
            </span>
            <span></span>
          </div>
        </Form.Item>

        <Form.Item label="可投票地址权重分配">
          {getFieldDecorator('vote_addr_weight_json')(<TextArea placeholder="" rows={4} />)}
        </Form.Item>

        <Form.Item {...tailFormItemLayout} className={styles.buttons}>
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            loading={id ? props.submitingUpdate : props.submitingCreate}
          >
            提交
          </Button>

          <Button size="large">取消</Button>
        </Form.Item>
      </Form>
    </div>
  );

  return (
    <PageHeaderWrapper title={props.title}>
      {id ? <Spin spinning={props.loading}>{FormContent}</Spin> : FormContent}
    </PageHeaderWrapper>
  );
};

const FormWrapper = Form.create({ name: 'proposal-zone-form' })(ProposalZoneForm);

export default connect(({ settings, proposal, loading }) => ({
  primaryColor: settings.primaryColor,
  currency_list: proposal.currency_list,
  zone_detail: proposal.zone_detail,
  loading: loading.effects['proposal/fetchProposalZone'],
  submitingCreate: loading.effects['proposal/createProposalZone'],
  submitingUpdate: loading.effects['proposal/updateProposalZone'],
}))(FormWrapper);
