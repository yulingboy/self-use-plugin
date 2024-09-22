import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { useDispatch, useSelector } from "react-redux"
import type { TypedUseSelectorHook } from "react-redux"
import { syncStorage,localStorage } from "redux-persist-webextension-storage"
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE, RESYNC } from "@plasmohq/redux-persist"
import { Storage } from "@plasmohq/storage"

import statusSlice from "./modules/status"
import settingSlice from "./modules/setting"
import dataSlice from "./modules/data"

// 1. 将所有的 slice reducer 合并到一个根 reducer
const combinedReducers = combineReducers({
  status: statusSlice,
  setting: settingSlice,
  data: dataSlice
})

// 2. 配置持久化（persist）设置
const persistConfig = {
  key: "1",         // 持久化存储的根 key
  version: 1,          // 持久化版本号
  storage: syncStorage, // 使用浏览器扩展的存储（webextension）
  // storage: localStorage,
  whitelist: []
}

// 3. 创建持久化的 reducer
// 使用 persistReducer 来增强 rootReducer，以便状态持久化
const persistedReducer = persistReducer(persistConfig, combinedReducers)

// 4. 创建一个 mockStore 来获取类型信息（类型推导）
// 因为 `persistReducer` 的类型不正确，我们通过这个 mockStore 获取正确的类型
const mockStore = configureStore({
  reducer: combinedReducers
})

// 5. 创建 Redux store
// 使用 ts-ignore 忽略类型警告，将 store 强制转换为 `mockStore` 的类型
// @ts-ignore
export const store = configureStore({
  reducer: persistedReducer,  // 持久化后的 reducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 忽略特定的 redux-persist 操作以避免序列化检查失败
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, RESYNC]
      }
    })
}) as typeof mockStore // 强制指定类型

// 6. 配置持久化 store
export const persistor = persistStore(store)

// 7. 监听扩展的存储变化，实现多页面的 Redux 状态同步
// 通过监听存储变化来触发 rehydrate，确保多个页面之间的状态一致
new Storage().watch({
  [`persist:${persistConfig.key}`]: (change) => {
    const { oldValue, newValue } = change
    const updatedKeys: string[] = []
    
    // 检查哪些 key 发生了变化
    for (const key in oldValue) {
      if (oldValue[key] !== newValue?.[key]) {
        updatedKeys.push(key)
      }
    }
    for (const key in newValue) {
      if (oldValue?.[key] !== newValue[key]) {
        updatedKeys.push(key)
      }
    }
    
    // 如果有任何 key 变化，触发 resync
    if (updatedKeys.length > 0) {
      persistor.resync()
    }
  }
})

// 8. 获取 rootReducer 的类型和 dispatch 的类型
export type RootState = ReturnType<typeof mockStore.getState>
export type AppDispatch = typeof mockStore.dispatch

// 9. 导出具有类型支持的自定义 hooks
// 用于在组件中调用 `useDispatch` 和 `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
