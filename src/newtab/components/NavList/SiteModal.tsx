import { isDomain } from "@newtab/utils/common"
import { convertImageToBase64 } from "@newtab/utils/img"
import { fetchWebsiteInfo } from "@newtab/utils/website"
import { Form, Input, message, Modal, Switch } from "antd"
import React, { useEffect, useState } from "react"

interface SiteModalProps {
  visible: boolean
  site?: Partial<FormValues>
  onClose: () => void
  onSubmit: (values: FormValues) => void
  loading: boolean
}

interface FormValues {
  id: string
  url: string
  favicon: string
  description: string
  title: string
  autoGetIcon: boolean
}

const SiteModal: React.FC<SiteModalProps> = ({ visible, site, onClose, onSubmit, loading }) => {
  const [messageApi, contextHolder] = message.useMessage() // 消息提示 API
  const [form] = Form.useForm()

  useEffect(() => {
    if (site) {
      form.setFieldsValue(site) // 编辑时设置表单默认值
    }
  }, [site])

  // 自动填充表单的搜索处理
  const handleSearch = async (url: string) => {
    const trimmedUrl = url.trim()
    if (!trimmedUrl) {
      return message.warning("请输入网址")
    }
    if (!isDomain(trimmedUrl)) {
      return message.warning("输入的内容不是有效的网址")
    }

    try {
      const { favicon, title, description } = await fetchWebsiteInfo(trimmedUrl)
      form.setFieldsValue({ url: trimmedUrl, title, description, favicon })
    } catch (error) {
      message.error("获取网址信息失败，请稍后重试或手动填写")
    }
  }

  return (
    <>
      {contextHolder}
      <Modal
        open={visible}
        title={site ? "编辑站点" : "添加站点"}
        okText={site ? "保存" : "确认"}
        cancelText="取消"
        okButtonProps={{ loading }}
        onCancel={onClose}
        onOk={form.submit} // 表单提交时触发
      >
        <Form form={form} layout="vertical" name="site_form" onFinish={onSubmit}>
          <Form.Item name="url" label="网址" rules={[{ required: true, message: "请输入网址" }]}>
            <Input.Search placeholder="请输入网址" loading={loading} onSearch={handleSearch} enterButton="搜索" />
          </Form.Item>
          <Form.Item name="title" label="标题">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input />
          </Form.Item>
          <Form.Item name="favicon" label="图标 URL">
            <Input />
          </Form.Item>
          <Form.Item name="autoGetIcon" label="自动获取图标" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default SiteModal
