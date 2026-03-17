<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { addTask, updateTask } from '@/api/task'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String,
    default: 'add',
  },
  taskData: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:visible', 'created', 'updated'])

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
function tsToDateTimeLocal(ts) {
  if (!ts) return ''

  const date = new Date(Number(ts) * 1000)
  const yyyy = date.getFullYear()
  const MM = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')

  return `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}`
}
watch(
  () => [props.visible, props.mode, props.taskData],
  ([visible, mode, taskData]) => {
    if (!visible) return

    if (mode === 'edit' && taskData) {
      form.title = taskData.title || ''
      form.description = taskData.description || ''
      form.priority = taskData.priority ?? 2
      form.status = taskData.status ?? 1
      form.project_id = taskData.project_id ?? ''
      form.start_time = taskData.start_time_ts
        ? tsToDateTimeLocal(taskData.start_time_ts)
        : ''
      form.end_time = taskData.end_time_ts
        ? tsToDateTimeLocal(taskData.end_time_ts)
        : ''

      if (formRef.value) {
        formRef.value.clearValidate()
      }
    } else {
      resetForm()
    }
  },
  { immediate: true }
)
function resetForm() {
  form.title = ''
  form.description = ''
  form.priority = 2
  form.status = 1
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
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status,
        priority: form.priority,
        project_id: form.project_id === '' ? null : Number(form.project_id),
        start_time_ts: startTimeTs,
        end_time_ts: endTimeTs,
      }

      let res

      if (props.mode === 'edit' && props.taskData?.id) {
        res = await updateTask(props.taskData.id, payload)
      } else {
        res = await addTask(payload)
      }

      if (res.code === 200 || (res.data && res.data.code === 200)) {
        ElMessage.success(
          props.mode === 'edit'
            ? 'Task updated successfully'
            : 'Task created successfully'
        )

        dialogVisible.value = false

        if (props.mode === 'edit') {
          emit('updated')
        } else {
          emit('created')
        }

        return
      }

      ElMessage.error(
        res.message ||
        res.data?.message ||
        (props.mode === 'edit' ? 'Update task failed' : 'Create task failed')
      )
    } catch (error) {
      console.error(
        props.mode === 'edit' ? 'Update task failed:' : 'Create task failed:',
        error
      )
      ElMessage.error(props.mode === 'edit' ? 'Update task failed' : 'Create task failed')
    } finally {
      submitting.value = false
    }
  })
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="props.mode === 'edit' ? 'Edit Task' : 'Add Task'"
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

      <el-form-item label="Status" prop="status">
        <el-select v-model="form.status" placeholder="Select status" style="width: 100%">
          <el-option label="To Do" :value="1" />
          <el-option label="In Progress" :value="2" />
          <el-option label="Completed" :value="3" />
          <el-option label="Postponed" :value="4" />
        </el-select>
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
          {{ props.mode === 'edit' ? 'Update' : 'Confirm' }}
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