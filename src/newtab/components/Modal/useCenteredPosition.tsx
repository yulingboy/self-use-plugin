import { useEffect } from "react"

// 用于监听窗口大小变化并居中弹窗
export const useCenteredPosition = (
  width: number,
  height: number,
  setPosition: (pos: { x: number; y: number }) => void,
  isMinimized: boolean,
  allowDrag: boolean
) => {
  useEffect(() => {
    const updatePosition = () => {
      if (!isMinimized && !allowDrag) {
        setPosition({
          x: (window.innerWidth - width) / 2,
          y: (window.innerHeight - height) / 2
        })
      }
    }

    updatePosition() // 初始居中

    // 监听窗口大小变化
    window.addEventListener("resize", updatePosition)

    return () => {
      window.removeEventListener("resize", updatePosition)
    }
  }, [width, height, setPosition, isMinimized, allowDrag])
}
