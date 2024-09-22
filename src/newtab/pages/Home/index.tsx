import Dock from "@newtab/components/Dock"
import NavList from "@newtab/components/NavList"
import SearchInput from "@newtab/components/SearchInput"
import TimeCalendar from "@newtab/components/TimeCalendar"
import Wallpaper from "@newtab/components/Wallpaper"
import { useAppSelector } from "@newtab/store"
import React, { useCallback, useRef } from "react"

const Home: React.FC = () => {
  // 统一从 store 中获取所需状态
  const { timeCalendar, search, navList, dock } = useAppSelector((state) => state.setting)
  const inputBoxRef = useRef<HTMLDivElement>(null)

  /**
   * 处理输入框聚焦和失焦时位置的变化
   * @param isFocused 是否聚焦
   */
  const adjustInputBoxPosition = useCallback(
    (isFocused: boolean) => {
      if (inputBoxRef.current && !navList.show) {
        inputBoxRef.current.style.transition = "transform 0.3s ease"
        inputBoxRef.current.style.transform = isFocused ? "translateY(-200px)" : "translateY(0)"
      }
    },
    [navList.show]
  )

  return (
    <div className="h-screen w-screen overflow-hidden">
      <Wallpaper />
      <div className="relative z-10 flex size-full flex-col items-center justify-center gap-20">
        <div className="flex flex-col gap-6" ref={inputBoxRef}>
          {timeCalendar.show && <TimeCalendar />}
          {search.show && <SearchInput handleChangePosition={adjustInputBoxPosition} />}
        </div>
        {navList.show && (
          <div className="h-96">
            <NavList />
          </div>
        )}
      </div>
      {dock.show && <Dock />}
    </div>
  )
}

export default Home
