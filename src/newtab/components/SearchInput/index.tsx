import { getBaiduSuggestion } from "@/newtab/api/suggestion"
import { isEmpty } from "@/newtab/utils/common"
import { useClickOutside } from "@newtab/hooks/useClickOutside"
import { debounce } from "@newtab/utils/async"
import { Input, message, Space } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"

import defaultEngine from "./defaultEngine.json"
import SearchEngineSelect from "./SearchEngineSelect"
import SuggestionList from "./SuggestionList"

import type { SearchEngineItem } from "@newtab/types/search"

const engineList: SearchEngineItem[] = defaultEngine as unknown as SearchEngineItem[]
const autoFocusEnabled = false

/**
 * 搜索输入框组件
 * 支持动态建议、搜索引擎切换、以及键盘快捷键
 */
const SearchInput: React.FC = () => {
  // 状态管理：搜索文本、搜索建议、选中的引擎、是否隐藏建议、输入框聚焦状态
  const [searchText, setSearchText] = useState<string>("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [selectedEngine, setSelectedEngine] = useState<string>("bing")
  const [isSuggestionsHidden, setIsSuggestionsHidden] = useState<boolean>(false)
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false)

  // 用于 DOM 元素的引用
  const inputBoxRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef(null)
  const [messageApi, contextHolder] = message.useMessage()

  // 点击输入框外部时隐藏建议列表
  useClickOutside(inputBoxRef, () => setIsSuggestionsHidden(true))

  /**
   * 执行搜索操作
   * 根据当前输入的搜索词和选择的搜索引擎进行搜索
   */
  const handleSearch = () => {
    const trimmedInput = searchText.trim()
    if (!trimmedInput) {
      return messageApi.warning("请输入关键词后再查询")
    }

    // 根据选中的引擎生成搜索 URL
    const engine = engineList.find((e) => e.id === selectedEngine)
    if (!engine) {
      return messageApi.warning("配置错误，请检查")
    }

    const searchUrl = engine.url.replace("{searchText}", encodeURIComponent(trimmedInput))
    window.open(searchUrl)

    // 重置搜索框和建议列表
    resetSearch()
  }

  /**
   * 输入框内容改变时触发，更新搜索文本并获取建议
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    setSearchText(input)
    debouncedFetchSuggestions(input)
  }

  /**
   * 根据输入的内容动态获取搜索建议
   */
  const fetchSuggestions = useCallback(async (input: string) => {
    if (isEmpty(input)) {
      setSuggestions([])
    } else {
      const suggestionData = await getBaiduSuggestion(input)
      setSuggestions(suggestionData)
    }
  }, [])

  // 使用防抖函数，避免频繁调用获取建议接口
  const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 300), [fetchSuggestions])

  /**
   * 输入框聚焦时处理
   * 将输入框和建议框上移 100px，并显示建议
   */
  const handleInputFocus = () => {
    if (inputBoxRef.current) {
      inputBoxRef.current.style.transition = "transform 0.3s ease"
      inputBoxRef.current.style.transform = "translateY(-200px)"
    }
    setIsSuggestionsHidden(false)
    setIsInputFocused(true)
  }

  /**
   * 输入框失焦时处理
   * 如果没有建议，输入框回到原位置
   */
  const handleInputBlur = () => {
    if (inputBoxRef.current && suggestions.length === 0) {
      inputBoxRef.current.style.transition = "transform 0.3s ease"
      inputBoxRef.current.style.transform = "translateY(0)"
    }
    setIsInputFocused(false)
  }

  /**
   * 重置搜索框状态
   * 清空搜索建议和输入框内容
   */
  const resetSearch = () => {
    setSuggestions([])
    setSearchText("")
    setIsSuggestionsHidden(true)
  }

  /**
   * 处理键盘事件
   * - Tab：切换搜索引擎
   * - Alt：切换聚焦状态
   * - ArrowDown/ArrowUp：在建议列表中上下切换
   * - Enter：执行搜索
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case "Tab":
          event.preventDefault()
          handleEngineSwitch() // 切换搜索引擎
          break
        case "Alt":
          event.preventDefault()
          toggleFocus() // 切换聚焦状态
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

  /**
   * 切换搜索引擎
   */
  const handleEngineSwitch = () => {
    const currentIndex = engineList.findIndex((engine) => engine.id === selectedEngine)
    const nextEngine = currentIndex === -1 || currentIndex === engineList.length - 1 ? engineList[0].id : engineList[currentIndex + 1].id
    setSelectedEngine(nextEngine)
  }

  /**
   * 切换输入框聚焦状态
   * 如果输入框聚焦则取消聚焦，否则聚焦输入框
   */
  const toggleFocus = () => {
    if (isInputFocused) {
      inputRef.current?.blur() // 取消聚焦
      handleInputBlur()
    } else {
      inputRef.current?.focus() // 聚焦
      handleInputFocus()
    }
  }

  /**
   * 在建议列表中导航
   * @param direction "up" 或 "down" 用于确定是向上还是向下导航
   */
  const navigateSuggestions = (direction: "up" | "down") => {
    if (!suggestions.length) return

    const currentIndex = suggestions.findIndex((item) => item === searchText)
    const nextIndex = direction === "down" ? (currentIndex + 1) % suggestions.length : (currentIndex - 1 + suggestions.length) % suggestions.length

    setSearchText(suggestions[nextIndex])
  }

  /**
   * 点击搜索建议下拉列表
   * @param value 选中的搜索值
   */
  const onSuggestionClick = (value: string) => {
    setSearchText(value)
    handleSearch()
  }

  // 监听键盘事件
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

  // 页面加载后自动聚焦输入框（如果配置启用）
  useEffect(() => {
    autoFocusEnabled && inputRef.current?.focus()
  }, [])

  // 隐藏建议时将输入框恢复到初始位置
  useEffect(() => {
    if (isSuggestionsHidden) {
      inputBoxRef.current.style.transition = "transform 0.3s ease"
      inputBoxRef.current.style.transform = "translateY(0)"
    }
  }, [isSuggestionsHidden])

  return (
    <div className="relative" ref={inputBoxRef}>
      {contextHolder}
      <Space.Compact size="large">
        {/* 搜索引擎选择组件 */}
        <SearchEngineSelect engineList={engineList} engine={selectedEngine}  onEngineChange={setSelectedEngine} />
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
      {!isSuggestionsHidden && <SuggestionList suggestions={suggestions} onSuggestionClick={onSuggestionClick} currentText={searchText} />}
    </div>
  )
}

export default SearchInput
