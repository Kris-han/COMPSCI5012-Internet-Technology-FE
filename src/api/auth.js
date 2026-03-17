import http from './http'

// POST
export function login(data) {
  return http.post('/user/login', data)
}
// POST
export function register(data) {
  return http.post('/user/register', data)
}


// POST
export function logout(data) {
  return http.post('/user/logout', data)
}

