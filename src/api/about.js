import http from './http'

// 示例：GET /api/about
export function fetchAboutData() {
  return http.get('/api/about')
}