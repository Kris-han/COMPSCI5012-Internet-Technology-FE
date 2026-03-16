<template>
  <el-container class="register-container">
    <el-card class="register-card">
      <template #header>
        <h2>Register</h2>
      </template>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="Username" prop="username">
          <el-input v-model="form.username" placeholder="Username"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" placeholder="Email"></el-input>
        </el-form-item>
        <el-form-item label="Phone" prop="phone_number">
          <el-input v-model="form.phone_number" placeholder="Phone (optional)"></el-input>
        </el-form-item>
        <el-form-item label="Nickname" prop="nickname">
          <el-input v-model="form.nickname" placeholder="Nickname (optional)"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input v-model="form.password" type="password" placeholder="Password"></el-input>
        </el-form-item>
        <el-form-item label="Confirm" prop="password2">
          <el-input v-model="form.password2" type="password" placeholder="Confirm password"></el-input>
        </el-form-item>
        <el-form-item label="Gender" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio :label="0">Secret</el-radio>
            <el-radio :label="1">Male</el-radio>
            <el-radio :label="2">Female</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Avatar" prop="avatar">
          <el-upload
            class="avatar-uploader"
            action="#"
            :auto-upload="false"
            :on-change="handleAvatarChange"
            :show-file-list="false"
          >
            <img v-if="form.avatar" :src="avatarPreview" class="avatar" />
            <el-icon v-else><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleRegister" :loading="loading">Register</el-button>
          <el-button @click="$router.push('/login')">Back to Login</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </el-container>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import axios from '@/utils/axios'

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)
const avatarFile = ref(null)

const form = reactive({
  username: '',
  email: '',
  phone_number: '',
  nickname: '',
  password: '',
  password2: '',
  gender: 0,
  avatar: null
})

const avatarPreview = computed(() => {
  return form.avatar ? URL.createObjectURL(form.avatar) : ''
})

const handleAvatarChange = (file) => {
  form.avatar = file.raw
  avatarFile.value = file.raw
}

const rules = {
  username: [{ required: true, message: 'Please input username', trigger: 'blur' }],
  email: [
    { required: true, message: 'Please input email', trigger: 'blur' },
    { type: 'email', message: 'Invalid email format', trigger: 'blur' }
  ],
  phone_number: [
    { pattern: /^1[3-9]\d{9}$/, message: 'Invalid phone number', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please input password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
  ],
  password2: [
    { required: true, message: 'Please confirm password', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== form.password) {
          callback(new Error('Passwords do not match'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const handleRegister = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    const formData = new FormData()
    Object.keys(form).forEach(key => {
      if (key === 'avatar' && form.avatar) {
        formData.append('avatar', form.avatar)
      } else if (form[key] !== null && form[key] !== '') {
        formData.append(key, form[key])
      }
    })
    try {
      const res = await axios.post('register/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      ElMessage.success('Registration successful, please login')
      router.push('/login')
    } catch (error) {
      const errors = error.response?.data
      let msg = 'Registration failed'
      if (errors) {
        msg = Object.values(errors).flat().join('; ')
      }
      ElMessage.error(msg)
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
.register-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}
.register-card {
  width: 500px;
}
.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-uploader:hover {
  border-color: #409eff;
}
.avatar {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
</style>