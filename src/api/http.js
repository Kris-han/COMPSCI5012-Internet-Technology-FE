import axios from 'axios'

// 创建 axios 实例
const api = axios.create({
  baseURL: '/api', // 对应 Vite 代理配置
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器：添加认证 Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 认证相关 API
export const authAPI = {
  // 注册
  register: (userData) => api.post('/accounts/register/', userData),
  // 登录
  login: (credentials) => api.post('/accounts/login/', credentials),
  // 登出（前端仅清除 Token，后端可扩展）
  logout: () => localStorage.removeItem('token')
}

export default api