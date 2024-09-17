import { addCss } from "@utils/tools"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect } from "react"

export const config: PlasmoCSConfig = {
  matches: ["https://*.blog.csdn.net/*"]
}


const CsdnExtension = () => {
  useEffect(() => {
    closeAdsFunc()
    copyCodeFunc()
    autoOpenCodeFunc()
    followFunc()
    closeVipFunc()
    closeLoginModalFunc()
  }, [])

  /**
   * 功能一： 修改复制按钮，支持一键复制
   */
  function copyCodeFunc() {
    copyCodeCssFunc()

    // 克隆内容区域以启用复制
    const contentViews = document.querySelector("#content_views")
    if (contentViews) {
      contentViews.replaceWith(contentViews.cloneNode(true))
    }

    // 修改复制按钮，支持一键复制
    const buttons = document.querySelectorAll<HTMLElement>(".hljs-button")

    buttons.forEach((btn) => {
      // 设置按钮标题
      btn.dataset.title = "复制"

      // 移除旧的点击事件
      btn.setAttribute("onclick", "")

      // 克隆按钮并替换
      const btnClone = btn.cloneNode(true)
      btn.parentNode.replaceChild(btnClone, btn)

      // 重新添加点击事件处理器
      btnClone.addEventListener("click", (e) => {
        const target = e.target as HTMLElement
        const parentPreBlock = target.closest("pre")
        const codeBlock = parentPreBlock.querySelector("code")

        if (codeBlock) {
          navigator.clipboard.writeText(codeBlock.innerText)
          target.dataset.title = "复制成功"
          setTimeout(() => {
            target.dataset.title = "复制"
          }, 1000)
        }
        e.stopPropagation()
        e.preventDefault()
      })
    })
  }

   /**
   * 功能二： 添加样式以支持代码自定义复制
   */
   function copyCodeCssFunc() {
    const css = `
      #content_views pre,
      #content_views pre code {
        -webkit-touch-callout: auto !important;
        -webkit-user-select: auto !important;
        -khtml-user-select: auto !important;
        -moz-user-select: auto !important;
        -ms-user-select: auto !important;
        user-select: auto !important;
      }`
    addCss(css)
  }

  /**
   * 功能三：关闭广告
   */
  function closeAdsFunc() {
    const css = `
      .toolbar-advert,
      #recommendAdBox,
      .adsbygoogle {
        display: none !important;
      }`
    addCss(css)
  }

  /**
   *  功能二四：解除关注提示，自动展开内容
   */
  function followFunc() {
    const readMoreButton = document.querySelector(".btn-readmore")
    if (readMoreButton) {
      const css = `
        #article_content {
          height: auto !important;
        }
        .hide-article-box {
          z-index: -1 !important;
        }`
      addCss(css)
    }
  }

  /**
   *  功能五：隐藏登录弹窗
   */
  function closeLoginModalFunc() {
    const css = `
      .passport-login-container {
        display: none !important;
      }`
    addCss(css)
  }

  /**
   *  功能六：自动展开代码块
   */
  function autoOpenCodeFunc() {
    const codeBlocks = Array.from(document.querySelectorAll<HTMLElement>("main div.blog-content-box pre.set-code-hide"))
    const hiddenBoxes = Array.from(document.querySelectorAll<HTMLElement>(".hide-preCode-box"))
    const readAllBox = document.querySelector<HTMLElement>(".readall_box")

    codeBlocks.forEach((block) => {
      block.style.height = "unset"
      block.style.maxHeight = "unset"
    })
    hiddenBoxes.forEach((box) => {
      box.style.display = "none"
    })

    if (readAllBox) {
      const articleContent = document.querySelector<HTMLElement>(".article_content")
      if (articleContent) {
        articleContent.style.height = "unset"
      }
      readAllBox.style.display = "none"
    }
  }

  /**
   *  功能七：关闭VIP提示框
   */
  function closeVipFunc() {
    document.querySelectorAll(".hide-article-box").forEach((box) => {
      box.remove()
    })
  }

  return <div style={{ display: "none" }}></div>
}

export default CsdnExtension
