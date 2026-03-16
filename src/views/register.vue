<template>
  <div class="auth-container">
    <h2 class="text-center mb-4 fw-bold">Create Your Account</h2>
    
    <!-- 消息提示组件 -->
    <Alert 
      :type="alertType" 
      :message="alertMessage" 
      :show="showAlert"
      @close="showAlert = false"
    />

    <form @submit.prevent="handleRegister" enctype="multipart/form-data">
      <!-- 用户名 -->
      <div class="form-group">
        <label for="username" class="form-label fw-medium">Username</label>
        <div class="input-group">
          <span class="input-group-text">
            <i class="bi bi-person-fill"></i>
          </span>
          <input
            type="text"
            class="form-control"
            id="username"
            v-model="userData.username"
            placeholder="Enter your username"
            required
            @blur="validateField('username')"
          >
        </div>
        <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
      </div>

      <!-- 邮箱 -->
      <div class="form-group">
        <label for="email" class="form-label fw-medium">Email</label>
        <div class="input-group">
          <span class="input-group-text">
            <i class="bi bi-envelope-fill"></i>
          </span>
          <input
            type="email"
            class="form-control"
            id="email"
            v-model="userData.email"
            placeholder="Enter your email"
            required
            @blur="validateField('email')"
          >
        </div>
        <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
      </div>

      <!-- 昵称 -->
      <div class="form-group">
        <label for="nickname" class="form-label fw-medium">Nickname (Optional)</label>
        <div class="input-group">
          <span class="input-group-text">
            <i class="bi bi-emoji-smile-fill"></i>
          </span>
          <input
            type="text"
            class="form-control"
            id="nickname"
            v-model="userData.nickname"
            placeholder="Enter your nickname"
          >
        </div>
      </div>

      <!-- 密码 -->
      <div class="form-group">
        <label for="password1" class="form-label fw-medium">Password</label>
        <div class="input-group">
          <span class="input-group-text">
            <i class="bi bi-lock-fill"></i>
          </span>
          <input
            type="password"
            class="form-control"
            id="password1"
            v-model="userData.password1"
            placeholder="Enter your password"
            required
            @blur="validateField('password1')"
          >
        </div>
        <div class="form-text text-muted">
          Must be at least 8 characters, no common sequences.
        </div>
        <div v-if="errors.password1" class="text-danger">{{ errors.password1 }}</div>
      </div>

      <!-- 确认密码 -->
      <div class="form-group">
        <label for="password2" class="form-label fw-medium">Confirm Password</label>
        <div class="input-group">
          <span class="input-group-text">
            <i class="bi bi-lock-real-fill"></i>
          </span>
          <input
            type="password"
            class="form-control"
            id="password2"
            v-model="userData.password2"
            placeholder="Confirm your password"
            required
            @blur="validateField('password2')"
          >
        </div>
        <div v-if="errors.password2" class="text-danger">{{ errors.password2 }}</div>
      </div>

      <!-- 头像上传（可选） -->
      <div class="form-group">
        <label for="avatar" class="form-label fw-medium">Avatar (Optional)</label>
        <input
          type="file"
          class="form-control"
          id="avatar"
          accept="image/*"
          @change="handleAvatarUpload"
        >
        <div v-if="errors.avatar" class="text-danger">{{ errors.avatar }}</div>
      </div>

      <!-- 注册按钮 -->
      <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
        <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Register
      </button>
    </form>

    <!-- 已有账号？跳登录 -->
    <div class="text-center mt-4">
      <p class="text-muted">Already have an account? 
        <router-link to="/login" class="text-primary fw-medium">Login here</router-link>
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
const userData = ref({
  username: '',
  email: '',
  nickname: '',
  password1: '',
  password2: '',
  avatar: null // 存储头像文件
})

// 状态管理
const isLoading = ref(false)
const showAlert = ref(false)
const alertType = ref('success')
const alertMessage = ref('')
const errors = ref({})

// 头像上传处理
const handleAvatarUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    // 验证文件大小（最大 5MB）
    if (file.size > 5 * 1024 * 1024) {
      errors.value.avatar = 'Avatar size cannot exceed 5MB'
      userData.value.avatar = null
    } else {
      errors.value.avatar = ''
      userData.value.avatar = file
    }
  }
}

// 表单字段验证
const validateField = (field) => {
  switch (field) {
    case 'username':
      if (!userData.value.username.trim()) {
        errors.value.username = 'Username is required'
      } else if (userData.value.username.length < 3) {
        errors.value.username = 'Username must be at least 3 characters'
      } else {
        errors.value.username = ''
      }
      break
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!userData.value.email.trim()) {
        errors.value.email = 'Email is required'
      } else if (!emailRegex.test(userData.value.email)) {
        errors.value.email = 'Please enter a valid email'
      } else {
        errors.value.email = ''
      }
      break
    case 'password1':
      if (!userData.value.password1) {
        errors.value.password1 = 'Password is required'
      } else if (userData.value.password1.length < 8) {
        errors.value.password1 = 'Password must be at least 8 characters'
      } else {
        errors.value.password1 = ''
      }
      break
    case 'password2':
      if (!userData.value.password2) {
        errors.value.password2 = 'Please confirm your password'
      } else if (userData.value.password2 !== userData.value.password1) {
        errors.value.password2 = 'Passwords do not match'
      } else {
        errors.value.password2 = ''
      }
      break
  }
}

// 注册逻辑
const handleRegister = async () => {
  // 前端全字段验证
  Object.keys(userData.value).forEach(field => {
    if (field !== 'nickname' && field !== 'avatar') {
      validateField(field)
    }
  })
  if (Object.keys(errors.value).length > 0) return

  try {
    isLoading.value = true
    // 构建 FormData（支持文件上传）
    const formData = new FormData()
    formData.append('username', userData.value.username)
    formData.append('email', userData.value.email)
    formData.append('nickname', userData.value.nickname || '')
    formData.append('password1', userData.value.password1)
    formData.append('password2', userData.value.password2)
    if (userData.value.avatar) {
      formData.append('avatar', userData.value.avatar)
    }

    // 调用后端注册接口
    const response = await authAPI.register(formData)
    const { token, user } = response.data

    // 存储 Token 并跳转登录页
    localStorage.setItem('token', token)
    showAlert.value = true
    alertType.value = 'success'
    alertMessage.value = `Registration successful! Welcome, ${user.username}!`

    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error) {
    // 错误处理（后端返回的字段错误）
    isLoading.value = false
    showAlert.value = true
    alertType.value = 'error'
    
    if (error.response?.data?.errors) {
      // 后端返回的字段级错误
      errors.value = error.response.data.errors
      alertMessage.value = 'Registration failed. Please check the form.'
    } else {
      alertMessage.value = error.response?.data?.message || 'Registration failed. Please try again.'
    }
  }
}
</script>