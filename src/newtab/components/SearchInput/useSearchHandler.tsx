import { useAppDispatch, useAppSelector } from "@newtab/store"
import { setSearchText, setSuggestionList } from "@newtab/store/modules/data"
import { toggleState } from "@newtab/store/modules/status"
import { message } from "antd"

export const useSearchHandler = () => {
  const [messageApi] = message.useMessage()
  const dispatch = useAppDispatch()
  const { searchText } = useAppSelector((state) => state.data)
  const { currentEngine, searchEngines } = useAppSelector((state) => state.setting.search)

  const handleSearch = () => {
    const trimmedInput = searchText.trim()
    if (!trimmedInput) {
      return messageApi.warning("请输入关键词后再查询")
    }

    const engine = searchEngines.find((e) => e.id === currentEngine)
    if (!engine) {
      return messageApi.warning("配置错误，请检查")
    }

    const searchUrl = engine.url.replace("{searchText}", encodeURIComponent(trimmedInput))
    window.open(searchUrl)

    resetSearch() // 重置搜索状态
  }
  const resetSearch = () => {
    // 清空搜索建议
    dispatch(setSuggestionList([]))
    // 清空输入框内容
    dispatch(setSearchText(""))
    // 隐藏搜索建议
    dispatch(toggleState("suggestionListVisible"))
  }

  return { resetSearch, handleSearch }
}
