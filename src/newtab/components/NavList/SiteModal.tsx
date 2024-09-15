import { convertToBase64, getOptimalBackgroundColor } from "@/newtab/utils/img"
import { CheckCircleOutlined, UploadOutlined } from "@ant-design/icons"
import { fetchWebsiteInfo } from "@newtab/utils/website"
import { ColorPicker, Form, Input, message, Modal, Space, Upload } from "antd"
import TextArea from "antd/es/input/TextArea"
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
  selectedIconType: "image" | "text"
  textIcon: string
  backgroundColor: string
  textColor: string
}

const SiteModal: React.FC<SiteModalProps> = ({ visible, site, onClose, onSubmit, loading }) => {
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm()
  const [selectedIconType, setSelectedIconType] = useState<"image" | "text">("image")
  const [faviconPreview, setFaviconPreview] = useState<string>("")
  const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff")
  const [textColor, setTextColor] = useState<string>("#000000")
  const [textIconPreview, setTextIconPreview] = useState<string>("")
  const [defaultColors, setDefaultColors] = useState(["#000000", "#ffffff"])
  const [searchLoading, setSearchLoading] = useState<boolean>(false)

  // 更新默认颜色列表
  const updateDefaultColors = async (url: string) => {
    if (!url) return
    try {
      const colorList = await getOptimalBackgroundColor(url)
      // 添加默认颜色，并去重
      setDefaultColors(Array.from(new Set(["#000000", "#ffffff", ...colorList])))
    } catch (error) {
      setDefaultColors(["#000000", "#ffffff"])
    }
  }

  useEffect(() => {
    if (site) {
      const { selectedIconType, favicon, backgroundColor, textColor, textIcon, title } = site
      form.setFieldsValue(site)
      setSelectedIconType(selectedIconType || "image")

      favicon && setFaviconPreview(favicon)
      backgroundColor && setBackgroundColor(backgroundColor)
      textColor && setTextColor(textColor)
      textIcon ? setTextIconPreview(textIcon) : setTextIconPreview(title.slice(0, 1))

      updateDefaultColors(favicon)
    }
  }, [site])

  // 提交表单
  const handleFormSubmit = async (values: FormValues) => {
    onSubmit({ ...values, backgroundColor, favicon: faviconPreview })
    handleClose()
  }

  // 处理上传图片
  const handleUpload = async (file: File) => {
    try {
      const base64 = await convertToBase64(file)
      form.setFieldsValue({ favicon: base64 })
      setFaviconPreview(base64)
    } catch (error) {
      messageApi.error("上传图片失败")
    }
    return false
  }

  // 搜索网站信息
  const handleSearch = async (value: string) => {
    if (!value) return
    setSearchLoading(true)
    try {
      const { description, favicon, title } = await fetchWebsiteInfo(value)
      const base64 = favicon ? await convertToBase64(favicon) : ""
      form.setFieldsValue({ favicon: base64, description, title })
      setFaviconPreview(base64)
      updateDefaultColors(base64)
    } catch (error) {
      messageApi.error("获取网站信息失败")
    } finally {
      setSearchLoading(false)
    }
  }
  // 关闭弹窗时重置状态和表单
  const handleClose = () => {
    form.resetFields()
    setSelectedIconType("image")
    setFaviconPreview("")
    setBackgroundColor("#ffffff")
    setTextColor("#000000")
    setTextIconPreview("")
    setDefaultColors(["#000000", "#ffffff"])
    onClose()
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
        onCancel={handleClose}
        onOk={form.submit}>
        <Form form={form} layout="vertical" name="site_form" onFinish={handleFormSubmit}>
          <Form.Item name="url" label="网址" rules={[{ required: true, message: "请输入网址" }]}>
            <Input.Search placeholder="请输入网址" onSearch={handleSearch} loading={searchLoading} allowClear />
          </Form.Item>
          <Form.Item name="title" label="标题">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <TextArea rows={4} placeholder="请输入描述" maxLength={100} />
          </Form.Item>
          <Space className="flex gap-8">
            {/* 背景颜色设置 */}
            <Form.Item label="背景颜色">
              <Space>
                {defaultColors.map((color) => (
                  <div
                    key={color}
                    onClick={() => setBackgroundColor(color)}
                    className="flex size-8 cursor-pointer items-center justify-center overflow-hidden rounded-md border border-solid border-[#d9d9d9] hover:border-[#4096ff]">
                    <div className="flex size-6 items-center justify-center overflow-hidden rounded" style={{ backgroundColor: color }}>
                      {backgroundColor === color && <CheckCircleOutlined style={{ color: "#52c41a" }} />}
                    </div>
                  </div>
                ))}
                <ColorPicker value={backgroundColor} onChange={(e) => setBackgroundColor(e.toHexString())}>
                  <div className="flex size-8 cursor-pointer items-center justify-center overflow-hidden rounded-md border border-solid border-[#d9d9d9] hover:border-[#4096ff]">
                    <div
                      className="flex size-6 items-center justify-center overflow-hidden rounded"
                      style={{ background: !defaultColors.includes(backgroundColor) ? backgroundColor : "" }}>
                      {!defaultColors.includes(backgroundColor) && <CheckCircleOutlined style={{ color: "#52c41a" }} />}
                    </div>
                  </div>
                </ColorPicker>
              </Space>
            </Form.Item>
            <Form.Item label="文本颜色">
              <Space>
                {defaultColors.map((color) => (
                  <div
                    key={color}
                    onClick={() => setTextColor(color)}
                    className="flex size-8 cursor-pointer items-center justify-center overflow-hidden rounded-md border border-solid border-[#d9d9d9] hover:border-[#4096ff]">
                    <div className="flex size-6 items-center justify-center overflow-hidden rounded" style={{ backgroundColor: color }}>
                      {textColor === color && <CheckCircleOutlined style={{ color: "#52c41a" }} />}
                    </div>
                  </div>
                ))}
                <ColorPicker value={textColor} onChange={(e) => setTextColor(e.toHexString())}>
                  <div className="flex size-8 cursor-pointer items-center justify-center overflow-hidden rounded-md border border-solid border-[#d9d9d9] hover:border-[#4096ff]">
                    <div
                      className="flex size-6 items-center justify-center overflow-hidden rounded"
                      style={{ background: !defaultColors.includes(textColor) ? textColor : "" }}>
                      {!defaultColors.includes(textColor) && <CheckCircleOutlined style={{ color: "#52c41a" }} />}
                    </div>
                  </div>
                </ColorPicker>
              </Space>
            </Form.Item>
          </Space>
          {/* 文本图标输入框 */}
          <Form.Item name="textIcon" label="文本图标">
            <Input placeholder="请输入文本图标内容" count={{ show: true, max: 5 }} maxLength={5} onChange={(e) => setTextIconPreview(e.target.value)} />
          </Form.Item>
          <Form.Item label="图标">
            <Space align="center" style={{ width: "100%" }}>
              {/* 图片图标 */}
              <div className="relative flex flex-col items-center" onClick={() => setSelectedIconType("image")}>
                <Upload beforeUpload={handleUpload} showUploadList={false}>
                  <div
                    className="flex size-16 cursor-pointer items-center justify-center rounded-lg border border-solid border-[#d9d9d9]"
                    style={{ backgroundColor: backgroundColor }}>
                    {faviconPreview ? (
                      <img src={faviconPreview} alt="favicon preview" className="size-full rounded-lg object-cover" />
                    ) : (
                      <UploadOutlined style={{ fontSize: 24 }} />
                    )}
                  </div>
                </Upload>
                <div style={{ marginTop: 8 }}>
                  <CheckCircleOutlined style={{ color: selectedIconType === "image" ? "#52c41a" : "#000000" }} />
                </div>
              </div>

              {/* 文本图标 */}
              <div className="relative flex flex-col items-center" onClick={() => setSelectedIconType("text")}>
                <div
                  className="flex size-16 cursor-pointer items-center justify-center rounded-lg border border-solid border-[#d9d9d9]"
                  style={{ backgroundColor: backgroundColor, color: textColor }}>
                  {textIconPreview || "T"}
                </div>
                <div style={{ marginTop: 8 }}>
                  <CheckCircleOutlined style={{ color: selectedIconType === "text" ? "#52c41a" : "#000000" }} />
                </div>
              </div>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default SiteModal
