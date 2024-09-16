import React from "react";
import type { FormProps } from "antd";
import { Form, Input, Select, Switch } from "antd";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
  console.log("Success:", values);
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

const SearchBoxSetting: React.FC = () => (
  <div className="size-full box-border p-4 bg-white shadow">
    <Form
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item<FieldType>>
        <div className="flex justify-between">
          <span>显示搜索栏</span>
          <Switch defaultChecked />
        </div>
      </Form.Item>

      <Form.Item<FieldType>>
        <div className="flex justify-between">
          <span>显示搜索历史</span>
          <Switch defaultChecked />
        </div>
      </Form.Item>
      <Form.Item<FieldType>>
        <div className="flex justify-between">
          <span>关闭翻译</span>
          <Switch defaultChecked />
        </div>
      </Form.Item>
      <Form.Item<FieldType>>
        <div className="flex justify-between">
          <span>默认翻译引擎</span>
          <Select
            defaultValue="lucy"
            onChange={handleChange}
            style={{ width: 120 }}
            options={[
              { value: "jack", label: "百度" },
              { value: "lucy", label: "谷歌" },
              { value: "Yiminghe", label: "火山" },
              { value: "disabled", label: "有道", disabled: true },
              { value: "custom", label: "自定义", disabled: true },
            ]}
          />
        </div>
      </Form.Item>
      <Form.Item<FieldType>>
        <Input placeholder="请输入自定义翻译引擎"></Input>
      </Form.Item>
      <Form.Item<FieldType>>
        <div className="flex justify-between">
          <span>默认搜索引擎</span>
          <Select
            defaultValue="lucy"
            onChange={handleChange}
            style={{ width: 120 }}
            options={[
              { value: "jack", label: "百度" },
              { value: "lucy", label: "谷歌" },
              { value: "Yiminghe", label: "火山" },
              { value: "disabled", label: "有道", disabled: true },
            ]}
          />
        </div>
      </Form.Item>
      <Form.Item<FieldType>>
        <Input placeholder="请输入自定义搜索引擎"></Input>
      </Form.Item>
      <Form.Item<FieldType>>
        <div className="flex justify-between">
          <span>打开方式</span>
          <Select
            defaultValue="lucy"
            onChange={handleChange}
            style={{ width: 120 }}
            options={[
              { value: "jack", label: "当前页面" },
              { value: "lucy", label: "新标签页" },
            ]}
          />
        </div>
      </Form.Item>
    </Form>
  </div>
);

export default SearchBoxSetting;
