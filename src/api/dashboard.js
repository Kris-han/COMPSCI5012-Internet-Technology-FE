import http from './http'

export function fetchDashboardData(uid) {
  return http.get('/dashboard/dashboard_list', {
    params: {
      uid,
    },
  })
}