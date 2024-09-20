import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useRef } from "react"

export const config: PlasmoCSConfig = {}

/**
 * 从 URL 中提取目标地址
 * @param url 原始 URL
 * @returns 目标地址
 */
const getTargetUrl = (url: string): string | null => {
  const queryParams = new URLSearchParams(url.split("?")[1] || "")
  return queryParams.get("target") || queryParams.get("url")
}

/**
 * 判断是否是http地址
 * @param url url地址
 * @returns 是否为http链接
 */
const isHttpLink = (url: string) => {
  return url && url.startsWith("http")
}

const CommonExtension = () => {
  const clickListenerRef = useRef<null | ((e: Event) => void)>(null)

  useEffect(() => {
    autoRedirect()

    clickListenerRef.current = interceptLinkClick
    document.body.addEventListener("click", clickListenerRef.current)

    return () => {
      if (clickListenerRef.current) {
        document.body.removeEventListener("click", clickListenerRef.current)
      }
    }
  }, [])

  /**
   * 功能一：自动跳过安全提示页面并跳转到目标地址
   */
  const autoRedirect = () => {
    const currentUrl = window.location.href
    const targetUrl = getTargetUrl(currentUrl)
    isHttpLink(targetUrl) && window.location.replace(targetUrl)
  }

  /**
   * 功能二：拦截 <a> 标签点击事件，并根据目标 URL 进行跳转
   * @param event 事件对象
   */
  const interceptLinkClick = (event: Event) => {
    const clickedElement = event.target as HTMLElement
    if (clickedElement.nodeName.toLowerCase() !== "a") return

    const link = clickedElement as HTMLAnchorElement
    let url = link.getAttribute("href")
    if (url) {
      event.preventDefault()
      const targetUrl = getTargetUrl(url)
      isHttpLink(targetUrl) && (url = targetUrl)

      const shouldOpenInNewTab = link.getAttribute("target") === "_blank"
      shouldOpenInNewTab ? window.open(url) : (window.location.href = url)
    }
  }

  return <div style={{ display: "none" }}></div>
}

export default CommonExtension
