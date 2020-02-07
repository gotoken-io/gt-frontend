import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Radio, Button, Spin, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import BraftEditor from 'braft-editor';
import router from 'umi/router';
import { converHoursToDayAndHour, convertToDayHourText } from '@/utils/utils';
import { connect } from 'dva';
import InputDayHour from '@/components/Proposal/InputDayHour';
import 'braft-editor/dist/index.css';
import styles from './style.less';

const { TextArea } = Input;
const { Option } = Select;

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

// 预计工时
const workHourSettings = {
  day: {
    default: 0,
    min: 0,
    max: 100,
  },
  hour: {
    default: 0,
    min: 0,
    max: 24,
  },
};

// 投票持续时间
const voteDurationSettings = {
  day: {
    default: 0,
    min: 0,
    max: 100,
  },
  hour: {
    default: 0,
    min: 0,
    max: 24,
  },
};

// editor controls
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

const ProposalForm = props => {
  // props
  const { id, zone_list, currency_list, proposal_category, loading } = props;
  const { getFieldDecorator } = props.form;

  // state
  const [formState, setFormState] = useState({});
  const [selectZone, setSelectZone] = useState();

  const [workHour, setWorkHour] = useState({
    day: workHourSettings.day.default,
    hour: workHourSettings.hour.default,
  });

  const [voteDuration, setVoteDuration] = useState({
    day: voteDurationSettings.day.default,
    hour: voteDurationSettings.hour.default,
  });

  useEffect(() => {
    const { dispatch } = props;

    if (dispatch) {
      // 存在 id && 编辑提案
      if (id) {
        dispatch({
          type: 'proposal/fetchProposal',
          payload: { id },
        }).then(data => {
          // set form value by proposal.id
          setFormValues(data);
        });
      }

      dispatch({
        type: 'proposal/fetchAllCategory',
      });

      dispatch({
        type: 'proposal/fetchAllProposalZone',
      });

      dispatch({
        type: 'proposal/fetchAllProposalZone',
      });

      dispatch({
        type: 'proposal/fetchAllCurrency',
      });
    }
  }, []);

  function setFormValues(detail) {
    const { form } = props;
    if (detail) {
      if (detail.estimated_hours) {
        setWorkHour(converHoursToDayAndHour(detail.estimated_hours));
      }

      if (detail.vote_duration_hours) {
        setVoteDuration(converHoursToDayAndHour(detail.vote_duration_hours));
      }

      Object.keys(form.getFieldsValue()).forEach(key => {
        const obj = {};
        obj[key] = detail[key] || null;

        switch (key) {
          case 'category_id':
            console.log('category_id', detail.category.id);
            if (detail.category.id) {
              form.setFieldsValue({ category_id: detail.category.id });
            }
            break;
          case 'has-budget':
            if (obj.amount === '0') {
              obj['has-budget'] = 0;
            } else {
              obj['has-budget'] = 1;

              setFormState({ ...formState, 'has-budget': obj['has-budget'] });

              form.setFieldsValue({ currency_id: detail.currency_unit.id });
            }
            form.setFieldsValue({ 'has-budget': obj['has-budget'] });
            form.setFieldsValue({ amount: detail.amount });

            break;
          case 'zone_id':
            form.setFieldsValue({ zone_id: detail.zone.id });
            break;
          case 'detail':
            form.setFieldsValue({ detail: BraftEditor.createEditorState(detail.detail) });
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
  }

  function onSelectProposalZone(value) {
    console.log('onChangeProposalZone', value);
    const zone = zone_list.find(d => d.id === value);
    setSelectZone({
      ...zone,
      vote_duration_min: converHoursToDayAndHour(zone.vote_duration_hours_min),
      vote_duration_max: converHoursToDayAndHour(zone.vote_duration_hours_max),
    });
  }

  function handleChange(e) {
    console.log(e);
    setFormState({ ...formState, [e.target.name]: e.target.value });
  }

  // 预计工时 onChange
  function onChangeWorkTime(value, type) {
    setWorkHour({ ...workHour, [type]: value });
  }

  // 投票时间 onChange
  function onChangeVoteDuration(value, type) {
    setVoteDuration({ ...voteDuration, [type]: value });
  }

  // validate before submit 投票时间
  function validateVoteDurationHours(value) {
    if (value < selectZone.vote_duration_hours_min) {
      message.error(`投票时间必须大于${convertToDayHourText(selectZone.vote_duration_min)}`);
      return false;
    }

    if (value > selectZone.vote_duration_hours_max) {
      message.error(`投票时间必须小于${convertToDayHourText(selectZone.vote_duration_max)}`);
      return false;
    }

    return true;
  }

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const { dispatch } = props;
        // get proposal id from url params
        const tag = values.tag instanceof Array && values.tag.join(','); // convert array to string

        // filter some form value
        let submitData = {
          ...values,
          estimated_hours: workHour.day * 24 + workHour.hour,
          vote_duration_hours: voteDuration.day * 24 + voteDuration.hour,
          tag: tag === false ? '' : tag, // 如果 tag=false, 传空字符串
          detail: values.detail.toHTML(), // or values.content.toHTML()
        };

        if (!validateVoteDurationHours(submitData.vote_duration_hours)) {
          return false;
        }

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

  const FormContent = (
    <div className={styles.container}>
      <Form className={styles.formContainer} {...formItemLayout} onSubmit={handleSubmit}>
        <Form.Item label="提案专区">
          {getFieldDecorator('zone_id', {
            rules: [
              {
                required: true,
                message: '请选择提案专区!',
              },
            ],
          })(
            <Select
              style={{ width: 250 }}
              placeholder="请选择要发布在哪个提案专区"
              name="proposal-zone"
              onSelect={onSelectProposalZone}
              disabled={!!id}
            >
              {zone_list.map(zone => (
                <Option key={zone.id} value={zone.id}>
                  {zone.name}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>

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

        <Form.Item label="提案分类">
          {getFieldDecorator('category_id', {
            rules: [
              //   {
              //     required: true,
              //     message: '请选择提案分类',
              //   },
            ],
          })(
            <Select name="category" placeholder="请选择提案分类" style={{ width: 200 }}>
              {proposal_category &&
                proposal_category.map(ctg => (
                  <Option key={ctg.id} value={ctg.id}>
                    {ctg.name}
                  </Option>
                ))}
            </Select>,
          )}
          {/* <Button type="link" style={{ marginLeft: 10 }} href="/manage/category">
            管理分类
          </Button> */}
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
                message: '请选择提案预算!',
              },
            ],
          })(
            <Radio.Group name="has-budget" onChange={handleChange}>
              <Radio value={0}>无预算</Radio>
              <Radio value={1}>有预算</Radio>
            </Radio.Group>,
          )}

          {/* 选择了 有预算 */}
          {formState['has-budget'] === 1 && (
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
                <Select
                  name="budget-unit"
                  placeholder="请选择token单位"
                  style={{ width: 200, marginLeft: 10 }}
                >
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

        <Form.Item label="提案预计工时">
          <InputDayHour settings={workHourSettings} values={workHour} onChange={onChangeWorkTime} />
        </Form.Item>

        <Form.Item label="提案投票时间">
          {/* 未来,提案创建后,会上链,投票时间也会上链,所以不能修改. */}
          <InputDayHour
            settings={voteDurationSettings}
            values={voteDuration}
            onChange={onChangeVoteDuration}
            disabled={id || !selectZone}
          />
          {selectZone && (
            <span>
              当前专区:{selectZone.name}, 投票时间限制为:{' '}
              {convertToDayHourText(selectZone.vote_duration_min)} ~{' '}
              {convertToDayHourText(selectZone.vote_duration_max)}
            </span>
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
          <Button
            type="primary"
            htmlType="submit"
            loading={id ? props.submitingUpdate : props.submitingCreate}
          >
            提交
          </Button>

          <Button onClick={() => router.go(-1)}>取消</Button>
        </Form.Item>
      </Form>
    </div>
  );

  return (
    <PageHeaderWrapper title={props.title}>
      {id ? <Spin spinning={loading}>{FormContent}</Spin> : FormContent}
    </PageHeaderWrapper>
  );
};

const FormWrapper = Form.create({ name: 'proposal-form' })(ProposalForm);

export default connect(({ proposal, loading }) => ({
  detail: proposal.detail,
  zone_list: proposal.zone_list,
  proposal_category: proposal.proposal_category,
  currency_list: proposal.currency_list,
  loading: loading.effects['proposal/fetchProposal'],
  submitingCreate: loading.effects['proposal/createProposal'],
  submitingUpdate: loading.effects['proposal/updateProposal'],
}))(FormWrapper);
