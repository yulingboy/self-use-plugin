import { useAppDispatch, useAppSelector } from "@newtab/store"
import { setSearchText } from "@newtab/store/modules/data"
import React, { useCallback } from "react"

import { useSearchHandler } from "./useSearchHandler"

const SuggestionList: React.FC = () => {
  const { handleSearch } = useSearchHandler()
  const dispatch = useAppDispatch()
  const { suggestionList, searchText } = useAppSelector((state) => state.data)

  // 优化的点击事件处理函数，使用 useCallback 缓存函数
  const onSuggestionClick = useCallback(
    (suggestion: string) => {
      dispatch(setSearchText(suggestion))
      handleSearch()
    },
    [dispatch, handleSearch]
  )

  return (
    <ul className="absolute w-full overflow-hidden rounded-md bg-white z-1000">
      {suggestionList.map((suggestion, index) => (
        <li
          key={index}
          className={`box-border flex h-10 w-full cursor-pointer items-center px-4 text-base hover:bg-slate-300 ${searchText === suggestion ? "bg-slate-300" : ""}`}
          onClick={() => onSuggestionClick(suggestion)}>
          {suggestion}
        </li>
      ))}
    </ul>
  )
}

export default SuggestionList
