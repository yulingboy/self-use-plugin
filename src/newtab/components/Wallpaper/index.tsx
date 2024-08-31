import { fetchDailyBingWallpaper } from "@newtab/api/wallpaper"
// 定义默认图片 URL
// const DEFAULT_WALLPAPER_URL = "https://example.com/default-wallpaper.jpg"

import DEFAULT_WALLPAPER_URL from "@newtab/static/warrper/001.webp"
import React, { useEffect, useState } from "react"

// 定义用于存储本地数据的键名
const LOCAL_STORAGE_KEY = "dailyBingWallpaper"
const LOCAL_STORAGE_TIME_KEY = "dailyBingWallpaperTime"

const DailyBingWallpaper: React.FC = () => {
  const [backgroundUrl, setBackgroundUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchAndStoreWallpaper = async () => {
      try {
        const today = new Date().toDateString()

        // 检查本地是否已经存储了壁纸 URL 和时间
        const storedWallpaperUrl = localStorage.getItem(LOCAL_STORAGE_KEY)
        const storedWallpaperDate = localStorage.getItem(LOCAL_STORAGE_TIME_KEY)

        // 如果本地存储的壁纸是今天的，直接使用它
        if (storedWallpaperUrl && storedWallpaperDate === today) {
          setBackgroundUrl(storedWallpaperUrl)
        } else {
          // 否则，从 Bing 获取新的壁纸并存储到本地
          const newWallpaperUrl = await fetchDailyBingWallpaper()

          if (newWallpaperUrl) {
            setBackgroundUrl(newWallpaperUrl)
            localStorage.setItem(LOCAL_STORAGE_KEY, newWallpaperUrl)
            localStorage.setItem(LOCAL_STORAGE_TIME_KEY, today)
          } else {
            setBackgroundUrl(DEFAULT_WALLPAPER_URL) // 如果获取失败，设置为默认壁纸
          }
        }
      } catch (error) {
        console.error("Error fetching Bing wallpaper:", error)
        setBackgroundUrl(DEFAULT_WALLPAPER_URL) // 设置为默认壁纸
      } finally {
        setIsLoading(false)
      }
    }

    fetchAndStoreWallpaper()
  }, [])

  // 图片加载失败时回退到默认壁纸
  const handleImageError = () => {
    setBackgroundUrl(DEFAULT_WALLPAPER_URL)
  }

  return (
    <div className="fixed z-0 size-full bg-cover bg-no-repeat" style={{ backgroundImage: `url(${backgroundUrl})` }}>
      {/*  隐藏图片元素，仅用于触发 onError */}
      {isLoading ? null : <img src={backgroundUrl} onError={handleImageError} className="hidden" />}
    </div>
  )
}

export default DailyBingWallpaper
