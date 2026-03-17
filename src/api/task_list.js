import http from './http'

export function fetchTaskList(params) {
  return http.post('/dashboard/task_list', {
    params,
  })
}