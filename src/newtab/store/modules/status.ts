import { createSlice } from "@reduxjs/toolkit"



const statusSlice = createSlice({
  name: "status",
  initialState: {
    plugins: []
  },
  reducers: {
    addPlugin(state, { payload }) {
      state.plugins = [payload, ...state.plugins]
    },
    removePlugin(state, { payload }) {
        state.plugins = state.plugins
      }
  }
})

export const { addPlugin, removePlugin } = statusSlice.actions

export default statusSlice.reducer
