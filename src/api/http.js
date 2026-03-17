import axios from 'axios'
import { getToken, clearAuth } from '@/utils/auth'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  withCredentials: false,
})

// 请求拦截器：自动带 token
http.interceptors.request.use(
  (config) => {
    const token = getToken()

    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

// 响应拦截器：统一处理 401
http.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status || err?.response?.data?.code

    if (status === 401) {
      clearAuth()

      const currentPath = window.location.pathname
      if (currentPath !== '/login') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(err)
  }
)

export default http