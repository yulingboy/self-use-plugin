import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

// 定义状态接口，确保类型安全
interface DataState {
  suggestionList: string[]
  searchText: string
}

export type statusProp = keyof DataState

// 初始化状态
const initialState: DataState = {
  suggestionList: [],
  searchText: ""
}

// 创建切片
const statusSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setSuggestionList(state, { payload }) {
      state.suggestionList = payload
    },
    setSearchText(state, { payload }) {
        console.log('调用store searchText', payload)
        state.searchText = payload
      }
  }
})

// 导出 action 和 reducer
export const { setSuggestionList, setSearchText } = statusSlice.actions
export default statusSlice.reducer
