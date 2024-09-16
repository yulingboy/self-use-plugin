import React, { type ReactNode, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { findMaxZIndex } from "@newtab/utils/domTools";
import { useDraggable } from "./useDraggable"; // 引入自定义的拖拽 Hook
import { useFullscreen } from "./useFullscreen";

export interface AppProps {
  title: string;
  titleBgColor?: string;
  titleColor?: string;
  disableResize?: boolean;
  width?: number;
  height?: number;
  allowMinimize?: boolean; // 是否允许最小化
  allowDrag?: boolean;     // 是否允许拖拽
  allowFullscreen?: boolean; // 是否允许全屏切换
}

interface ModalProps {
  app: AppProps;
  visible: boolean; // 控制模态框是否显示
  onClose: () => void; // 关闭模态框的回调函数
  children: ReactNode;
}

const defaultAppProps: Partial<AppProps> = {
  width: 800,
  height: 600,
  allowMinimize: true,
  allowDrag: true,
  allowFullscreen: true,
};

const Modal: React.FC<ModalProps> = ({
  app = defaultAppProps,
  visible,
  onClose,
  children,
}) => {
  const {
    width = defaultAppProps.width || 600,
    height = defaultAppProps.height || 400,
    allowMinimize = defaultAppProps.allowMinimize,
    allowDrag = defaultAppProps.allowDrag,
    allowFullscreen = defaultAppProps.allowFullscreen,
  } = app;

  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [zIndex, setZIndex] = useState<number>(100);
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  

  const { position, isDragging, handleMouseDown, setPosition, elementRef } = useDraggable();
  const { isFullscreen, toggleFullscreen, size, position: fullscreenPosition } = useFullscreen(
    { width, height },
    position
  );

  // 初始化模态框容器并将其添加到 DOM 中
  useEffect(() => {
    const newContainer = document.createElement("div");
    document.body.appendChild(newContainer);
    setContainer(newContainer);
    setZIndex(findMaxZIndex());

    return () => {
      document.body.removeChild(newContainer);
    };
  }, []);

  // 初始化模态框的位置
  useEffect(() => {
    if (width && height && !isMinimized) {
      setPosition({
        x: (window.innerWidth - width) / 2,
        y: (window.innerHeight - height) / 2,
      });
    }
  }, [width, height, setPosition, isMinimized]);

  // 处理双击事件，切换全屏状态
  const handleDoubleClick = () => {
    if (allowFullscreen) toggleFullscreen();
  };

  // 处理鼠标按下事件
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!allowDrag || isFullscreen || isMinimized) return;
    handleMouseDown(e);
  };

  // 点击模态框外部区域时关闭模态框
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (container && !container.contains(e.target as Node)) {
      handleClose();
    }
  };

  // 处理全屏按钮点击事件
  const handleFullscreenClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (allowFullscreen) toggleFullscreen();
  };

  // 处理最小化按钮点击事件
  const handleMinimizeClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (allowMinimize) setIsMinimized((prev) => !prev);
  };

  // 处理关闭按钮点击事件
  const handleCloseClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    handleClose();
  };

  // 关闭模态框的函数
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300); // 动画时间应与 CSS 中的动画时间一致
  };

  // 模态框内容
  const modalContent = (
    <div
      className={`fixed left-0 top-0 right-0 bottom-0 ${!isDragging ? "duration-300" : ""} ${isClosing ? "opacity-0" : "opacity-100"}`}
      style={{ zIndex }}
      onClick={handleOutsideClick}
    >
      <div
        className={`absolute bg-white/80 rounded-lg overflow-hidden backdrop-blur-xl flex flex-col ${!isDragging ? "transition-all duration-300 ease-in-out" : ""} ${isFullscreen ? "fullscreen" : ""} ${isMinimized ? "minimized" : ""}`}
        style={{
          width: `${isMinimized ? 200 : size.width}px`,
          height: `${isMinimized ? 40 : size.height}px`,
          left: `${isMinimized ? 20 : isFullscreen ? fullscreenPosition.x : position.x}px`,
          top: `${isMinimized ? window.innerHeight - 60 : isFullscreen ? fullscreenPosition.y : position.y}px`,
        }}
        ref={elementRef}
      >
        {/* header */}
        <div
          className={`header shadow h-10 bg-white/50 backdrop-blur-xl flex shrink-0 items-center justify-between ${allowDrag ? 'cursor-move' : 'cursor-default'}`}
          onMouseDown={handleDragStart}
          onDoubleClick={handleDoubleClick}
        >
          <div className={`flex-1 flex items-center justify-center text-sm text-slate-800 ${isMinimized ? "" : "pl-20"}`}>
            {app.title}
          </div>
          <div className="flex gap-2 pr-4">
            {allowFullscreen && (
              <div
                className="w-4 h-4 rounded-full bg-green-500 cursor-pointer"
                onClick={handleFullscreenClick}
                title="全屏"
              ></div>
            )}
            {allowMinimize && (
              <div
                className="w-4 h-4 rounded-full bg-yellow-500 cursor-pointer"
                onClick={handleMinimizeClick}
                title="最小化"
              ></div>
            )}
            <div
              className="w-4 h-4 rounded-full bg-red-500 cursor-pointer"
              onClick={handleCloseClick}
              title="关闭"
            ></div>
          </div>
        </div>
        {/* content */}
        {!isMinimized && <div className="flex-1 w-full overflow-hidden">{children}</div>}
      </div>
    </div>
  );

  return visible && container ? ReactDOM.createPortal(modalContent, container) : null;
};

export default Modal;
