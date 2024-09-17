import dayjs from "dayjs"
import { saveAs } from "file-saver"

/**
 * 动态添加 CSS 样式
 * @param code - CSS 代码
 */
export function addCss(code: string) {
  const style = document.createElement("style")
  style.textContent = code
  document.head.appendChild(style)
}

/**
 * 动态添加 JS 脚本
 * @param code - JS 代码
 */
export function addJs(code: string) {
  const script = document.createElement("script")
  script.textContent = code
  document.head.appendChild(script)
}

/**
 * 保存文本文件
 * @param txt - 文本内容
 * @param filename - 文件名（可选）
 */
export function saveTxt(txt: string, filename: string = "下载") {
  if (txt) {
    const blob = new Blob([txt], { type: "text/plain;charset=utf-8" })
    saveAs(blob, `${filename}-${dayjs().format("YYYY-MM-DD HH:mm:ss")}.txt`)
  }
}

/**
 * 保存 HTML 文件
 * @param dom - DOM 元素
 * @param filename - 文件名（可选）
 */
export function saveHtml(dom: Element, filename: string = "下载") {
  if (dom) {
    const blob = new Blob([dom.outerHTML], { type: "text/html;charset=utf-8" })
    saveAs(blob, `${filename}-${dayjs().format("YYYY-MM-DD HH:mm:ss")}.html`)
  }
}

/**
 * 保存 Markdown 文件
 * @param markdown - Markdown 内容
 * @param filename - 文件名（可选）
 */
export function saveMarkdown(markdown: string, filename: string = "下载") {
  if (markdown) {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" })
    saveAs(blob, `${filename}-${dayjs().format("YYYY-MM-DD HH:mm:ss")}.md`)
  }
}

/**
 * 根据 meta property 获取 meta content
 * @param metaProperty - meta 属性名
 * @returns 对应的 content 值
 */
export function getMetaContentByProperty(metaProperty: string): string {
  const meta = document.querySelector(`meta[property="${metaProperty}"]`)
  return meta ? meta.getAttribute("content") || "" : ""
}

/**
 * 验证 URL 是否有效
 * @param urlString - URL 字符串
 * @returns 是否为有效 URL
 */
export function isValidUrl(urlString: string): boolean {
  try {
    return !!new URL(urlString)
  } catch (e) {
    return false
  }
}
