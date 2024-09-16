import { useState } from "react"

interface Size {
  width: number
  height: number
}

interface Position {
  x: number
  y: number
}

interface UseFullscreenReturn {
  isFullscreen: boolean
  toggleFullscreen: () => void
  size: Size
  position: Position
  resetSizeAndPosition: () => void
}

export const useFullscreen = (initialSize: Size, initialPosition: Position): UseFullscreenReturn => {
  const [isFullscreen, setIsFullscreen] = useState(false) // 是否全屏状态
  const [size, setSize] = useState<Size>(initialSize) // 窗口大小
  const [position, setPosition] = useState<Position>(initialPosition) // 窗口位置

  // 进入全屏状态
  const enterFullscreen = () => {
    const { innerWidth: screenWidth, innerHeight: screenHeight } = window
    setSize({ width: screenWidth, height: screenHeight })
    setPosition({ x: 0, y: 0 })
    setIsFullscreen(true)
  }

  // 退出全屏状态，恢复到初始大小和位置
  const exitFullscreen = () => {
    setSize(initialSize)
    setPosition(initialPosition)
    setIsFullscreen(false)
  }

  // 切换全屏状态
  const toggleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreen()
    } else {
      enterFullscreen()
    }
  }

  // 重置大小和位置，用于在初始时设置
  const resetSizeAndPosition = () => {
    setSize(initialSize)
    setPosition(initialPosition)
  }

  return {
    isFullscreen,
    toggleFullscreen,
    size,
    position,
    resetSizeAndPosition
  }
}
