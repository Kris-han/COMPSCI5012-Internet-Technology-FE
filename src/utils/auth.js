const TOKEN_KEY = 'taskflow_token'
const USER_INFO_KEY = 'taskflow_user_info'

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token || '')
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function setUserInfo(userInfo) {
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo || {}))
}

export function getUserInfo() {
  const raw = localStorage.getItem(USER_INFO_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch (error) {
    return null
  }
}

export function removeUserInfo() {
  localStorage.removeItem(USER_INFO_KEY)
}

export function clearAuth() {
  removeToken()
  removeUserInfo()
}