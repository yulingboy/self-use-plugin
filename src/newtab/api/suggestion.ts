import axios from "@newtab/utils/request"

// 通用的错误处理函数，接受一个返回 Promise<string[]> 的回调函数
async function handleRequest(callback: () => Promise<string[]>): Promise<string[]> {
  try {
    return await callback()
  } catch (error) {
    return []
  }
}

// 获取百度搜索建议
export async function getBaiduSuggestion(keyword: string): Promise<string[]> {
  return handleRequest(async () => {
    const { data } = await axios.get<string>("https://suggestion.baidu.com/su", {
      params: {
        p: 3, // 百度搜索建议的固定参数
        ie: "UTF-8", // 字符编码
        cb: "", // jsonp 回调，设置为空
        wd: keyword // 用户输入的关键字
      },
      responseType: "text" // 明确设置返回类型为文本
    })
    const match = /.*?s:(\[.*?\]).*?/
    const jsonText = match.exec(data)![1] ?? "[]"
    return JSON.parse(jsonText)
  })
}

// 获取必应搜索建议
export async function getBingSuggestion(keyword: string): Promise<string[]> {
  return handleRequest(async () => {
    const { data } = await axios.get<{ AS: { Results: { Suggests: { Txt: string }[] }[] } }>("https://api.bing.com/qsonhs.aspx", {
      params: {
        type: "json", // 请求返回 JSON 格式的数据
        q: keyword // 用户输入的关键字
      }
    })

    // 提取建议数组
    return data.AS.Results[0].Suggests.map((item) => item.Txt)
  })
}

// 获取谷歌搜索建议
export async function getGoogleSuggestion(keyword: string): Promise<string[]> {
  return handleRequest(async () => {
    const { data } = await axios.get<string>("https://suggestqueries.google.com/complete/search", {
      params: {
        client: "gws-wiz", // 固定客户端参数
        q: keyword, // 用户输入的关键字
        jsonp: "" // 禁用 JSONP 回调
      },
      responseType: "text" // 明确设置返回类型为文本
    })

    // 使用正则表达式提取搜索建议
    const suggestions: string[] = []
    const regex = /\["(.*?)"/g
    let match: RegExpExecArray | null
    while ((match = regex.exec(data)) !== null) {
      suggestions.push(match[1])
    }
    return suggestions
  })
}
