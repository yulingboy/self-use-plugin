import React from "react"
import { Select } from "antd"
import { useAppDispatch, useAppSelector } from "@/newtab/store"
import { updateSettingItem } from "@/newtab/store/modules/setting"

const SearchEngineSelect: React.FC= () => {
  const dispatch = useAppDispatch()
  const {currentEngine, searchEngines} = useAppSelector((state) => state.setting.search)
  const onEngineChange = (engine: string | number) => {
    dispatch(updateSettingItem({part: 'search', key: 'currentEngine', value: engine }))
  }
  return <Select className="w-28" value={currentEngine}  onChange={onEngineChange} options={searchEngines} fieldNames={{ label: "name", value: "id" }} />
}

export default SearchEngineSelect
