<template>
  <el-dialog v-model="visible" title="Add Task" width="50%" @close="resetForm">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
      <el-form-item label="Title" prop="title">
        <el-input v-model="form.title" placeholder="Task Title" />
      </el-form-item>

      <el-form-item label="Description">
        <el-input v-model="form.description" type="textarea" :rows="3" placeholder="Optional" />
      </el-form-item>

      <el-form-item label="Priority">
        <el-select v-model="form.priority">
          <el-option label="Low" :value="1" />
          <el-option label="Medium" :value="2" />
          <el-option label="High" :value="3" />
        </el-select>
      </el-form-item>

      <el-form-item label="Due Date">
        <el-date-picker v-model="form.due_date" type="datetime" placeholder="Optional" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">Cancel</el-button>
      <el-button type="primary" :loading="loading" @click="submit">Confirm</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { addTask } from '../api/task'

const visible = defineModel<boolean>('visible', { default: false })
const emit = defineEmits<{ (e: 'created'): void }>()

const formRef = ref()
const loading = ref(false)

const form = reactive({
  title: '',
  description: '',
  priority: 2,
  due_date: null,
})

const rules = {
  title: [{ required: true, message: 'Please enter the task title', trigger: 'blur' }],
}

async function submit() {
  await formRef.value.validate()
  loading.value = true
  try {
    const payload = {
      ...form,
      due_date: form.due_date ? new Date(form.due_date).toISOString() : null,
    }
    const res = await addTask(payload)
    if (res.data.success) {
      ElMessage.success('Task created successfully')
      visible.value = false
      emit('created')
    } else {
      ElMessage.error(res.data.message || 'Failed to create task')
    }
  } finally {
    loading.value = false
  }
}

function resetForm() {
  formRef.value?.resetFields()
  form.due_date = null
}
</script>