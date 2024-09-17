import { addCss } from "@utils/tools"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect } from "react"

export const config: PlasmoCSConfig = {
  matches: ["https://*.zhihu.com/*"]
}

export default function ZhihuExtension() {
  useEffect(() => {
    copyCodeFunc()
    autoOpenCodeFunc()
    closeLoginModalFunc()
  }, [])

  /**
   * 功能一： 修改复制按钮，支持一键复制
   */
  function copyCodeFunc() {
    const codeBlocks = document.querySelectorAll<HTMLElement>(".RichContent .highlight")
    codeBlocks.forEach((code) => {
      const button = document.createElement("button")
      button.innerText = "复制"
      button.style.position = "absolute"
      button.style.top = "0"
      button.style.right = "0"
      button.title = "一键复制代码"
      button.classList.add("Button", "VoteButton")

      code.appendChild(button)
      code.style.position = "relative"

      button.addEventListener("click", (e) => {
        const target = e.target as HTMLElement
        const parentCodeBlock = target.closest(".highlight")
        const codeContent = parentCodeBlock.querySelector<HTMLElement>("pre")?.innerText || ""

        navigator.clipboard.writeText(codeContent)

        target.innerText = "复制成功"
        setTimeout(() => {
          target.innerText = "复制"
        }, 1000)
        e.stopPropagation()
        e.preventDefault()
      })
    })
  }

  /**
   *  功能二： 隐藏登录弹窗
   */
  function closeLoginModalFunc() {
    // 添加CSS隐藏弹窗
    addCss(`
      .Modal-wrapper--transparent,
      .Modal-enter-done {
        display: none !important;
      }`)

    // 恢复页面滚动
    const htmlElement = document.querySelector("html")
    htmlElement.style.overflow = "auto"
    htmlElement.style.margin = "0"
  }

  /**
   * 功能三： 自动展开全文
   */
  function autoOpenCodeFunc() {
    removeExpandButton()
    removeRichContentCollapsed()
    // 添加CSS样式来处理折叠内容
    addCss(`
      .RichContent--unescapable.is-collapsed .RichContent-inner {
        max-height: unset !important;
        mask-image: unset !important;
      }
      .RichContent--unescapable.is-collapsed .ContentItem-rightButton {
        display: none !important;
      }`)
  }

  /**
   * 辅助函数： 移除展开按钮
   * @param element
   */
  function removeExpandButton(element?: Document | HTMLElement) {
    element = element || document
    const expandButtons = element.querySelectorAll(".ContentItem-expandButton")
    if (!expandButtons || !expandButtons.length) return
    expandButtons.forEach((button: HTMLElement) => {
      const parent = button.parentElement

      if (!parent) {
        button.style.display = "none"
        return
      }
      
      if (parent.classList.contains("RichContent")) {
        const collapsedContent = parent.querySelector(".RichContent-inner--collapsed") as HTMLElement
        collapsedContent && (collapsedContent.style.maxHeight = "unset")
        removeExpandButton(parent)
      } else {
        parent.style.display = "none"
      }
      button.style.display = "none"
    })
  }

  /**
   * 辅助函数： 移除所有折叠内容
   */
  function removeRichContentCollapsed() {
    const collapsedContents = document.querySelectorAll(".RichContent.is-collapsed")

    collapsedContents.forEach((content) => {
      content.classList.remove("is-collapsed")
    })
  }

  return <div style={{ display: "none" }}></div>
}
