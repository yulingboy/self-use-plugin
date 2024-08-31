import axios from "axios"

// https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1
const instance = axios.create({
  // baseURL: "https://cn.bing.com/",
  timeout: 5000
})

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default instance
