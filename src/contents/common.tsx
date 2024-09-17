import type { PlasmoCSConfig } from "plasmo"
import { useEffect } from "react"

export const config: PlasmoCSConfig = {}

const CsdnExtension = () => {
  useEffect(() => {
    redirectToTargetUrl()
  }, [])

  /**
   * 功能一： 自动跳过安全提示页面
   * @returns
   */
  function redirectToTargetUrl() {
    const href = window.location.href
    const target = extractTargetUrl(href)
    if (!target || !target.startsWith("http")) return

    // 显示加载中提示
    showLoading()

    // 跳转到目标 URL
    window.location.replace(target)
  }

  /**
   * 辅助函数 从 URL 中提取目标地址参数
   * @param url 原始url
   * @returns 目标url
   */
  function extractTargetUrl(url: string): string | null {
    if (!url.includes("target") && !url.includes("url")) return null
    const queryParams = new URLSearchParams(url.split("?")[1] || "")
    return queryParams.get("target") || queryParams.get("url")
  }

  /**
   * 显示加载中提示
   */
  function showLoading() {
    document.body.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px 40px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        text-align: center;
        z-index: 9999;
      ">
        <p>正在跳转中， 请稍后...</p>
      </div>
    `
  }

  return <div style={{ display: "none" }}></div>
}

export default CsdnExtension
