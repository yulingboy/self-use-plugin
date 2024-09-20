import { CopyOutlined, ReloadOutlined, SettingOutlined } from "@ant-design/icons"
import { FloatButton, message } from "antd"
import type { PlasmoCSConfig, PlasmoCSUIJSXContainer, PlasmoCSUIProps, PlasmoRender } from "plasmo"
import { type FC } from "react"
import { createRoot } from "react-dom/client"

// 复制文本到剪贴板
let copyToClipboard = (text: string) => {
  if (navigator.clipboard) {
    copyToClipboard = (text: string) => navigator.clipboard.writeText(text)
  } else {
    const input = document.createElement("input")
    input.setAttribute("value", text)
    document.body.append(input)
    input.select()
    document.execCommand("copy")
    document.body.removeChild(input)
  }
  copyToClipboard(text)
}

export const config: PlasmoCSConfig = {}

// 获取根容器，当 DOM 加载完成后，创建并插入根容器
export const getRootContainer = () => {
  return new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      // 查找 body 标签，确保页面已加载完成
      const rootContainerParent = document.querySelector("body")
      if (rootContainerParent) {
        clearInterval(checkInterval)
        // 创建一个新的 div 并添加到 body 中作为根容器
        const rootContainer = document.createElement("div")
        rootContainerParent.appendChild(rootContainer)
        resolve(rootContainer)
      }
    }, 137)
  })
}

const PlasmoOverlay: FC<PlasmoCSUIProps> = () => {
  const [messageApi, contextHolder] = message.useMessage()

  // 处理链接
  const handleCopyLink = () => {
    const currentUrl = window.location.href // 获取当前页面的 URL
    try {
      copyToClipboard(currentUrl) // 调用复制函数
      messageApi.success("复制成功") // 复制成功提示
    } catch (error) {
      messageApi.error("复制失败") // 复制失败提示
    }
  }

  // 页面刷新
  const handlePageRefresh = () => {
    window.location.reload()
  }

  return (
    <>
      {contextHolder}
      <FloatButton.Group trigger="click" style={{ insetInlineEnd: 24 }} icon={<SettingOutlined />}>
        <FloatButton onClick={handleCopyLink} icon={<CopyOutlined />} tooltip="复制链接" />
        <FloatButton onClick={handlePageRefresh} icon={<ReloadOutlined />} tooltip="刷新页面" />
        <FloatButton.BackTop tooltip="回到顶部" />
      </FloatButton.Group>
    </>
  )
}

// 渲染函数，使用 Plasmo 提供的 createRootContainer 创建根容器并渲染组件
export const render: PlasmoRender<PlasmoCSUIJSXContainer> = async ({ createRootContainer }) => {
  // 等待创建根容器
  const rootContainer = await createRootContainer()
  // 使用 React 的 createRoot API 渲染组件到根容器中
  const root = createRoot(rootContainer)
  root.render(<PlasmoOverlay />)
}

export default PlasmoOverlay
