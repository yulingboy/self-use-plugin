import React, { useRef } from "react"

import "./index.css"

import NavList from "@newtab/components/NavList"
// 导入自定义组件
import SearchInput from "@newtab/components/SearchInput"
import TimeCalendar from "@newtab/components/TimeCalendar"
import Wallpaper from "@newtab/components/Wallpaper"

const isShowNavList: boolean = true

const IndexPage: React.FC = () => {
  const inputBoxRef = useRef<HTMLDivElement>(null)

  /**
   * 处理输入框聚焦和失焦时位置的变化
   * @param isFocused 是否聚焦
   */
  const adjustInputBoxPosition = (isFocused: boolean) => {
    if (inputBoxRef.current && !isShowNavList) {
      // 动态设置过渡效果和位置变化
      inputBoxRef.current.style.transition = "transform 0.3s ease"
      inputBoxRef.current.style.transform = isFocused ? "translateY(-200px)" : "translateY(0)"
    }
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
      <Wallpaper />
      <div className="relative z-10 flex size-full flex-col items-center justify-center gap-20">
        {/* 输入框和日历容器 */}
        <div className="flex flex-col gap-6" ref={inputBoxRef}>
          <TimeCalendar />
          <SearchInput handleChangePosition={adjustInputBoxPosition} />
        </div>
        <div className="h-96">
          <NavList></NavList>
        </div>
      </div>
    </div>
  )
}

export default IndexPage
