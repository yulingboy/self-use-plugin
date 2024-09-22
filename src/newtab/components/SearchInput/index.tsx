import { useAppDispatch, useAppSelector } from "@/newtab/store"
import { setSearchText } from "@newtab/store/modules/data"
import { updateSettingItem } from "@newtab/store/modules/setting"
import { toggleState } from "@newtab/store/modules/status"
import { Input, message, Space } from "antd"
import React, { useRef } from "react"

import SearchEngineSelect from "./SearchEngineSelect"
import SuggestionList from "./SuggestionList"
import { useKeyboardEvents } from "./useKeyboardEvents"
import { useSearchHandler } from "./useSearchHandler"
import { useSuggestions } from "./useSuggestions"

const SearchInput: React.FC = () => {
  const dispatch = useAppDispatch()
  const { currentEngine, searchEngines } = useAppSelector((state) => state.setting.search)
  const { searchInputFocused, suggestionListVisible } = useAppSelector((state) => state.status)
  const { searchText, suggestionList } = useAppSelector((state) => state.data)
  const { debouncedFetchSuggestions } = useSuggestions()
  const { resetSearch, handleSearch } = useSearchHandler()

  const inputBoxRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef(null) // 为输入框添加类型定义
  const [messageApi, contextHolder] = message.useMessage()

  // 更新状态的简化封装
  const updateStatus = (prop) => {
    dispatch(toggleState(prop))
  }

  const handleInputFocus = () => {
    updateStatus("suggestionListVisible")
    updateStatus("searchInputFocused")
  }

  const handleInputBlur = () => {
    updateStatus("searchInputFocused")
  }

  // 处理输入框内容变化，并调用防抖后的获取建议函数
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('e.target.value', e.target.value)
    const input = e.target.value
    dispatch(setSearchText(input))
    debouncedFetchSuggestions()
  }

  // 切换搜索引擎
  const switchSearchEngine = () => {
    const currentIndex = searchEngines.findIndex((engine) => engine.id === currentEngine)
    const nextEngine = (currentIndex + 1) % searchEngines.length // 循环切换引擎
    dispatch(updateSettingItem({ part: "search", key: "currentEngine", value: searchEngines[nextEngine].id }))
  }

  // 切换输入框聚焦状态
  const toggleInputFocus = () => {
    if (searchInputFocused) {
      inputRef.current?.blur() // 取消聚焦
      handleInputBlur()
    } else {
      inputRef.current?.focus() // 聚焦
      handleInputFocus()
    }
  }

  // 在建议列表中导航
  const navigateSuggestions = (direction: "up" | "down") => {
    if (!suggestionList.length) return

    const currentIndex = suggestionList.findIndex((item) => item === searchText)
    const nextIndex = direction === "down" ? (currentIndex + 1) % suggestionList.length : (currentIndex - 1 + suggestionList.length) % suggestionList.length
    dispatch(setSearchText(suggestionList[nextIndex]))
  }

  // 使用键盘事件 Hook
  useKeyboardEvents({
    onTab: switchSearchEngine,
    onAlt: toggleInputFocus,
    onArrowDown: () => navigateSuggestions("down"),
    onArrowUp: () => navigateSuggestions("up"),
    onEnter: handleSearch
  })

  return (
    <div className="relative" ref={inputBoxRef}>
      {contextHolder}
      <Space.Compact size="large">
        <SearchEngineSelect />
        <Input.Search
          ref={inputRef}
          className="w-[600px]"
          value={searchText}
          onChange={handleInputChange}
          placeholder="请输入关键词搜索"
          allowClear
          onClear={resetSearch}
          enterButton="搜索"
          onSearch={handleSearch}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
      </Space.Compact>
      {suggestionListVisible && <SuggestionList />}
    </div>
  )
}

export default SearchInput
