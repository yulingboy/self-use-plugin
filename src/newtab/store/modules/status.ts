import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

// 定义状态接口，确保类型安全
interface StatusState {
  searchInputFocused: boolean
  suggestionListVisible: boolean
}

export type statusProp = keyof StatusState

// 初始化状态
const initialState: StatusState = {
  searchInputFocused: false, // 搜索框是否聚焦
  suggestionListVisible: false // 建议列表是否显示
}

// 创建切片
const statusSlice = createSlice({
  name: "status",
  initialState,
  reducers: {
    // 切换布尔值通用函数
    toggleState(state: StatusState, action: PayloadAction<keyof StatusState>) {
      const key = action.payload
      state[key] = !state[key]
    }
  }
})

// 导出 action 和 reducer
export const { toggleState } = statusSlice.actions
export default statusSlice.reducer
