import { Tooltip } from "antd"
import React, { useRef } from "react"

interface MenuItemProps {
  plugin: React.ReactNode
  title: string
  refEl: (el: HTMLDivElement | null) => void
}

const DockMenuItem: React.FC<MenuItemProps> = ({ plugin, title, refEl }) => (
  <div
    style={{
      width: "calc(var(--i, 1) * 32px)",
      height: "calc(var(--i, 1) * 32px)",
      marginBottom: "calc(var(--i, 1) * 16px - 16px)"
    }}
    className="rounded shadow-sm"
    ref={refEl}>
    <Tooltip title={title} trigger="hover" arrow={false} overlayInnerStyle={{ minHeight: "20px", padding: "0px 4px" }}>
      <div className="size-full cursor-pointer">{plugin}</div>
    </Tooltip>
  </div>
)

export default DockMenuItem
