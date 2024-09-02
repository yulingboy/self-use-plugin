import { isUrlAccessible } from "./img"

/**
 * 获取网站信息
 * @param webpageUrl 网页地址
 * @returns 
 */
export const fetchWebsiteInfo = async (webpageUrl: string): Promise<{ favicon: string | null, title: string | null, description: string | null }> => {
  try {
    const baseUrl = new URL(webpageUrl)

    // 获取页面 HTML 内容
    const htmlContent = await fetchHtmlContent(webpageUrl)
    if (!htmlContent) return { favicon: null, title: null, description: null }

    // 解析 HTML 内容
    const document = parseHtmlToDocument(htmlContent)

    // 提取并验证 favicon
    const favicon = await extractAndValidateFaviconUrlFromDocument(document, baseUrl)

    // 提取标题和描述
    const title = extractTitleFromDocument(document)
    const description = extractDescriptionFromDocument(document)

    return { favicon, title, description }
  } catch (error) {
    return { favicon: null, title: null, description: null }
  }
}

/**
 * 请求网页并返回其 HTML 内容。
 * @param url 请求的网页 URL
 * @returns 返回 HTML 内容字符串，如果请求失败返回 null
 */
const fetchHtmlContent = async (url: string): Promise<string | null> => {
  try {
    const response = await fetch(url)
    if (!response.ok) return null

    return await response.text()
  } catch (error) {
    return null
  }
}

/**
 * 从 HTML 内容中提取 favicon 的 URL，如果找到 favicon，则验证其是否可以访问。
 * @param document 页面 HTML 文档
 * @param baseUrl 页面 URL 的基础 URL（用于处理相对路径）
 * @returns 返回可访问的 favicon URL 或 null
 */
const extractAndValidateFaviconUrlFromDocument = async (document: Document, baseUrl: URL): Promise<string | null> => {
  const faviconUrl = extractFaviconUrlFromDocument(document, baseUrl)
  if (faviconUrl && (await isUrlAccessible(faviconUrl))) {
    return faviconUrl
  }

  // 尝试获取默认的 /favicon.ico
  const defaultFaviconUrl = getDefaultFaviconUrl(baseUrl)
  if (await isUrlAccessible(defaultFaviconUrl)) return defaultFaviconUrl

  return null
}

/**
 * 从 HTML 文档中提取 favicon 的 URL。
 * @param document HTML Document 对象
 * @param baseUrl 用于处理相对路径的基础 URL
 * @returns 返回 favicon 的绝对 URL 或 null
 */
const extractFaviconUrlFromDocument = (document: Document, baseUrl: URL): string | null => {
  const iconLinkElement = document.querySelector<HTMLLinkElement>('link[rel~="icon"], link[rel="shortcut icon"]')
  if (iconLinkElement && iconLinkElement.href) {
    const href = iconLinkElement.getAttribute("href")?.trim() || ""
    const isAbsolutePath = href.startsWith("http://") || href.startsWith("https://")

    // 如果是相对路径，基于 baseUrl 转换为绝对路径
    return isAbsolutePath ? href : new URL(href, baseUrl).href
  }
  return null
}

/**
 * 从 HTML 文档中提取标题。
 * @param document HTML Document 对象
 * @returns 返回页面标题或 null
 */
const extractTitleFromDocument = (document: Document): string | null => {
  const titleElement = document.querySelector('title')
  return titleElement ? titleElement.textContent?.trim() || null : null
}

/**
 * 从 HTML 文档中提取描述。
 * @param document HTML Document 对象
 * @returns 返回页面描述或 null
 */
const extractDescriptionFromDocument = (document: Document): string | null => {
  const descriptionMetaElement = document.querySelector('meta[name="description"]')
  return descriptionMetaElement ? descriptionMetaElement.getAttribute("content")?.trim() || null : null
}

/**
 * 返回默认的 /favicon.ico 路径的 URL。
 * @param baseUrl 用于构造 favicon 的基础 URL
 * @returns 返回默认 favicon.ico 的绝对 URL
 */
const getDefaultFaviconUrl = (baseUrl: URL): string => {
  return new URL("/favicon.ico", baseUrl).href
}

/**
 * 检查指定的 URL 是否可以正常访问。
 * @param url 需要检查的 URL
 * @returns 如果 URL 可以访问返回 true，否则返回 false
 */
// const isUrlAccessible = async (url: string): Promise<boolean> => {
//   try {
//     const response = await fetch(url, { method: "HEAD" })
//     return response.ok
//   } catch (error) {
//     return false
//   }
// }

/**
 * 将 HTML 字符串解析为 DOM Document。
 * @param htmlContent HTML 内容字符串
 * @returns 返回解析后的 Document 对象
 */
const parseHtmlToDocument = (htmlContent: string): Document => {
  const parser = new DOMParser()
  return parser.parseFromString(htmlContent, "text/html")
}
