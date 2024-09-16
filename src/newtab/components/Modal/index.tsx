import { findMaxZIndex } from "@newtab/utils/domTools"
import React, { useEffect, useState, type ReactNode } from "react"
import ReactDOM from "react-dom"

import ModalControlButtons from "./ModalControlButtons" // 引入新的按钮组件

import { useCenteredPosition } from "./useCenteredPosition"
import { useDraggable } from "./useDraggable"
import { useFullscreen } from "./useFullscreen"

export interface AppProps {
  title: string
  titleBgColor?: string
  titleColor?: string
  disableResize?: boolean
  width?: number
  height?: number
  allowMinimize?: boolean
  allowDrag?: boolean
  allowFullscreen?: boolean
}

interface ModalProps {
  app: AppProps
  visible: boolean
  onClose: () => void
  children: ReactNode
}

const defaultAppProps: Partial<AppProps> = {
  width: 800,
  height: 600,
  allowMinimize: true,
  allowDrag: true,
  allowFullscreen: true
}

const Modal: React.FC<ModalProps> = ({ app = defaultAppProps, visible, onClose, children }) => {
  const {
    width = defaultAppProps.width || 600,
    height = defaultAppProps.height || 400,
    allowMinimize = defaultAppProps.allowMinimize,
    allowDrag = defaultAppProps.allowDrag,
    allowFullscreen = defaultAppProps.allowFullscreen
  } = app

  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  const [zIndex, setZIndex] = useState<number>(100)
  const [isClosing, setIsClosing] = useState<boolean>(false)
  const [isMinimized, setIsMinimized] = useState<boolean>(false)

  const { position, isDragging, handleMouseDown, setPosition, elementRef } = useDraggable()
  const { isFullscreen, toggleFullscreen, size, position: fullscreenPosition } = useFullscreen({ width, height }, position)

  // / 使用自定义 Hook 监听窗口大小变化并居中弹窗
  useCenteredPosition(width, height, setPosition, isMinimized, allowDrag)

  useEffect(() => {
    const newContainer = document.createElement("div")
    document.body.appendChild(newContainer)
    setContainer(newContainer)
    setZIndex(findMaxZIndex())

    return () => {
      document.body.removeChild(newContainer)
    }
  }, [])

  useEffect(() => {
    if (width && height && !isMinimized) {
      setPosition({
        x: (window.innerWidth - width) / 2,
        y: (window.innerHeight - height) / 2
      })
    }
  }, [width, height, setPosition, isMinimized])

  const handleDoubleClick = () => {
    if (allowFullscreen) toggleFullscreen()
  }

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!allowDrag || isFullscreen || isMinimized) return
    handleMouseDown(e)
  }

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (container && !container.contains(e.target as Node)) {
      handleClose()
    }
  }

  const handleFullscreenClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    if (allowFullscreen) toggleFullscreen()
  }

  const handleMinimizeClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    if (allowMinimize) setIsMinimized((prev) => !prev)
  }

  const handleCloseClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    handleClose()
  }

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 300)
  }

  const modalContent = (
    <div
      className={`fixed bottom-0 left-0 right-0 top-0 ${!isDragging ? "duration-300" : ""} ${isClosing ? "opacity-0" : "opacity-100"}`}
      style={{ zIndex }}
      onClick={handleOutsideClick}>
      <div
        className={`absolute flex flex-col overflow-hidden rounded-lg bg-white/80 backdrop-blur-xl ${!isDragging ? "transition-all duration-300 ease-in-out" : ""} ${isFullscreen ? "fullscreen" : ""} ${isMinimized ? "minimized" : ""}`}
        style={{
          width: `${isMinimized ? 200 : size.width}px`,
          height: `${isMinimized ? 40 : size.height}px`,
          left: `${isMinimized ? 20 : isFullscreen ? fullscreenPosition.x : position.x}px`,
          top: `${isMinimized ? window.innerHeight - 60 : isFullscreen ? fullscreenPosition.y : position.y}px`
        }}
        ref={elementRef}>
        {/* header */}
        <div
          className={`header flex h-10 shrink-0 items-center justify-between bg-white/50 shadow backdrop-blur-xl ${allowDrag ? "cursor-move" : "cursor-default"}`}
          onMouseDown={handleDragStart}
          onDoubleClick={handleDoubleClick}>
          <div className={`flex flex-1 items-center justify-center text-sm text-slate-800 ${isMinimized ? "" : "pl-20"}`}>{app.title}</div>
          <ModalControlButtons
            allowFullscreen={allowFullscreen}
            allowMinimize={allowMinimize}
            onFullscreenClick={handleFullscreenClick}
            onMinimizeClick={handleMinimizeClick}
            onCloseClick={handleCloseClick}
          />
        </div>
        {!isMinimized && <div className="w-full flex-1 overflow-hidden">{children}</div>}
      </div>
    </div>
  )

  return visible && container ? ReactDOM.createPortal(modalContent, container) : null
}

export default Modal
