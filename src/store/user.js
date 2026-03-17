import { defineStore } from 'pinia'
import { getUserInfo, setUserInfo, clearAuth } from '@/utils/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: getUserInfo() || null,
  }),

  getters: {
    uid: (state) => Number(state.userInfo?.id || 0),
    username: (state) => state.userInfo?.username || '',
    email: (state) => state.userInfo?.email || '',
  },

  actions: {
    setUser(userInfo) {
      this.userInfo = userInfo || null
      setUserInfo(userInfo || {})
    },

    logout() {
      this.userInfo = null
      clearAuth()
    },
  },
})