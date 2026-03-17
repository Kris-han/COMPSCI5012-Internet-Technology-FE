import http from './http'

export function fetchFinishedList(data) {
  return http.post('/dashboard/finished_list', data)
}

export function reopenFinishedTask(data) {
  return http.post('/dashboard/finished_reopen', data)
}

export function deleteFinishedTask(data) {
  return http.post('/dashboard/finished_delete', data)
}