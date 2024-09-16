import { useState, useRef, useEffect, useCallback } from "react";

// 位置接口定义
interface Position {
  x: number;
  y: number;
}

// useDraggable Hook 返回值接口定义
interface UseDraggableReturn {
  position: Position;
  isDragging: boolean;
  handleMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  setPosition: React.Dispatch<React.SetStateAction<Position>>;
  elementRef: React.RefObject<HTMLDivElement>;
}

// 自定义 Hook 实现拖拽功能
export const useDraggable = (): UseDraggableReturn => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 }); // 元素的位置状态
  const [isDragging, setIsDragging] = useState<boolean>(false); // 是否正在拖拽状态
  const dragStartPos = useRef<Position>({ x: 0, y: 0 }); // 记录拖拽开始时鼠标的初始位置
  const dragOffset = useRef<Position>({ x: 0, y: 0 }); // 记录拖拽时鼠标与元素左上角的偏移量
  const elementRef = useRef<HTMLDivElement | null>(null); // 用于引用拖拽的元素

  // 当用户按下鼠标时触发，开始拖拽
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      dragStartPos.current = { x: e.clientX, y: e.clientY }; // 记录鼠标初始位置
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }; // 计算并记录偏移量
      setIsDragging(true); // 设置拖拽状态为 true
    }
  };

  // 当用户移动鼠标时触发，更新元素位置
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (elementRef.current && isDragging) {
        const rect = elementRef.current.getBoundingClientRect();
        const elementWidth = rect.width;
        const elementHeight = rect.height;

        // 计算新位置
        let newX = e.clientX - dragOffset.current.x;
        let newY = e.clientY - dragOffset.current.y;

        // 获取窗口的宽度和高度
        const windowWidth =
          document.documentElement.clientWidth || document.body.clientWidth;
        const windowHeight =
          document.documentElement.clientHeight || document.body.clientHeight;

        // 边界判断，确保元素不会超出窗口可视区域
        newX = Math.max(0, Math.min(newX, windowWidth - elementWidth));
        newY = Math.max(0, Math.min(newY, windowHeight - elementHeight));
        if(e.clientX < 0 || e.clientX > windowWidth || e.clientY < 0  || e.clientY > windowHeight) {
          setIsDragging(false); // 结束拖拽状态
          return
        }

        // 更新位置状态
        setPosition({ x: newX, y: newY });
      }
    },
    [isDragging]
  );

  // 当用户松开鼠标或鼠标移出窗口时触发，结束拖拽
  const endDrag = useCallback(() => {
    setIsDragging(false); // 结束拖拽状态
    // 移除全局事件监听器
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", endDrag);
  }, [handleMouseMove]);

  useEffect(() => {
    if (isDragging) {
      // 监听全局的鼠标移动、松开和离开窗口事件
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", endDrag);
    }

    // 在组件卸载时移除监听器
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", endDrag);
    };
  }, [handleMouseMove, endDrag, isDragging]);

  // 返回 Hook 的状态和方法
  return {
    position, // 当前元素的位置
    isDragging,
    handleMouseDown, // 处理鼠标按下事件的方法
    setPosition, // 外部可以直接设置位置的方法
    elementRef, // 传递给目标元素的 ref
  };
};
