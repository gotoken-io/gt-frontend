import React, { useEffect, useState } from 'react';
import { Select, Spin } from 'antd';
export const AutoCompleteCode = props => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { label, onAutoComplete } = props;
  return (
    <Select
      {...props}
      showSearch={true}
      optionFilterProp="children"
      onSearch={async content => {
        setLoading(true);
        let results = await onAutoComplete(content);
        console.log(results);
        setLoading(false);
        setList([...results]);
      }}
      filterOption={(input, option) =>
        option.props.value.includes(input) || option.props.children.includes(input)
      }
      placeholder={`请输入${label}昵称`}
      notFoundContent={list.length === 0 && loading ? <Spin size="small" /> : null}
      allowClear={true}
    >
      {list.map((item, index) => (
        <Select.Option key={index} value={item.value}>
          {item.text}
        </Select.Option>
      ))}
    </Select>
  );
};
