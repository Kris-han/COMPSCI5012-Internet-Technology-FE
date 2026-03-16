<template>
  <el-container class="login-container">
    <el-card class="login-card">
      <template #header>
        <h2>Login</h2>
      </template>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="Username" prop="username">
          <el-input v-model="form.username" placeholder="Username / Email / Phone"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input v-model="form.password" type="password" placeholder="Password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" :loading="loading">Login</el-button>
          <el-button @click="$router.push('/register')">Register</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </el-container>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from '@/utils/axios'

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)

const form = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: 'Please input username/email/phone', trigger: 'blur' }],
  password: [{ required: true, message: 'Please input password', trigger: 'blur' }]
}

const handleLogin = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      const res = await axios.post('login/', form)
      const { access, refresh, user } = res.data
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)
      localStorage.setItem('user', JSON.stringify(user))
      ElMessage.success('Login successful')
      router.push('/dashboard')
    } catch (error) {
      const msg = error.response?.data?.detail || 'Login failed'
      ElMessage.error(msg)
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}
.login-card {
  width: 400px;
}
</style>