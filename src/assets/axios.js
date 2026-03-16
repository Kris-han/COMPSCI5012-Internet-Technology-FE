import axios from 'axios'

const instance = axios.create({
  baseURL: '/api/auth/',  // 通过代理访问
  timeout: 10000,
})

// 请求拦截器：附加 token
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器：处理 token 过期等
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // 未授权，跳转登录
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default instance