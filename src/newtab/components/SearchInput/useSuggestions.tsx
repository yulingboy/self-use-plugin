import { getBaiduSuggestion } from "@/newtab/api/suggestion"
import { isEmpty } from "@/newtab/utils/common"
import { useAppDispatch, useAppSelector } from "@newtab/store"
import { setSuggestionList } from "@newtab/store/modules/data"
import { debounce } from "@newtab/utils/async"
import { useCallback } from "react"

export const useSuggestions = () => {
  const dispatch = useAppDispatch()

  const { suggestionList, searchText } = useAppSelector((state) => state.data)

  const fetchSuggestions = async () => {
    if (isEmpty(searchText)) {
        dispatch(setSuggestionList([]))
    } else {
      console.log('获取建议之前',searchText)
      const suggestionData = await getBaiduSuggestion(searchText)
      console.log('获取建议',searchText,  suggestionData)
      dispatch(setSuggestionList(suggestionData))
    }
  }
  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300)
  const resetSuggestions = () => {
    // 清空搜索建议
    dispatch(setSuggestionList([]))
  }

  return { suggestionList, resetSuggestions,fetchSuggestions, debouncedFetchSuggestions }
}
