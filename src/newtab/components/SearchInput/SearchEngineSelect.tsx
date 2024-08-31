import React from "react"
import type { SearchEngineItem } from "@newtab/types/search"
import { Select } from "antd"


type SearchEngineSelectProps = {
  engine: string
  onEngineChange: (engine: string) => void
  engineList: SearchEngineItem[]
}

const SearchEngineSelect: React.FC<SearchEngineSelectProps> = ({ engine, onEngineChange, engineList }) => {
  return <Select className="w-28" value={engine}  onChange={onEngineChange} options={engineList} fieldNames={{ label: "name", value: "id" }} />
}

export default SearchEngineSelect
