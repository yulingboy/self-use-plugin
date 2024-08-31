import React from "react"

import "./index.css"

import SearchInput from "@newtab/components/SearchInput"
import Wallpaper from "@newtab/components/Wallpaper"

const IndexPage: React.FC = () => {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <Wallpaper></Wallpaper>
      <div className="z-1 relative flex size-full items-center justify-center">
        <div>
          <SearchInput></SearchInput>
        </div>
      </div>
    </div>
  )
}
export default IndexPage
