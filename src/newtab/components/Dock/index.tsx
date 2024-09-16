import MemoPlugin from "@/newtab/plugins/Memo"
import BookMarkPlugin from "@/newtab/plugins/BookMark"
import HabitPlugin from "@/newtab/plugins/Habit"
import ReadLaterPlugin from "@/newtab/plugins/ReadLater"
import SettingPlugin from "@/newtab/plugins/Setting"
import TodoListPlugin from "@/newtab/plugins/TodoList"
import WhatEatPlugin from "@/newtab/plugins/WhatEat"
import React, { useRef } from "react"

import DockMenuItem from "./DockMenuItem"
import useDockScaling from "./useDockScaling"

const menuItems = [
  {
    plugin: <MemoPlugin />,
    title: "备忘录"
  },
  {
    plugin: <BookMarkPlugin />,
    title: "书签"
  },
  {
    plugin: <ReadLaterPlugin />,
    title: "稍后阅读"
  },
  {
    plugin: <HabitPlugin />,
    title: "习惯养成"
  },
  {
    plugin: <TodoListPlugin />,
    title: "代办"
  },
  {
    plugin: <WhatEatPlugin />,
    title: "今天吃什么"
  },
  {
    plugin: <SettingPlugin />,
    title: "设置"
  }
]

const DockMenu: React.FC = () => {
  const dockerRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  // 使用自定义 Hook 处理缩放逻辑
  useDockScaling(dockerRef, itemRefs)

  return (
    <div className="fixed bottom-4 z-[1000] flex w-full justify-center">
      <div className="box-content flex h-8 items-end justify-center bg-white/50 p-3" ref={dockerRef}>
        <div className="flex items-end">
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <DockMenuItem plugin={item.plugin} title={item.title} refEl={(el) => (itemRefs.current[index] = el)} />
              {index < menuItems.length - 1 && <div style={{ width: "calc(var(--i, 1) * 10px)" }} className="h-8"></div>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DockMenu
