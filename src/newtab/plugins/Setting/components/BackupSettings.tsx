import React, { useRef, useState } from "react";
import {
  Button,
  Collapse,
  ConfigProvider,
  List,
  Space,
  Switch,
  message,
} from "antd";
import type { CollapseProps } from "antd";

const data = [
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

const onCollapseChange = (key: string | string[]) => {
  console.log("Collapse Key:", key);
};

const BackupSettings: React.FC = () => {
  const [backupData, setBackupData] = useState<unknown[]>(data);
  const importRef = useRef<HTMLInputElement | null>(null)

  // 导出备份数据
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `backup-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    message.success("数据导出成功");
  };

  // 导入本地数据
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = JSON.parse(e.target?.result as string);
        setBackupData(content);
        message.success("数据导入成功");
      } catch (err) {
        message.error("导入失败，文件格式不正确");
      }
    };
    reader.readAsText(file);
  };

  const handleClickImport = () => {
    importRef.current && importRef.current.click()
  }

  return (
    <div className="size-full  box-border p-4 bg-white shadow rounded-md overflow-hidden">
      <div className="size-full flex flex-col">
        <div className="flex justify-between mb-4">
          <span>备份当前数据</span>
          <Button type="primary" onClick={handleExport}>
            立即备份
          </Button>
        </div>

        <div className="flex justify-between mb-4">
          <span>导入本地数据</span>
          <input className="hidden" ref={importRef} type="file" accept=".json" onChange={handleImport} />
          <Button type="primary" onClick={handleClickImport}>
            立即备份
          </Button>
        </div>

        <div className="flex justify-between mb-4">
          <span>导出本地数据</span>
          <Button type="primary" onClick={handleExport}>
            导出
          </Button>
        </div>

        <div className="flex justify-between mb-4">
          <span>开启自动备份</span>
          <Switch defaultChecked />
        </div>

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
      </div>
    </div>
  );
};

export default BackupSettings;
