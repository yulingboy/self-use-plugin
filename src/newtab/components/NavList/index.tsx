import { fetchFaviconUrl } from "@newtab/utils/img"
import { message } from "antd"
import React, { useEffect, useState } from "react"

// 站点信息类型定义
type SiteInfo = {
  url: string
  title: string
  iconBase64: string
}

const NavList: React.FC = () => {
  const [siteList, setSiteList] = useState<SiteInfo[]>([]) // 站点列表状态
  const [messageApi, contextHolder] = message.useMessage() // 消息提示 API

  useEffect(() => {
    initializeSites() // 初始化站点数据
  }, [])

  // 初始化站点数据
  const initializeSites = async () => {
    const cachedSites = getCachedSites() // 获取缓存的站点
    if (cachedSites) {
      setSiteList(cachedSites) // 如果有缓存，则直接设置站点列表
    } else {
      await loadTopSites() // 否则从 Chrome API 加载站点
    }
  }

  // 获取缓存站点数据
  const getCachedSites = (): SiteInfo[] | null => {
    const cachedData = localStorage.getItem("siteList")
    return cachedData ? JSON.parse(cachedData) : null
  }

  // 缓存站点数据
  const cacheSites = (sites: SiteInfo[]) => {
    localStorage.setItem("siteList", JSON.stringify(sites))
  }

  // 从 Chrome API 加载站点
  const loadTopSites = async () => {
    if (!chrome?.topSites?.get) return messageApi.warning("chrome.topSites API 不可用")

    messageApi.info("正在加载站点数据，请稍候...")

    try {
      const topSites = await chrome.topSites.get() // 获取 topSites 数据
      const sitesWithIcons = await fetchSitesWithIcons(topSites) // 获取站点图标并转换为 Base64
      setSiteList(sitesWithIcons) // 设置站点列表
      cacheSites(sitesWithIcons) // 缓存站点数据
    } catch (error) {
      messageApi.error("获取站点数据失败，请稍后再试。")
    }
  }

  // 处理站点图标并转换为 Base64 格式
  const fetchSitesWithIcons = async (topSites: chrome.topSites.MostVisitedURL[]) => {
    return Promise.all(
      topSites.map(async (site) => {
        const iconUrl = await fetchFaviconUrl(site.url) // 获取站点的图标 URL
        const iconBase64 = iconUrl ? await convertImageToBase64(iconUrl) : "" // 将图标转换为 Base64
        return {
          url: site.url,
          title: site.title,
          iconBase64
        }
      })
    )
  }

  // 将图片 URL 转换为 Base64
  const convertImageToBase64 = (imageUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "Anonymous"
      img.src = imageUrl

      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height

        const ctx = canvas.getContext("2d")
        ctx?.drawImage(img, 0, 0)

        resolve(canvas.toDataURL("image/png")) // 返回 Base64 字符串
      }

      img.onerror = reject // 处理加载错误
    })
  }

  // 处理点击事件，打开站点
  const handleNavigateToSite = (site: SiteInfo) => {
    window.open(site.url)
  }

  // 渲染站点组件
  return (
    <div className="grid auto-rows-auto grid-cols-8 gap-8">
      {contextHolder}
      {siteList.map((site) => (
        <div key={site.url} className="relative size-16 cursor-pointer" onClick={() => handleNavigateToSite(site)}>
          <div className="flex size-16 items-center justify-center overflow-hidden rounded-2xl bg-white">
            {site.iconBase64 ? <img src={site.iconBase64} alt={site.title} className="max-h-16 max-w-16" /> : <div>图标</div>}
          </div>
          <div className="absolute -bottom-6 left-1/2 w-full -translate-x-1/2 truncate text-center text-white">{site.title}</div>
        </div>
      ))}
    </div>
  )
}

export default NavList
