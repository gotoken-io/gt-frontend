import React from 'react';
import { InputNumber } from 'antd';
import styles from './style.less';
import { FormattedMessage } from 'umi-plugin-react/locale';

const InputDayHour = props => {
  const { settings, values, disabled } = props;

  return (
    <div className={styles.container}>
      <span>
        <InputNumber
          min={settings.day.min}
          max={settings.day.max}
          value={values.day}
          onChange={val => props.onChange(val, 'day')}
          disabled={disabled}
        />
        <FormattedMessage id="app.day" />
      </span>
      <span>
        <InputNumber
          min={settings.hour.min}
          max={settings.hour.max}
          value={values.hour}
          onChange={val => props.onChange(val, 'hour')}
          disabled={disabled}
        />
        <FormattedMessage id="app.hour" />
      </span>
    </div>
  );
};

export default InputDayHour;
