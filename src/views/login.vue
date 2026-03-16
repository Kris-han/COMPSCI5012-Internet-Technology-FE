<template>
  <div class="auth-container">
    <h2 class="text-center mb-4 fw-bold">Welcome Back</h2>
    
    <!-- 消息提示组件 -->
    <Alert 
      :type="alertType" 
      :message="alertMessage" 
      :show="showAlert"
      @close="showAlert = false"
    />

    <form @submit.prevent="handleLogin">
      <!-- 用户名/邮箱输入框 -->
      <div class="form-group">
        <label for="username" class="form-label fw-medium">Username/Email</label>
        <div class="input-group">
          <span class="input-group-text">
            <i class="bi bi-person-fill"></i>
          </span>
          <input
            type="text"
            class="form-control"
            id="username"
            v-model="credentials.username"
            placeholder="Enter username or email"
            required
            @blur="validateUsername"
          >
        </div>
        <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
      </div>

      <!-- 密码输入框 -->
      <div class="form-group">
        <label for="password" class="form-label fw-medium">Password</label>
        <div class="input-group">
          <span class="input-group-text">
            <i class="bi bi-lock-fill"></i>
          </span>
          <input
            type="password"
            class="form-control"
            id="password"
            v-model="credentials.password"
            placeholder="Enter your password"
            required
            @blur="validatePassword"
          >
        </div>
        <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
      </div>

      <!-- 记住我 + 忘记密码 -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            id="rememberMe"
            v-model="rememberMe"
          >
          <label class="form-check-label" for="rememberMe">
            Remember Me
          </label>
        </div>
        <a href="#" class="text-primary fw-medium">Forgot Password?</a>
      </div>

      <!-- 登录按钮 -->
      <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
        <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Sign In
      </button>
    </form>

    <!-- 无账号？跳注册 -->
    <div class="text-center mt-4">
      <p class="text-muted">Don't have an account? 
        <router-link to="/register" class="text-primary fw-medium">Register here</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '../../assets/js/api'
import Alert from '../common/Alert.vue'

const router = useRouter()

// 表单数据
const credentials = ref({
  username: '',
  password: ''
})

// 状态管理
const isLoading = ref(false)
const showAlert = ref(false)
const alertType = ref('success')
const alertMessage = ref('')
const rememberMe = ref(false)
const errors = ref({})

// 表单验证（前端）
const validateUsername = () => {
  if (!credentials.value.username.trim()) {
    errors.value.username = 'Username or email is required'
  } else {
    errors.value.username = ''
  }
}

const validatePassword = () => {
  if (!credentials.value.password) {
    errors.value.password = 'Password is required'
  } else if (credentials.value.password.length < 8) {
    errors.value.password = 'Password must be at least 8 characters'
  } else {
    errors.value.password = ''
  }
}

// 登录逻辑
const handleLogin = async () => {
  // 先执行前端验证
  validateUsername()
  validatePassword()
  if (Object.keys(errors.value).length > 0) return

  try {
    isLoading.value = true
    // 调用后端登录接口
    const response = await authAPI.login(credentials.value)
    const { token, user } = response.data

    // 存储 Token（若勾选记住我，可延长存储时间）
    if (rememberMe.value) {
      // 记住我：存储 7 天
      const now = new Date()
      now.setTime(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      document.cookie = `token=${token}; expires=${now.toUTCString()}; path=/`
    } else {
      // 不记住：会话存储
      localStorage.setItem('token', token)
    }

    // 登录成功提示 + 跳仪表盘
    showAlert.value = true
    alertType.value = 'success'
    alertMessage.value = `Welcome back, ${user.username}!`
    
    setTimeout(() => {
      router.push('/dashboard')
    }, 1500)
  } catch (error) {
    // 错误处理
    isLoading.value = false
    showAlert.value = true
    alertType.value = 'error'
    alertMessage.value = error.response?.data?.message || 'Invalid username or password'
  }
}
</script>