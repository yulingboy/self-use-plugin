import { getBaiduSuggestion } from "@/newtab/api/suggestion"
import { isEmpty } from "@/newtab/utils/common"
import { useClickOutside } from "@newtab/hooks/useClickOutside"
import type { SearchEngineItem } from "@newtab/types/search"
import { debounce } from "@newtab/utils/async"
import { Input, message, Space } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"

import defaultEngine from "./defaultEngine.json"
import SearchEngineSelect from "./SearchEngineSelect"
import SuggestionList from "./SuggestionList"

// 加载默认的搜索引擎列表
const engineList: SearchEngineItem[] = defaultEngine as SearchEngineItem[]
const autoFocusEnabled = false

type SearchInputProps = {
  handleChangePosition: (focus: boolean) => void
}

/**
 * 搜索输入框组件
 * - 支持动态建议、搜索引擎切换、键盘快捷键操作
 */
const SearchInput: React.FC<SearchInputProps> = ({ handleChangePosition }) => {
  // 状态管理
  const [searchText, setSearchText] = useState<string>("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [selectedEngine, setSelectedEngine] = useState<string>("bing")
  const [isSuggestionsHidden, setIsSuggestionsHidden] = useState<boolean>(false)
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false)

  // DOM 引用
  const inputBoxRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef(null)
  const [messageApi, contextHolder] = message.useMessage()

  // 点击输入框外部时隐藏建议列表
  useClickOutside(inputBoxRef, () => setIsSuggestionsHidden(true))

  // 执行搜索操作
  const handleSearch = () => {
    const trimmedInput = searchText.trim()
    if (!trimmedInput) {
      return messageApi.warning("请输入关键词后再查询")
    }

    // 查找选中的搜索引擎，并打开搜索链接
    const engine = engineList.find((e) => e.id === selectedEngine)
    if (!engine) {
      return messageApi.warning("配置错误，请检查")
    }

    const searchUrl = engine.url.replace("{searchText}", encodeURIComponent(trimmedInput))
    window.open(searchUrl)

    resetSearch() // 重置搜索状态
  }

  // 处理输入框内容变化，并调用防抖后的获取建议函数
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    setSearchText(input)
    debouncedFetchSuggestions(input)
  }

  // 获取搜索建议
  const fetchSuggestions = useCallback(async (input: string) => {
    if (isEmpty(input)) {
      setSuggestions([])
    } else {
      const suggestionData = await getBaiduSuggestion(input)
      setSuggestions(suggestionData)
    }
  }, [])

  // 防抖后的获取建议函数，避免频繁调用 API
  const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 300), [fetchSuggestions])

  // 输入框聚焦时处理逻辑
  const handleInputFocus = () => {
    handleChangePosition(true)
    setIsSuggestionsHidden(false)
    setIsInputFocused(true)
  }

  // 输入框失焦时处理逻辑
  const handleInputBlur = () => {
    handleChangePosition(false)
    setIsInputFocused(false)
  }

  // 重置搜索框状态
  const resetSearch = () => {
    setSuggestions([])
    setSearchText("")
    setIsSuggestionsHidden(true)
  }

  // 处理键盘事件
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case "Tab":
          event.preventDefault()
          switchSearchEngine() // 切换搜索引擎
          break
        case "Alt":
          event.preventDefault()
          toggleInputFocus() // 切换聚焦状态
          break
        case "ArrowDown":
          navigateSuggestions("down") // 下箭头选择下一个建议
          break
        case "ArrowUp":
          navigateSuggestions("up") // 上箭头选择上一个建议
          break
        case "Enter":
          handleSearch() // 回车执行搜索
          break
        default:
          break
      }
    },
    [searchText, suggestions, selectedEngine, isInputFocused]
  )

  // 切换搜索引擎
  const switchSearchEngine = () => {
    const currentIndex = engineList.findIndex((engine) => engine.id === selectedEngine)
    const nextEngine = (currentIndex + 1) % engineList.length // 循环切换引擎
    setSelectedEngine(engineList[nextEngine].id)
  }

  // 切换输入框聚焦状态
  const toggleInputFocus = () => {
    if (isInputFocused) {
      inputRef.current?.blur() // 取消聚焦
      handleInputBlur()
    } else {
      inputRef.current?.focus() // 聚焦
      handleInputFocus()
    }
  }

  // 在建议列表中导航
  const navigateSuggestions = (direction: "up" | "down") => {
    if (!suggestions.length) return

    const currentIndex = suggestions.findIndex((item) => item === searchText)
    const nextIndex = direction === "down" ? (currentIndex + 1) % suggestions.length : (currentIndex - 1 + suggestions.length) % suggestions.length

    setSearchText(suggestions[nextIndex])
  }

  // 点击建议项时执行搜索
  const handleSuggestionClick = (value: string) => {
    setSearchText(value)
    handleSearch()
  }

  // 监听键盘事件
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  // 自动聚焦输入框（如果启用）
  useEffect(() => {
    if (autoFocusEnabled) inputRef.current?.focus()
  }, [])

  // 当隐藏建议时，恢复输入框到初始位置
  useEffect(() => {
    if (isSuggestionsHidden && inputBoxRef.current) {
      inputBoxRef.current.style.transition = "transform 0.3s ease"
      inputBoxRef.current.style.transform = "translateY(0)"
    }
  }, [isSuggestionsHidden])

  return (
    <div className="relative" ref={inputBoxRef}>
      {contextHolder}
      <Space.Compact size="large">
        {/* 搜索引擎选择组件 */}
        <SearchEngineSelect engineList={engineList} engine={selectedEngine} onEngineChange={setSelectedEngine} />
        {/* 输入框组件 */}
        <Input.Search
          ref={inputRef}
          className="w-[600px]"
          value={searchText}
          onChange={handleInputChange}
          placeholder="请输入关键词搜索"
          allowClear
          enterButton="搜索"
          onSearch={handleSearch}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
      </Space.Compact>

      {/* 搜索建议列表组件 */}
      {!isSuggestionsHidden && <SuggestionList suggestions={suggestions} onSuggestionClick={handleSuggestionClick} currentText={searchText} />}
    </div>
  )
}

export default SearchInput
