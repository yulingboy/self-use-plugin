import { useEffect } from "react"

/**
 * 曲线计算函数，用于根据鼠标位置计算缩放比例
 * @param totalRange 鼠标影响的总范围
 * @param centerX 鼠标的X轴位置
 * @param minScale 最小缩放比例
 * @param maxScale 最小缩放比例
 * @returns 缩放比例
 */
const calculateScale = (totalRange: number, centerX: number, minScale: number, maxScale: number) => {
  const startX = centerX - totalRange / 2 // 计算影响范围的起点
  const endX = centerX + totalRange / 2 // 计算影响范围的终点
  const scaleRange = maxScale - minScale // 计算缩放比例的范围

  // 返回一个函数，根据给定的x位置计算缩放比例
  return function (x: number): number {
    if (x < startX || x > endX) return minScale // 如果x超出影响范围，返回最小缩放
    // 根据正弦函数计算缩放比例
    return Math.sin(((x - startX) / totalRange) * Math.PI) * scaleRange + minScale
  }
}

// 自定义 Hook: 处理菜单项的缩放逻辑
const useDockScaling = (
  dockerRef: React.RefObject<HTMLDivElement>,
  itemRefs: React.MutableRefObject<(HTMLDivElement | null)[]>,
  range: number = 200,
  maxScale: number = 1.8
) => {
  useEffect(() => {
    const docker = dockerRef.current

    // 鼠标移动事件处理函数
    const handleMouseMove = (e: MouseEvent) => {
      const scaleFunction = calculateScale(range, e.clientX, 1, maxScale)
      applyScaleToItems(scaleFunction)
    }

    // 鼠标离开事件处理函数，恢复默认缩放
    const handleMouseLeave = () => {
      applyScaleToItems(() => 1)
    }

    // 应用缩放比例到菜单项
    const applyScaleToItems = (scaleFunc: (x: number) => number) => {
      itemRefs.current.forEach((item) => {
        if (item) {
          const rect = item.getBoundingClientRect()
          const centerX = rect.x + rect.width / 2
          const scale = scaleFunc(centerX)
          item.style.setProperty("--i", scale.toString())
        }
      })
    }

    // 添加事件监听
    if (docker) {
      docker.addEventListener("mousemove", handleMouseMove)
      docker.addEventListener("mouseleave", handleMouseLeave)
    }

    // 组件卸载时移除事件监听
    return () => {
      if (docker) {
        docker.removeEventListener("mousemove", handleMouseMove)
        docker.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [dockerRef, itemRefs, range, maxScale])
}

export default useDockScaling
