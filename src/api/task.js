import http from './http'

// POST
export function addTask(data) {
  return http.post('/task/add_task', data)
}

// PUT
export function updateTask(id, data) {
  return http.put(`/task/task_detail/${id}`, data)
}

// DELETE
export function deleteTask(id) {
  return http.delete(`/task/task_detail/${id}`)
}

// get
export function getTask(id) {
  return http.get(`/task/task_detail/${id}`)
}

// GET
export function getTaskList(params = {}) {
  return http.get('/task/task_list', { params })
}

export function getUserList() {
  return http.get('/user/list')
}