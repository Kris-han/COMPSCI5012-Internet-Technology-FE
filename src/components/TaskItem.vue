<template>
  <div class="task-item">
    <div class="task-item__left">
      <el-tag :type="priorityType" size="small">{{ priorityLabel }}</el-tag>
      <span class="task-item__title">{{ task.title }}</span>
      <span v-if="task.owner" class="task-item__owner">@{{ task.owner }}</span>
      <span v-if="task.description" class="task-item__desc">{{ task.description }}</span>
    </div>

    <div class="task-item__right">
      <span v-if="task.due_date" class="task-item__date">{{ formatDate(task.due_date) }}</span>
      <el-button size="small" :icon="Edit" circle @click="onEdit" />
      <el-button size="small" :icon="Delete" circle type="danger" @click="onDelete" />
    </div>
  </div>

<!-- Edit Dialog -->
  <el-dialog v-model="editVisible" title="Edit Task" width="50%" :show-close="false" @close="resetEdit">
    <el-form :model="editForm" :rules="rules" ref="editFormRef" label-width="80px">
      <el-form-item label="Title" prop="title">
        <el-input v-model="editForm.title" />
      </el-form-item>

      <el-form-item label="Description">
        <el-input v-model="editForm.description" type="textarea" :rows="3" />
      </el-form-item>

      <el-form-item label="Priority">
        <el-select v-model="editForm.priority">
          <el-option label="Low" :value="1" />
          <el-option label="Medium" :value="2" />
          <el-option label="High" :value="3" />
        </el-select>
      </el-form-item>

      <el-form-item label="Executor">
        <el-select v-model="editForm.executor_id" placeholder="Optional" clearable>
          <el-option v-for="u in userOptions" :key="u.id" :label="u.username" :value="u.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="Status">
        <el-select v-model="editForm.status">
          <el-option label="To Do" :value="1" />
          <el-option label="In Progress" :value="2" />
          <el-option label="Completed" :value="3" />
          <el-option label="Postponed" :value="4" />
        </el-select>
      </el-form-item>

      <el-form-item label="Due Date">
        <el-date-picker v-model="editForm.due_date" type="datetime" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button type="primary" :loading="loading" @click="submitEdit">Save</el-button>
      <el-button @click="editVisible = false">Cancel</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { updateTask, deleteTask, getUserList } from '../api/task'

const props = defineProps<{ task: any }>()
const emit = defineEmits<{
  (e: 'updated'): void
  (e: 'deleted'): void
}>()

// priority mapping
const priorityMap = { 1: 'Low', 2: 'Medium', 3: 'High' }
const priorityColorMap = { 1: 'info', 2: 'warning', 3: 'danger' }
const priorityLabel = computed(() => priorityMap[props.task.priority] ?? 'Medium')
const priorityType = computed(() => priorityColorMap[props.task.priority] ?? 'warning')

// date formatting
function formatDate(val: string) {
  return new Date(val).toLocaleDateString()
}

// delete
async function onDelete() {
  await ElMessageBox.confirm('确定删除这个任务吗？', '提示', { type: 'warning' })
  const res = await deleteTask(props.task.id)
  if (res.data.success) {
    ElMessage.success('已删除')
    emit('deleted')
  }
}

// edit
const editVisible = ref(false)
const loading = ref(false)
const editFormRef = ref()
const userOptions = ref([])

const editForm = reactive({
  title: '',
  description: '',
  priority: 2,
  executor_id: null as number | null,
  status: 1,
  due_date: null as string | null,
})

onMounted(async () => {
  const res = await getUserList()
  userOptions.value = res.data.data
})

const rules = {
  title: [{ required: true, message: 'Please enter the task title', trigger: 'blur' }],
}

function onEdit() {
  editForm.title = props.task.title
  editForm.description = props.task.description ?? ''
  editForm.priority = props.task.priority
  editForm.executor_id = props.task.executor_id ?? null
  editForm.status = props.task.status
  editForm.due_date = props.task.due_date ?? null
  editVisible.value = true
}

async function submitEdit() {
  await editFormRef.value.validate()
  loading.value = true
  try {
    const payload = {
      ...editForm,
      due_date: editForm.due_date ? new Date(editForm.due_date).toISOString() : null,
    }
    const res = await updateTask(props.task.id, payload)
    if (res.data.success) {
      ElMessage.success('已更新')
      editVisible.value = false
      emit('updated')
    } else {
      ElMessage.error(res.data.message || '更新失败')
    }
  } finally {
    loading.value = false
  }
}

function resetEdit() {
  editFormRef.value?.resetFields()
  editForm.due_date = null
}
</script>

<style scoped>
.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.task-item__left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.task-item__title {
  font-size: 14px;
  font-weight: 500;
}

.task-item__owner {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.task-item__desc {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.task-item__right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.task-item__date {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
</style>