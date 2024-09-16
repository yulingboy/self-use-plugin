import React from "react";
import {
  Button,
  Collapse,
  ConfigProvider,
  Form,
  List,
  Space,
  Switch,
} from "antd";
import type { CollapseProps, FormProps } from "antd";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const data = [
  { title: "2024-08-01" },
  { title: "2014-09-03" },
  { title: "2024-10-10" },
  { title: "2024-09-10" },
  { title: "2024-08-01" },
  { title: "2014-09-03" },
  { title: "2024-10-10" },
  { title: "2024-09-10" },
];

const ListContent: React.FC = () => (
  <List
    className="h-full flex flex-1 flex-col overflow-hidden"
    dataSource={data}
    renderItem={(item) => (
      <List.Item className="hover:bg-gray-200">
        <div className="w-full flex justify-between items-center px-4">
          <span>{item.title}</span>
          <Space>
            <Button type="primary">导出</Button>
            <Button type="primary">恢复</Button>
          </Space>
        </div>
      </List.Item>
    )}
  />
);

const items: CollapseProps["items"] = [
  {
    key: "1",
    label: "恢复历史数据",
    children: <ListContent />,
  },
];

const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
  console.log("Success:", values);
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const onCollapseChange = (key: string | string[]) => {
  console.log("Collapse Key:", key);
};

const BackupSettings: React.FC = () => {
  return (
    <div className="size-full  box-border p-4 bg-white shadow rounded-md overflow-hidden">
      <Form
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className="size-full flex flex-col"
      >
        <Form.Item>
          <div className="flex justify-between">
            <span>备份当前数据</span>
            <Button type="primary">立即备份</Button>
          </div>
        </Form.Item>
        <Form.Item>
          <div className="flex justify-between">
            <span>导入本地数据</span>
            <Button type="primary">导入</Button>
          </div>
        </Form.Item>
        <Form.Item>
          <div className="flex justify-between">
            <span>导出本地数据</span>
            <Button type="primary">导出</Button>
          </div>
        </Form.Item>
        <Form.Item>
          <div className="flex justify-between">
            <span>开启自动备份</span>
            <Switch defaultChecked />
          </div>
        </Form.Item>

        <ConfigProvider
          theme={{
            components: {
              Collapse: {
                headerPadding: "12px 0",
                contentPadding: "16px 0",
              },
            },
          }}
        >
          <Collapse
            className="flex-1 overflow-hidden"
            ghost
            items={items}
            bordered={false}
            onChange={onCollapseChange}
          />
        </ConfigProvider>
      </Form>
    </div>
  );
};

export default BackupSettings;
