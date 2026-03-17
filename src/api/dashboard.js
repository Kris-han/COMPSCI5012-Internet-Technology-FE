import http from './http'

export function fetchDashboardData(uid) {
  return http.get('/dashboard/dashboard_list', {
    params: {
      uid,
    },
  })
}

export function fetchTodayCount(data = {}) {
  return http.post('/dashboard/today_count', data)
}