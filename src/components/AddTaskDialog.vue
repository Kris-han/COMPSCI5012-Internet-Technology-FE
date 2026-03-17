<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { addTask } from '@/api/task'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:visible', 'created'])

const submitting = ref(false)

const formRef = ref()

const form = reactive({
  title: '',
  description: '',
  priority: 2,
  project_id: '',
  start_time: '',
  end_time: '',
})

const rules = {
  title: [
    { required: true, message: 'Please input task title', trigger: 'blur' },
  ],
  start_time: [
    { required: true, message: 'Please select start time', trigger: 'change' },
  ],
  end_time: [
    { required: true, message: 'Please select end time', trigger: 'change' },
  ],
}

const dialogVisible = computed({
  get() {
    return props.visible
  },
  set(value) {
    emit('update:visible', value)
  },
})

watch(
  () => props.visible,
  (value) => {
    if (value) {
      resetForm()
    }
  }
)

function resetForm() {
  form.title = ''
  form.description = ''
  form.priority = 2
  form.project_id = ''
  form.start_time = ''
  form.end_time = ''

  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

function toTimestamp(value) {
  if (!value) return null

  if (typeof value === 'string' || value instanceof Date) {
    return Math.floor(new Date(value).getTime() / 1000)
  }

  return null
}

function handleClose() {
  dialogVisible.value = false
}

async function handleConfirm() {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    const startTimeTs = toTimestamp(form.start_time)
    const endTimeTs = toTimestamp(form.end_time)

    if (!startTimeTs || !endTimeTs) {
      ElMessage.error('Start time or end time is invalid')
      return
    }

    if (endTimeTs <= startTimeTs) {
      ElMessage.error('End time must be later than start time')
      return
    }

    submitting.value = true
    try {
      const payload = {
        uid: 1001, // 后面改成从登录态获取
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        project_id: form.project_id === '' ? null : Number(form.project_id),
        start_time_ts: startTimeTs,
        end_time_ts: endTimeTs,
      }

      const res = await addTask(payload)

      if (res.code === 200) {
        ElMessage.success('Task created successfully')
        dialogVisible.value = false
        emit('created')
        return
      }

      if (res.data && res.data.code === 200) {
        ElMessage.success('Task created successfully')
        dialogVisible.value = false
        emit('created')
        return
      }

      ElMessage.error(res.message || res.data?.message || 'Create task failed')
    } catch (error) {
      console.error('Create task failed:', error)
      ElMessage.error('Create task failed')
    } finally {
      submitting.value = false
    }
  })
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="Add Task"
    width="760px"
    destroy-on-close
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="110px"
    >
      <el-form-item label="Title" prop="title" required>
        <el-input
          v-model="form.title"
          placeholder="Task Title"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="Description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="4"
          placeholder="Optional"
        />
      </el-form-item>

      <el-form-item label="Priority">
        <el-select v-model="form.priority" style="width: 100%">
          <el-option label="Low" :value="1" />
          <el-option label="Medium" :value="2" />
          <el-option label="High" :value="3" />
        </el-select>
      </el-form-item>

      <el-form-item label="Project ID">
        <el-input
          v-model="form.project_id"
          placeholder="Optional"
        />
      </el-form-item>

      <el-form-item label="Start Time" prop="start_time" required>
        <el-date-picker
          v-model="form.start_time"
          type="datetime"
          placeholder="Select start time"
          style="width: 100%"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DDTHH:mm:ss"
        />
      </el-form-item>

      <el-form-item label="End Time" prop="end_time" required>
        <el-date-picker
          v-model="form.end_time"
          type="datetime"
          placeholder="Select end time"
          style="width: 100%"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DDTHH:mm:ss"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button
          type="primary"
          :loading="submitting"
          @click="handleConfirm"
        >
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>