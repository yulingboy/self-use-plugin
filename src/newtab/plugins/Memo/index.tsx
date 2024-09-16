import React, { useCallback, useEffect, useRef, useState } from "react";
import Modal, { type AppProps } from "@newtab/components/Modal";
import { Button, Input, Divider } from "antd";
import dayjs from "dayjs";
import { DeleteOutlined } from "@ant-design/icons";
import icon from "@newtab/static/icon/plugin_memo.svg"

const { TextArea } = Input;

// 定义备忘录数据类型
interface Memo {
  id: number;
  title: string;
  content: string;
  date: string; // 新建时间
  lastEdited: string; // 最近更新时间
}

const MemoPlugin: React.FC = () => {
  // 备忘录列表状态
  const [memos, setMemos] = useState<Memo[]>(() => {
    const savedMemos = localStorage.getItem("memos");
    return savedMemos ? JSON.parse(savedMemos) : [];
  });
  // 当前选中的备忘录ID
  const [selectedMemoId, setSelectedMemoId] = useState<number | null>(null);
  // 标题和内容的状态
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // 控制模态框显示
  const [visible, setVisible] = useState(false);
  // 控制鼠标悬停效果
  const [hoveredMemoId, setHoveredMemoId] = useState<number | null>(null);

  // 引用文本区域
  const textAreaRef = useRef<HTMLInputElement | null>(null);

  // 设置模态框配置
  const pluginSetting: AppProps = {
    title: "备忘录",
    allowDrag: false,
    allowFullscreen: true,
    allowMinimize: false,
  };

  // 保存备忘录到本地存储
  const saveToLocalStorage = (memos: Memo[]) => {
    localStorage.setItem("memos", JSON.stringify(memos));
  };

  // 关闭模态框并自动保存
  const close = () => {
    if (selectedMemoId) {
      updateMemo();
    }
    setVisible(false);
    resetForm();
  };

  // 打开模态框
  const open = () => {
    setVisible(true);
    // 默认打开上次编辑的备忘录
    if (memos.length > 0) {
      const lastEditedMemo = memos.reduce((prev, current) =>
        dayjs(prev.lastEdited).isAfter(dayjs(current.lastEdited)) ? prev : current
      );
      handleSelectMemo(lastEditedMemo);
    }
  };

  // 重置表单
  const resetForm = () => {
    setTitle("");
    setContent("");
    setSelectedMemoId(null);
  };

  // 更新备忘录
  const updateMemo = useCallback(() => {
    setMemos((prevMemos) => {
      const updatedMemos = prevMemos.map((memo) =>
        memo.id === selectedMemoId
          ? { ...memo, title, content, lastEdited: dayjs().format("YYYY-MM-DD HH:mm:ss") }
          : memo
      );
      saveToLocalStorage(updatedMemos);
      return updatedMemos;
    });
  },[content, selectedMemoId, title]);

  // 选择备忘录进行查看或编辑
  const handleSelectMemo = (memo: Memo) => {
    setSelectedMemoId(memo.id);
    setTitle(memo.title);
    setContent(memo.content);
  };

  // 删除备忘录
  const handleDeleteMemo = (memoId: number) => {
    setMemos((prevMemos) => {
      const index = prevMemos.findIndex((memo) => memo.id === memoId);
      const updatedMemos = prevMemos.filter((memo) => memo.id !== memoId);
      saveToLocalStorage(updatedMemos);

      if (updatedMemos.length > 0) {
        const nextMemo = updatedMemos.find((_, i) => index === i) || updatedMemos[index - 1];
        handleSelectMemo(nextMemo);
      } else {
        resetForm();
      }

      return updatedMemos;
    });
  };

  // 新增备忘录
  const handleAddMemo = () => {
    const newMemo: Memo = {
      id: Date.now(),
      title: "新建备忘录",
      content: "",
      date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      lastEdited: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    };
    setMemos((prevMemos) => {
      const updatedMemos = [...prevMemos, newMemo];
      saveToLocalStorage(updatedMemos);
      return updatedMemos;
    });
    handleSelectMemo(newMemo); // 自动选择新建的备忘录
  };
// 获取当前选中的备忘录
const currentMemo = memos.find((memo) => memo.id === selectedMemoId);
  // 自动保存更新内容（仅在关闭弹窗时保存）
  useEffect(() => {
    if (visible && selectedMemoId) {
      updateMemo();
    }
  }, [selectedMemoId, updateMemo, visible]);

  return (
    <div>
      <img className="" src={icon} alt="备忘录" onClick={open} />

      {/* 模态框 */}
      <Modal app={pluginSetting} onClose={close} visible={visible}>
        <div className="size-full flex bg-white">
          {/* 左侧列表部分 */}
          <div className="w-48 h-full flex flex-col shadow">
            <div className="h-0 shrink-0 flex-1 overflow-hidden">
              <div className="h-full overflow-auto">
                {memos.length === 0 && (
                  <p className="text-center text-gray-500">暂无备忘录</p>
                )}
                {memos.map((memo) => (
                  <div
                    key={memo.id}
                    className={`relative w-full    cursor-pointer `}
                    onMouseEnter={() => setHoveredMemoId(memo.id)}
                    onMouseLeave={() => setHoveredMemoId(null)}
                    onClick={() => handleSelectMemo(memo)}
                  >
                    <div
                      className={`hover:bg-blue-100 box-border p-2 ${
                        selectedMemoId === memo.id ? "bg-blue-100" : ""
                      }`}
                    >
                      <h2 className="w-full text-md truncate">{memo.title}</h2>
                      <h5 className="text-xs">{memo.date}</h5>
                    </div>

                    {/* 鼠标移入时显示删除按钮 */}
                    {hoveredMemoId === memo.id && (
                      <Button
                        icon={<DeleteOutlined />}
                        danger
                        ghost
                        size="small"
                        className="absolute right-2 top-2 border-none"
                        onClick={(e) => {
                          e.stopPropagation(); // 防止触发onClick事件
                          handleDeleteMemo(memo.id);
                        }}
                      ></Button>
                    )}
                    <Divider className="my-2" />
                  </div>
                ))}
              </div>
            </div>

            {/* 新增按钮固定在底部 */}
            <div className="p-2 border-t">
              <Button type="dashed" block onClick={handleAddMemo}>
                新增备忘录
              </Button>
            </div>
          </div>

          {/* 右侧编辑器部分 */}
          <div className="flex-1 flex flex-col h-full p-4">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-none rounded-none text-xl focus-within:shadow-none mb-2"
              placeholder="请输入标题"
            />
            <TextArea
              showCount
              maxLength={1000}
              ref={textAreaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 border-none rounded-none focus-within:border-none focus-within:shadow-none"
              style={{ resize: "none" }}
              placeholder="请输入内容"
            />
            <div className="text-sm flex gap-2 text-black/45">
              <p>新建时间：{currentMemo?.date || "无"}</p>
              <p>更新时间：{currentMemo?.lastEdited || "无"}</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MemoPlugin;
