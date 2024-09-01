/**
 * 从指定的网页 URL 提取 favicon 的 URL。如果 favicon 是相对路径，将其转换为绝对路径，并验证其是否可以访问。
 * 如果没有找到 favicon 或无法访问，将尝试请求默认的 `/favicon.ico`。
 * @param webpageUrl 需要提取 favicon 的网页 URL
 * @returns 返回 favicon 的绝对 URL 或 null（如果没有找到或无法访问）
 */
export const fetchFaviconUrl = async (webpageUrl: string): Promise<string | null> => {
  try {
    const baseUrl = new URL(webpageUrl)

    // 获取页面 HTML 内容
    const htmlContent = await fetchHtmlContent(webpageUrl)
    if (!htmlContent) return null

    // 提取并验证 favicon
    const faviconUrl = await extractAndValidateFaviconUrl(htmlContent, baseUrl)
    if (faviconUrl) return faviconUrl

    // 尝试获取默认的 /favicon.ico
    const defaultFaviconUrl = getDefaultFaviconUrl(baseUrl)
    if (await isUrlAccessible(defaultFaviconUrl)) return defaultFaviconUrl

    return null
  } catch (error) {
    console.error("Error fetching favicon URL:", error)
    return null
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
    console.error("Error fetching HTML content:", error)
    return null
  }
}

/**
 * 从 HTML 内容中提取 favicon 的 URL，如果找到 favicon，则验证其是否可以访问。
 * @param htmlContent 页面 HTML 内容
 * @param baseUrl 页面 URL 的基础 URL（用于处理相对路径）
 * @returns 返回可访问的 favicon URL 或 null
 */
const extractAndValidateFaviconUrl = async (htmlContent: string, baseUrl: URL): Promise<string | null> => {
  const document = parseHtmlToDocument(htmlContent)

  const faviconUrl = extractFaviconUrlFromDocument(document, baseUrl)
  if (faviconUrl && (await isUrlAccessible(faviconUrl))) {
    return faviconUrl
  }

  return null
}

/**
 * 将 HTML 字符串解析为 DOM Document。
 * @param htmlContent HTML 内容字符串
 * @returns 返回解析后的 Document 对象
 */
const parseHtmlToDocument = (htmlContent: string): Document => {
  const parser = new DOMParser()
  return parser.parseFromString(htmlContent, "text/html")
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
const isUrlAccessible = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: "HEAD" })
    return response.ok
  } catch (error) {
    console.error("Error checking URL accessibility:", error)
    return false
  }
}
