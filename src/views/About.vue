<template>
  <div style="padding: 16px;">
    <h2>About Page</h2>

    <el-alert
      v-if="errorMsg"
      :title="errorMsg"
      type="error"
      show-icon
      style="margin-bottom: 12px;"
    />

    <el-skeleton v-if="loading" :rows="4" animated />

    <el-card v-else>
      <div><b>title:</b> {{ about?.title }}</div>
      <div><b>description:</b> {{ about?.description }}</div>

      <el-divider />

      <el-button type="primary" @click="loadAbout">Refresh</el-button>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchAboutData } from '@/api/about' // 你也可以用相对路径 ../api/about

const loading = ref(false)
const errorMsg = ref('')
const about = ref(null)

async function loadAbout() {
  loading.value = true
  errorMsg.value = ''

  try {
    const res = await fetchAboutData()
    // 假设后端返回 JSON：{ title: "...", description: "..." }
    about.value = res.data
    ElMessage.success('Loaded!')
  } catch (err) {
    // 常见错误信息处理
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.detail ||
      err?.message ||
      'Request failed'
    errorMsg.value = msg
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadAbout()
})
</script>