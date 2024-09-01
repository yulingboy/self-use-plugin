import { isEmpty } from "@newtab/utils/common"
import axios from "@newtab/utils/request"

// Bing API的基础URL
const BING_BASE_URL = "https://cn.bing.com"

// 定义接口，描述API返回的图像数据结构
interface BingWallpaper {
  startdate: string
  fullstartdate: string
  enddate: string
  url: string
  urlbase: string
  copyright: string
  copyrightlink: string
  title: string
  quiz: string
  wp: boolean
  hsh: string
  drk: number
  top: number
  bot: number
  hs: string[]
}

/**
 * 获取Bing每日壁纸的完整URL
 * @param imageCount - 获取的壁纸数量，默认为1
 * @returns 完整的壁纸URL或null（如果请求失败或数据为空）
 */
export async function fetchDailyBingWallpaper(imageCount: number = 1): Promise<string | null> {
  try {
    // 发起请求，获取Bing每日壁纸数据
    const { data } = await axios.get<{ images: BingWallpaper[] }>("/HPImageArchive.aspx", {
      baseURL: BING_BASE_URL, // 设置基础URL
      params: {
        format: "js", // 返回JavaScript格式数据
        idx: 0, // 索引值0代表获取当天的壁纸
        n: imageCount, // 请求获取的壁纸数量，默认为1
        mkt: "zh-CN" // 市场区域为中国
      }
    })

    // 解构提取图像数据中的第一张图片
    const [firstImage] = data.images || []

    // 检查图像数据是否存在，存在则返回完整的图片URL
    return !isEmpty(firstImage) ? BING_BASE_URL + firstImage.url : null
  } catch (error) {
    return null
  }
}
