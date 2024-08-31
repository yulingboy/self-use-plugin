import { useEffect } from "react"

/**
 * 点击元素外面
 * @param refObject 需要判断的元素
 * @param callback 需要执行的回调函数
 */
function useClickOutside(refObject: React.RefObject<HTMLElement>, callback: () => void) {
  const handleClickOutside = (e: MouseEvent) => {
    if (!refObject?.current?.contains(e.target as Node)) {
      callback()
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  })
}
export default useClickOutside
