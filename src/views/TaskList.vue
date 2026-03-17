<script setup lang="ts">
import {
  Search,
  MoreFilled,
  ArrowLeft,
  ArrowRight,
} from '@element-plus/icons-vue'
import {ref, computed, onMounted, watch, reactive} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetchTaskList } from '@/api/task_list'
import { addTask, updateTask, getTask, deleteTask,searchTask } from '@/api/task'

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)

const tasks = ref([])
const props = defineProps<{
  searchKeyword?: string
}>()

const emit = defineEmits<{
  (e: 'update:searchKeyword', v: string): void
}>()
const statusOptions = [
  { label: 'To Do', value: 1 },
  { label: 'In Progress', value: 2 },
  { label: 'Completed', value: 3 },
  { label: 'Postponed', value: 4 },
]
const dialogVisible = ref(false)
const dialogMode = ref('add') // add / edit
const currentTaskId = ref(null)

const form = reactive({
  title: '',
  description: '',
  status: 1,
  priority: 2,
  start_time: '',
  end_time: '',
  project_id: '',
})

function resetForm() {
  form.title = ''
  form.description = ''
  form.status = 1
  form.priority = 2
  form.start_time = ''
  form.end_time = ''
  form.project_id = ''
}
function tsToDateTimeLocal(ts) {
  if (!ts) return ''
  const date = new Date(Number(ts) * 1000)
  const yyyy = date.getFullYear()
  const MM = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}`
}
function handleTaskSearch(value: string) {
  emit('update:searchKeyword', value)
}
function dateTimeLocalToTs(value) {
  if (!value) return null
  return Math.floor(new Date(value).getTime() / 1000)
}

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(total.value / pageSize.value))
})

const visiblePages = computed(() => {
  const totalPageCount = totalPages.value
  const page = currentPage.value

  let start = Math.max(1, page - 2)
  let end = Math.min(totalPageCount, start + 4)

  if (end - start < 4) {
    start = Math.max(1, end - 4)
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

const displayTasks = computed(() => {
  return tasks.value.map((task) => ({
    ...task,
    name: task.title || '',
    project: task.project_name || 'project',
    start: task.start_time_text || '',
    end: task.end_time_text || '',
  }))
})

function getPriorityColor(priority) {
  if (priority === 3 || priority === 'High') return '#EF4444'
  if (priority === 2 || priority === 'Medium') return '#F59E0B'
  return '#22C55E'
}

async function loadTaskList() {
  loading.value = true
  try {
    const res = await fetchTaskList({
      page: currentPage.value,
      page_size: pageSize.value,
      keyword: (props.searchKeyword || '').trim(),
    })

    if (res.data && res.data.code === 200) {
      tasks.value = res.data.data.list || []
      total.value = res.data.data.total || 0
      currentPage.value = res.data.data.page || 1
      pageSize.value = res.data.data.page_size || 12
    }
  } catch (error) {
    console.error('Failed to fetch task list:', error)
    ElMessage({
      message: 'Failed to load task list',
      type: 'error',
    })
  } finally {
    loading.value = false
  }
}

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  loadTaskList()
}

function handleSearch(value: string) {
  emit('update:searchKeyword', value)
  currentPage.value = 1
  loadTaskList()
}

async function handleStatusChange(task, newStatus) {
  const oldStatus = task.status

  try {
    task.status = newStatus

    await updateTask(task.id, {
      status: newStatus,
    })

    ElMessage({
      message: 'Task status updated successfully',
      type: 'success',
    })
    loadTaskList()
  } catch (error) {
    task.status = oldStatus

    ElMessage({
      message: 'Failed to update task status',
      type: 'error',
    })

    console.error('Failed to update task status:', error)
  }
}

async function handleCommand(command, task) {
  if (command === 'edit') {
    await openEditDialog(task)
    return
  }

  if (command === 'delete') {
    try {
      await ElMessageBox.confirm(
        `Are you sure you want to delete "${task.name}"?`,
        'Delete Task',
        {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'warning',
        }
      )

      await deleteTask(task.id)

      ElMessage({
        message: 'Task deleted successfully',
        type: 'success',
      })

      loadTaskList()
    } catch (error) {
      // 用户点击取消时，不提示失败
      console.log('Delete cancelled or failed:', error)
    }
  }
}
async function openEditDialog(task) {
  try {
    dialogMode.value = 'edit'
    currentTaskId.value = task.id

    resetForm()

    const res = await getTask(task.id)
    const detail = res.data?.data || res.data || {}

    form.title = detail.title || ''
    form.description = detail.description || ''
    form.status = detail.status ?? 1
    form.priority = detail.priority ?? 2
    form.start_time = tsToDateTimeLocal(detail.start_time_ts)
    form.end_time = tsToDateTimeLocal(detail.end_time_ts)
    form.project_id = detail.project_id ?? ''

    dialogVisible.value = true
  } catch (error) {
    ElMessage.error('Failed to load task detail')
    console.error(error)
  }
}
async function handleSubmit() {
  try {
    const payload = {
      title: form.title,
      description: form.description,
      status: form.status,
      priority: form.priority,
      start_time_ts: dateTimeLocalToTs(form.start_time),
      end_time_ts: dateTimeLocalToTs(form.end_time),
      project_id: form.project_id ? Number(form.project_id) : null,
    }

    if (dialogMode.value === 'add') {
      await addTask(payload)
      ElMessage.success('Task added successfully')
    } else {
      await updateTask(currentTaskId.value, payload)
      ElMessage.success('Task updated successfully')
    }

    dialogVisible.value = false
    resetForm()
    await loadTaskList()
  } catch (error) {
    ElMessage.error(dialogMode.value === 'add' ? 'Failed to add task' : 'Failed to update task')
    console.error(error)
  }
}
watch(
  () => props.searchKeyword,
  () => {
    currentPage.value = 1
    loadTaskList()
  }
)
onMounted(() => {
  loadTaskList()
})
</script>

<template>
  <div class="task-page" v-loading="loading">
    <div class="task-shell">
      <div class="task-topbar">
        <el-input
          :model-value="searchKeyword"
          class="task-search"
          placeholder="Search Task"
          :prefix-icon="Search"
          clearable
          @input="handleSearch"
        />
      </div>

      <div class="task-grid">
        <div
          v-for="task in displayTasks"
          :key="task.id"
          class="task-card"
        >
          <div class="task-card__top">
            <div>
              <div class="task-card__name">{{ task.name }}</div>
              <div class="task-card__project">{{ task.project }}</div>
            </div>

            <el-dropdown
              trigger="click"
              @command="(command) => handleCommand(command, task)"
            >
              <el-button text class="more-btn" aria-label="More actions">
                <el-icon><MoreFilled /></el-icon>
              </el-button>

              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="edit">Edit Task</el-dropdown-item>
                  <el-dropdown-item command="delete" divided>
                    Delete Task
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>

          <div class="task-card__info-label">Time Range</div>

          <div class="task-card__time-row">
            <div class="task-card__time-block">
              <div class="task-card__time-title">Start</div>
              <div class="task-card__time-value">{{ task.start }}</div>
            </div>

            <div
              class="priority-dot"
              :style="{ background: getPriorityColor(task.priority) }"
              :title="task.priority_text"
            ></div>
          </div>

          <div class="task-card__time-block task-card__time-block--end">
            <div class="task-card__time-title">End</div>
            <div class="task-card__time-value">{{ task.end }}</div>
          </div>

          <div class="task-card__priority-text">
            Priority:
            <span class="task-card__priority-value">
              {{ task.priority_text }}
            </span>
          </div>

          <el-select
            v-model="task.status"
            class="status-select"
            placeholder="Status"
            @change="(value) => handleStatusChange(task, value)"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>

      <div class="task-pagination">
        <el-button
          class="page-btn"
          :icon="ArrowLeft"
          :disabled="currentPage === 1"
          aria-label="Previous page"
          @click="goToPage(currentPage - 1)"
        />

        <el-button
          v-for="page in visiblePages"
          :key="page"
          class="page-btn"
          :class="{ active: page === currentPage }"
          @click="goToPage(page)"
        >
          {{ page }}
        </el-button>

        <el-button
          class="page-btn"
          :icon="ArrowRight"
          :disabled="currentPage === totalPages"
          aria-label="Next page"
          @click="goToPage(currentPage + 1)"
        />
      </div>
    </div>
  </div>
  <el-dialog
  v-model="dialogVisible"
  :title="dialogMode === 'add' ? 'Add Task' : 'Edit Task'"
  width="600px"
>
  <el-form :model="form" label-width="120px">
    <el-form-item label="Title">
      <el-input v-model="form.title" />
    </el-form-item>

    <el-form-item label="Description">
      <el-input v-model="form.description" type="textarea" />
    </el-form-item>

    <el-form-item label="Status">
      <el-select v-model="form.status">
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="Priority">
      <el-select v-model="form.priority">
        <el-option label="Low" :value="1" />
        <el-option label="Medium" :value="2" />
        <el-option label="High" :value="3" />
      </el-select>
    </el-form-item>

    <el-form-item label="Start Time">
      <el-date-picker
        v-model="form.start_time"
        type="datetime"
        value-format="YYYY-MM-DDTHH:mm"
        placeholder="Select start time"
        style="width: 100%"
      />
    </el-form-item>

    <el-form-item label="End Time">
      <el-date-picker
        v-model="form.end_time"
        type="datetime"
        value-format="YYYY-MM-DDTHH:mm"
        placeholder="Select end time"
        style="width: 100%"
      />
    </el-form-item>

    <el-form-item label="Project ID">
      <el-input v-model="form.project_id" />
    </el-form-item>
  </el-form>

  <template #footer>
    <el-button @click="dialogVisible = false">Cancel</el-button>
    <el-button type="primary" @click="handleSubmit">
      {{ dialogMode === 'add' ? 'Create' : 'Update' }}
    </el-button>
  </template>
</el-dialog>
</template>

<style scoped>
.task-page {
  min-height: 100vh;
  background: #f5f7fb;
  padding: 24px;
  box-sizing: border-box;
}

.task-shell {
  background: #fff;
  border: 1px solid #dcdfe6;
  padding: 18px;
  box-sizing: border-box;
  min-height: calc(100vh - 48px);
}

.task-topbar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.task-search {
  width: 220px;
}

.task-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  min-height: 520px;
}

.task-card {
  border: 1px solid #dcdfe6;
  padding: 14px;
  background: #fff;
  min-height: 240px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.task-card__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.task-card__name {
  font-size: 16px;
  font-weight: 700;
  color: #303133;
}

.task-card__project {
  margin-top: 4px;
  font-size: 14px;
  color: #606266;
}

.more-btn {
  padding: 0;
  min-height: auto;
  color: #606266;
}

.task-card__info-label {
  margin-top: 14px;
  font-size: 15px;
  font-weight: 700;
  color: #303133;
}

.task-card__time-row {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.task-card__time-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.task-card__time-block--end {
  margin-top: 10px;
}

.task-card__time-title {
  font-size: 13px;
  color: #595959;
}

.task-card__time-value {
  font-size: 14px;
  color: #606266;
}

.priority-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  flex: 0 0 auto;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px #d1d5db;
}

.task-card__priority-text {
  margin-top: 12px;
  font-size: 13px;
  color: #606266;
}

.task-card__priority-value {
  font-weight: 700;
}

.status-select {
  width: 100%;
  margin-top: auto;
  padding-top: 16px;
}

.task-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
}

.page-btn {
  min-width: 36px;
}

.page-btn.active {
  border-color: #409eff;
  color: #409eff;
}

@media (max-width: 1200px) {
  .task-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .task-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .task-topbar {
    justify-content: space-between;
  }
}

@media (max-width: 640px) {
  .task-page {
    padding: 16px;
  }

  .task-shell {
    padding: 14px;
  }

  .task-grid {
    grid-template-columns: 1fr;
  }

  .task-topbar {
    flex-direction: column;
    align-items: stretch;
  }

  .task-search {
    width: 100%;
  }
}
</style>