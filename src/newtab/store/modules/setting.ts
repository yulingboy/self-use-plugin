import defaultEngines from "@newtab/data/defaultEngine.json"
import { OpenPageTarget, SearchSuggestion } from "@newtab/enums"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface SettingState {
  timeCalendar: TimeCalendarType; 
  search: SearchType; 
  navList: NavListType; 
  dock: DockType; 
}

const initialState: SettingState = {
  search: {
    showHistory: false, // 不显示历史记录
    autoFocus: false,
    show: true, // 默认显示搜索框
    showTranslate: false, // 不显示翻译功能
    currentEngine: defaultEngines[0].id, // 默认搜索引擎
    searchEngines: defaultEngines, // 可用的搜索引擎列表
    openPageTarget: OpenPageTarget.Blank, // 搜索结果默认在新标签页打开
    suggestion: SearchSuggestion.none // 不显示搜索建议
  },
  navList: { show: true }, // 默认显示导航栏
  dock: { show: true }, // 默认显示Dock栏
  timeCalendar: { show: true }, // 默认显示时间日历
}

type SettingPart = keyof SettingState;

// 定义 updateSettingItem reducer 时根据不同的 part 精确推断 key 和 value
const settingSlice = createSlice({
  name: "setting",
  initialState, // 初始状态
  reducers: {
    // 通用的设置更新 reducer，支持更新 SettingState 中任意部分的任意字段
    updateSettingItem: <
      T extends SettingPart,
      K extends keyof SettingState[T] // 确保 K 是 SettingState[T] 中的键
    >(
      state: SettingState, // 当前状态
      { payload }: PayloadAction<{ part: T; key: K; value: SettingState[T][K] }> // 更新 payload，包含部分名、字段名和值
    ) => {
      // 根据传入的部分名和字段名，更新对应的值
      state[payload.part][payload.key] = payload.value;
    }
  }
});

export const { updateSettingItem } = settingSlice.actions;
export default settingSlice.reducer;
