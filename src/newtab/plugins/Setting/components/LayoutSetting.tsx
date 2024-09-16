import React from "react";
import type { FormProps } from "antd";
import { Form, Select, Switch } from "antd";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
  console.log("Success:", values);
};

const LayoutSetting: React.FC = () => (
  <div className="size-full box-border p-4 bg-white shadow">
    <Form onFinish={onFinish} autoComplete="off">
      <Form.Item<FieldType>>
        <div className="flex justify-between">
          <span>布局类型</span>
          <Select
            defaultValue="jack"
            style={{ width: 120 }}
            options={[
              { value: "jack", label: "千山" },
              { value: "lucy", label: "万水" },
              { value: "Yiminghe", label: "火山" },
              { value: "disabled", label: "有道", disabled: true },
            ]}
          />
        </div>
      </Form.Item>
      <Form.Item<FieldType>>
        <div className="flex justify-between">
          <span>显示时间</span>
          <Switch defaultChecked />
        </div>
      </Form.Item>
      <Form.Item<FieldType>>
        <div className="flex justify-between">
          <span>显示搜索框</span>
          <Switch defaultChecked />
        </div>
      </Form.Item>
      <Form.Item<FieldType>>
        <div className="flex justify-between">
          <span>显示导航</span>
          <Switch defaultChecked />
        </div>
      </Form.Item>
      <Form.Item<FieldType>>
        <div className="flex justify-between">
          <span>显示dock</span>
          <Switch defaultChecked />
        </div>
      </Form.Item>
    </Form>
  </div>
);

export default LayoutSetting;
