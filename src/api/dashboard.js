import http from './http'

export function fetchDashboardData() {
  return http.get('/dashboard/dashboard_list', {
    params: {},})
}

export function fetchTodayCount(data = {}) {
  return http.post('/dashboard/today_count', data)
}