<template>
  <div class="auth-page">
    <div class="reset-container">
      <div class="reset-card">
        <div class="form-header">
          <h2>Reset Password</h2>
          <p>Enter your email and set a new password.</p>
        </div>

        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="top"
          class="auth-form"
        >
          <el-form-item label="Email" prop="email">
            <el-input
              v-model="form.email"
              placeholder="Enter your email"
              size="large"
            />
          </el-form-item>

          <el-form-item label="New Password" prop="newPassword">
            <el-input
              v-model="form.newPassword"
              type="password"
              placeholder="Enter new password"
              size="large"
              show-password
            />
          </el-form-item>

          <el-form-item label="Confirm Password" prop="confirmPassword">
            <el-input
              v-model="form.confirmPassword"
              type="password"
              placeholder="Confirm new password"
              size="large"
              show-password
              @keyup.enter="handleResetPassword"
            />
          </el-form-item>

          <el-button
            type="primary"
            size="large"
            class="submit-btn"
            :loading="loading"
            @click="handleResetPassword"
          >
            Reset Password
          </el-button>
        </el-form>

        <div class="switch-auth">
          <router-link to="/login">Back to Login</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import http from '@/api/http'

const router = useRouter()
const formRef = ref()
const loading = ref(false)

const form = reactive({
  email: '',
  newPassword: '',
  confirmPassword: '',
})

const rules = {
  email: [
    { required: true, message: 'Please enter email', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email', trigger: ['blur', 'change'] },
  ],
  newPassword: [
    { required: true, message: 'Please enter new password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: 'Please confirm password', trigger: 'blur' },
    {
      validator: (_, value, callback) => {
        if (!value) {
          callback(new Error('Please confirm password'))
        } else if (value !== form.newPassword) {
          callback(new Error('The two passwords do not match'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

async function handleResetPassword() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
  } catch {
    return
  }

  loading.value = true

  try {
    const res = await http.post('/user/resetPassword', {
      email: form.email,
      new_password: form.newPassword,
      confirm_password: form.confirmPassword,
    })

    const data = res.data

    if (data.code === 200 || data.code === 0) {
      ElMessage.success(data.message || 'Password reset successfully')
      router.push('/login')
    } else {
      ElMessage.error(data.message || 'Reset password failed')
    }
  } catch (error) {
    console.error('handleResetPassword error:', error)
    ElMessage.error(
      error?.response?.data?.message || 'Reset password failed'
    )
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

.reset-container {
  width: 100%;
  max-width: 560px;
}

.reset-card {
  background: #ffffff;
  border-radius: 28px;
  padding: 40px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.10);
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
  color: #3b82f6;
  text-decoration: none;
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

@media (max-width: 640px) {
  .auth-page {
    padding: 16px;
  }

  .reset-card {
    padding: 24px;
  }
}
</style>