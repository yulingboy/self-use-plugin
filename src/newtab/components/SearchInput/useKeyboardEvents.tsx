import { useCallback, useEffect } from "react"

type UseKeyboardEventsProps = {
  onTab: () => void
  onAlt: () => void
  onArrowDown: () => void
  onArrowUp: () => void
  onEnter: () => void
}

export const useKeyboardEvents = ({ onTab, onAlt, onArrowDown, onArrowUp, onEnter }: UseKeyboardEventsProps) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case "Tab":
          event.preventDefault()
          onTab()
          break
        case "Alt":
          event.preventDefault()
          onAlt()
          break
        case "ArrowDown":
          onArrowDown()
          break
        case "ArrowUp":
          onArrowUp()
          break
        case "Enter":
          onEnter()
          break
        default:
          break
      }
    },
    [onTab, onAlt, onArrowDown, onArrowUp, onEnter]
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])
}
