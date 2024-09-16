import React from "react"

interface ModalControlButtonsProps {
  allowFullscreen: boolean
  allowMinimize: boolean
  onFullscreenClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onMinimizeClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onCloseClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const ModalControlButtons: React.FC<ModalControlButtonsProps> = ({ allowFullscreen, allowMinimize, onFullscreenClick, onMinimizeClick, onCloseClick }) => {
  return (
    <div className="flex gap-2 pr-4">
      {allowFullscreen && <div className="h-4 w-4 cursor-pointer rounded-full bg-green-500" onClick={onFullscreenClick} title="全屏"></div>}
      {allowMinimize && <div className="h-4 w-4 cursor-pointer rounded-full bg-yellow-500" onClick={onMinimizeClick} title="最小化"></div>}
      <div className="h-4 w-4 cursor-pointer rounded-full bg-red-500" onClick={onCloseClick} title="关闭"></div>
    </div>
  )
}

export default ModalControlButtons
