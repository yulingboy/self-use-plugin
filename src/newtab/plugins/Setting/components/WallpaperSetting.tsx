import React from "react";
import type { FormProps } from "antd";
import { Form,  Image, Space, Slider } from "antd";
import {
  DownloadOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  UndoOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
  console.log("Success:", values);
};
const src =
  "https://files.flolight.cn/xtab/defaultWallpaper/defaultWallpaper.webp";
const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const onDownload = (imgUrl: string) => {
  fetch(imgUrl)
    .then((response) => response.blob())
    .then((blob) => {
      const url = URL.createObjectURL(new Blob([blob]));
      const link = document.createElement<"a">("a");
      link.href = url;
      link.download = "image.png";
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(url);
      link.remove();
    });
};

const WallpaperSetting: React.FC = () => (
  <div className="size-full box-border p-4 bg-white shadow">
    <Form
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item<FieldType>>
        <Image
          className="w-full aspect-video"
          src={src}
          preview={{
            toolbarRender: (
              _,
              {
                image: { url },
                transform: { scale },
                actions: {
                  onFlipY,
                  onFlipX,
                  onRotateLeft,
                  onRotateRight,
                  onZoomOut,
                  onZoomIn,
                  onReset,
                },
              }
            ) => (
              <Space size={12} className="toolbar-wrapper">
                <DownloadOutlined onClick={() => onDownload(url)} />
                <SwapOutlined rotate={90} onClick={onFlipY} />
                <SwapOutlined onClick={onFlipX} />
                <RotateLeftOutlined onClick={onRotateLeft} />
                <RotateRightOutlined onClick={onRotateRight} />
                <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
                <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
                <UndoOutlined onClick={onReset} />
              </Space>
            ),
          }}
        />
      </Form.Item>

      <Form.Item<FieldType>>
        <div className="flex items-center justify-between">
          <span>遮罩浓度</span>
          <div className="flex items-center gap-2">
            <Slider className="w-40" defaultValue={30} />
            <span>18%</span>
          </div>
        </div>
      </Form.Item>
      <Form.Item<FieldType>>
        <div className="flex items-center justify-between">
          <span>模糊度</span>
          <div className="flex items-center gap-2">
            <Slider className="w-40" defaultValue={30} />
            <span>20%</span>
          </div>
        </div>
      </Form.Item>
    </Form>
  </div>
);

export default WallpaperSetting;
