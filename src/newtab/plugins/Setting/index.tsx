import Modal, { type AppProps } from "@newtab/components/Modal"
import icon from "@newtab/static/icon/plugin_setting.svg"
import { Menu } from "antd"
import type { MenuProps } from "antd"
import React, { useState } from "react"

import BackupSettings from "./components/BackupSettings"
import LayoutSetting from "./components/LayoutSetting"
import SearchBoxSetting from "./components/SearchBoxSetting"
import WallpaperSetting from "./components/WallpaperSetting"

// 定义菜单项类型
type MenuItem = Required<MenuProps>["items"][number]

// 定义菜单项
const menuItems: MenuItem[] = [
  { key: "layout", label: "布局" },
  { key: "search", label: "搜索栏" },
  { key: "wallpaper", label: "壁纸" },
  { key: "backup", label: "备份" }
]

const SettingPlugin: React.FC = () => {
  // 控制模态框显示状态
  const [isModalVisible, setIsModalVisible] = useState(false)

  // 控制当前显示的设置组件
  const [selectedComponent, setSelectedComponent] = useState<string>("layout")

  // 模态框配置
  const modalSettings: AppProps = {
    title: "设置",
    allowDrag: true,
    allowFullscreen: true,
    allowMinimize: false
  }

  // 关闭模态框
  const handleCloseModal = () => {
    setIsModalVisible(false)
  }

  // 打开模态框
  const handleOpenModal = () => {
    setIsModalVisible(true)
  }

  // 菜单点击处理函数，切换显示的组件
  const handleMenuClick: MenuProps["onClick"] = (e) => {
    setSelectedComponent(e.key)
  }

  // 渲染当前选择的组件
  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case "layout":
        return <LayoutSetting />
      case "search":
        return <SearchBoxSetting />
      case "wallpaper":
        return <WallpaperSetting />
      case "backup":
        return <BackupSettings />
      default:
        return <LayoutSetting />
    }
  }

  return (
    <div>
      <img className="" src={icon} alt="设置" onClick={handleOpenModal} />

      {/* 模态框 */}
      <Modal app={modalSettings} onClose={handleCloseModal} visible={isModalVisible}>
        <div className="flex size-full">
          {/* 左侧菜单栏 */}
          <div className="h-full w-40">
            <Menu className="h-full" onClick={handleMenuClick} defaultSelectedKeys={["layout"]} mode="inline" items={menuItems} />
          </div>
          {/* 右侧设置组件 */}
          <div className="box-border h-full flex-1 p-2">{renderSelectedComponent()}</div>
        </div>
      </Modal>
    </div>
  )
}

export default SettingPlugin
