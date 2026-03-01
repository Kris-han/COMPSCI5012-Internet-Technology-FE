import axios from 'axios'

// 建议：Vite 用 import.meta.env 读取环境变量
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 10000,
  withCredentials: false, // 如果你后端用 cookie/session 再改 true
})

// 可选：统一拦截器（请求/响应/错误）
http.interceptors.response.use(
  (res) => res,
  (err) => {
    // 这里不要直接 alert，交给页面处理更灵活
    return Promise.reject(err)
  }
)

export default http