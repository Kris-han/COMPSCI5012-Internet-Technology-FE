<template>
  <main class="auth-page">
    <div class="auth-container">
      <div class="auth-left">
        <div class="brand-block">
          <div class="brand-logo">T</div>
          <h1 class="brand-title">ToDo List</h1>
          <p class="brand-desc">
            Create your account to start planning tasks, tracking progress, and improving productivity.
          </p>

          <div class="brand-card">
            <h2>Create your workspace</h2>
            <p>
              Register a new account and begin building a cleaner, more organized workflow for your daily tasks.
            </p>
          </div>
        </div>
      </div>

      <div class="auth-right">
        <div class="form-card">
          <div class="form-header">
            <h2>Register</h2>
            <p>Create a new account to get started.</p>
          </div>

          <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-position="top"
            class="auth-form"
          >
            <el-form-item label="Username" prop="username">
              <el-input
                v-model="form.username"
                placeholder="Enter your username"
                size="large"
              />
            </el-form-item>

            <el-form-item label="Email" prop="email">
              <el-input
                v-model="form.email"
                placeholder="Enter your email"
                size="large"
              />
            </el-form-item>

            <el-form-item label="Password" prop="password">
              <el-input
                v-model="form.password"
                type="password"
                placeholder="Enter your password"
                size="large"
                show-password
              />
            </el-form-item>

            <el-form-item label="Confirm Password" prop="confirmPassword">
              <el-input
                v-model="form.confirmPassword"
                type="password"
                placeholder="Confirm your password"
                size="large"
                show-password
                @keyup.enter="handleRegister"
              />
            </el-form-item>

            <el-button
              type="primary"
              size="large"
              class="submit-btn"
              :loading="loading"
              @click="handleRegister"
            >
              Register
            </el-button>
          </el-form>

          <div class="switch-auth">
            Already have an account?
            <router-link to="/login">Login</router-link>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { register } from '@/api/auth'
import { setToken, setUserInfo } from '@/utils/auth'

const router = useRouter()
const formRef = ref()
const loading = ref(false)

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const validateConfirmPassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('Please confirm your password'))
    return
  }

  if (value !== form.password) {
    callback(new Error('Passwords do not match'))
    return
  }

  callback()
}

const rules = {
  username: [
    { required: true, message: 'Please enter username', trigger: 'blur' },
    { min: 2, max: 20, message: 'Username length must be 2-20 characters', trigger: 'blur' },
  ],
  email: [
    { required: true, message: 'Please enter email', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email', trigger: ['blur', 'change'] },
  ],
  password: [
    { required: true, message: 'Please enter password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' },
  ],
  confirmPassword: [
    { validator: validateConfirmPassword, trigger: ['blur', 'change'] },
  ],
}

async function handleRegister() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
  } catch {
    return
  }

  loading.value = true

  try {
    const res = await register({
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
    })

    const success = res?.data?.success
    const token = res?.data?.data?.token || ''
    const userInfo = res?.data?.data?.user_info || null
    const message = res?.data?.message || 'Register successful'

    if (!success) {
      ElMessage.error(res?.data?.message || 'Register failed')
      return
    }

    if (token) {
      setToken(token)
      setUserInfo(userInfo)
      ElMessage.success(message)
      router.push('/')
      return
    }

    ElMessage.success(message)
    router.push('/login')
  } catch (error) {
    console.error('handleRegister error:', error)
    ElMessage.error('Register failed')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f7f8fc 0%, #eef3ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  box-sizing: border-box;
}

.auth-container {
  width: 100%;
  max-width: 1180px;
  min-height: 700px;
  background: #ffffff;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.10);
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
}

.auth-left {
  background: linear-gradient(160deg, #eaf1ff 0%, #f7f9ff 100%);
  padding: 56px;
  display: flex;
  align-items: center;
}

.brand-block {
  max-width: 460px;
}

.brand-logo {
  width: 58px;
  height: 58px;
  border-radius: 18px;
  background: #1d4ed8;
  color: #ffffff;
  font-size: 28px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.brand-title {
  margin: 0 0 16px;
  font-size: 40px;
  font-weight: 800;
  color: #111827;
}

.brand-desc {
  margin: 0 0 28px;
  font-size: 17px;
  line-height: 1.8;
  color: #4b5563;
}

.brand-card {
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid #dbe7ff;
  border-radius: 22px;
  padding: 24px;
  backdrop-filter: blur(6px);
}

.brand-card h2 {
  margin: 0 0 10px;
  font-size: 20px;
  color: #111827;
}

.brand-card p {
  margin: 0;
  color: #6b7280;
  line-height: 1.7;
}

.auth-right {
  padding: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-card {
  width: 100%;
  max-width: 420px;
}

.form-header {
  margin-bottom: 28px;
}

.form-header h2 {
  margin: 0 0 10px;
  font-size: 34px;
  font-weight: 800;
  color: #111827;
}

.form-header p {
  margin: 0;
  color: #6b7280;
  line-height: 1.7;
}

.auth-form {
  width: 100%;
}

.submit-btn {
  width: 100%;
  height: 46px;
  border-radius: 12px;
  font-weight: 600;
  margin-top: 8px;
}

.switch-auth {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #6b7280;
}

.switch-auth a {
  color: #1d4ed8;
  text-decoration: none;
  margin-left: 6px;
  font-weight: 600;
}

:deep(.el-input__wrapper) {
  min-height: 46px;
  border-radius: 12px;
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: #374151;
}

@media (max-width: 960px) {
  .auth-container {
    grid-template-columns: 1fr;
  }

  .auth-left {
    display: none;
  }

  .auth-right {
    padding: 36px 24px;
  }

  .auth-page {
    padding: 16px;
  }
}
</style>