import { KCPP } from "k-colors"

import { isEmpty } from "./common"

/**
 * 通用函数：将图片（URL 或文件）转换为 Base64 编码。
 * @param source 图片来源，可以是 URL 字符串或 File 对象
 * @returns 返回 Base64 编码的图片数据
 */
export const convertToBase64 = (source: string | File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (typeof source === "string") {
      // 如果是 URL
      const img = new Image()
      img.crossOrigin = "Anonymous" // 支持跨域图片
      img.src = source

      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height

        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.drawImage(img, 0, 0)
          resolve(canvas.toDataURL("image/png"))
        } else {
          reject(new Error("无法获取 Canvas 渲染上下文"))
        }
      }

      img.onerror = () => {
        reject(new Error("图片加载失败"))
      }
    } else if (source instanceof File) {
      // 如果是 File 对象
      const reader = new FileReader()
      reader.readAsDataURL(source)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    } else {
      reject(new Error("无效的图片来源"))
    }
  })
}

/**
 * 检查指定的 URL 是否可以正常访问。
 * @param url 需要检查的 URL 地址
 * @returns 如果 URL 可以访问返回 true，否则返回 false
 */
export async function isUrlAccessible(url: string): Promise<boolean> {
  if (isEmpty(url)) return false

  const tempImg = new Image()
  tempImg.src = url

  try {
    await new Promise<void>((resolve, reject) => {
      tempImg.onload = () => resolve()
      tempImg.onerror = () => reject(new Error("图片加载失败"))
    })
    return true
  } catch {
    return false
  }
}

/**
 * 从图片 URL 提取主要颜色并返回十六进制格式。
 * @param url 图片的 URL 地址
 * @returns 主要颜色的十六进制字符串数组
 */
export const getOptimalBackgroundColor = (url: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image()
      img.crossOrigin = "Anonymous" // 支持跨域图片
      img.src = url

      img.onload = () => {
        try {
          const kcpp = new KCPP(img)
          const result = kcpp.k_colors_pp(3)

          // 转换为十六进制的 RGB 颜色字符串
          const colorList = result.colors.map((color) => `#${((1 << 24) + (color[0] << 16) + (color[1] << 8) + color[2]).toString(16).slice(1)}`)

          resolve(colorList)
        } catch (error) {
          reject(error)
        }
      }

      img.onerror = () => {
        reject(new Error("图片加载失败"))
      }
    } catch (error) {
      reject(new Error("处理图片失败"))
    }
  })
}
