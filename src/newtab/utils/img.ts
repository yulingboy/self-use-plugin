
/**
 * 网络图片转base64
 * @param imageUrl 
 * @returns 
 */
export const convertImageToBase64 = (imageUrl: string): Promise<string> => {
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

import { isEmpty } from "./common"

/**
 * 检查指定的 URL 是否可以正常访问。
 * @param url 需要检查的 URL
 * @returns 如果 URL 可以访问返回 true，否则返回 false
 */
export async function isUrlAccessible(url: string) {
  if (isEmpty(url)) return false

  let tempImg = new Image()
  tempImg.src = url

  try {
    await new Promise((resolve, reject) => {
      tempImg.onload = resolve
      tempImg.onerror = reject
    })
    return true
  } catch {
    return false
  } finally {
    tempImg.remove()
  }
}

/**
 * 校验是否为图片文件
 *
 * @param file 文件Blob
 * @returns boolean
 */
export function isImageFile(file: Blob) {
  const imageType = ["png", "jpeg", "jpg", "gif"]

  let fileType = file.type
  fileType = fileType.substring(fileType.lastIndexOf("/") + 1, fileType.length)

  return imageType.includes(fileType)
}

/**
 * 获取图片像素点
 *
 * @param url URL
 * @returns ImageData
 */
export function getPixels(url: string): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")!

    const image = new Image()
    image.src = url
    image.onload = () => {
      context.drawImage(image, 0, 0)

      //获取像素矩阵
      const data = context.getImageData(0, 0, image.width, image.height)
      resolve(data)

      canvas.remove()
    }

    image.onerror = reject
  })
}
