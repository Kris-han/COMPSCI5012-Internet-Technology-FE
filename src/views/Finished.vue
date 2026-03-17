<template>
  <div class="finished-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Finished</h1>
        <p class="page-subtitle">
          Review completed tasks and manage them easily.
        </p>
      </div>
    </div>

    <!-- Summary -->
    <div class="summary-grid">
      <div class="summary-card">
        <div class="summary-label">Total Finished</div>
        <div class="summary-value">{{ summary.totalFinished }}</div>
        <div class="summary-extra">All completed tasks</div>
      </div>

      <div class="summary-card">
        <div class="summary-label">Finished This Week</div>
        <div class="summary-value">{{ summary.finishedThisWeek }}</div>
        <div class="summary-extra">Tasks completed in 7 days</div>
      </div>

      <div class="summary-card">
        <div class="summary-label">Completion Rate</div>
        <div class="summary-value">{{ summary.completionRate }}%</div>
        <div class="summary-extra">Based on all tracked tasks</div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filter-bar">
      <div class="filter-left">
        <el-input
          v-model="searchKeyword"
          placeholder="Search finished tasks"
          class="search-input"
          clearable
          @input="handleFilterChange"
          @clear="handleFilterChange"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <el-select
          v-model="priorityFilter"
          placeholder="Priority"
          class="filter-select"
          @change="handleFilterChange"
        >
          <el-option label="All Priorities" value="all" />
          <el-option label="High" value="3" />
          <el-option label="Medium" value="2" />
          <el-option label="Low" value="1" />
        </el-select>
      </div>

      <div class="filter-right">
        <el-select
          v-model="sortBy"
          placeholder="Sort By"
          class="sort-select"
          @change="handleFilterChange"
        >
          <el-option label="Recently Completed" value="recent" />
          <el-option label="Oldest Completed" value="oldest" />
          <el-option label="Highest Priority" value="priority_desc" />
          <el-option label="Lowest Priority" value="priority_asc" />
        </el-select>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="state-card">
      <el-skeleton :rows="6" animated />
    </div>

    <!-- Empty -->
    <div v-else-if="finishedTasks.length === 0" class="empty-card">
      <div class="empty-icon">✓</div>
      <h3>No finished tasks yet</h3>
      <p>Completed tasks will appear here once you finish them.</p>
    </div>

    <!-- Task List -->
    <div v-else class="task-list">
      <div
        v-for="task in finishedTasks"
        :key="task.id"
        class="task-card"
      >
        <div class="task-top">
          <div class="task-left">
            <div class="finished-icon">✓</div>

            <div class="task-main">
              <div class="task-title-row">
                <h3 class="task-title">{{ task.title }}</h3>
                <span class="priority-dot" :class="getPriorityClass(task.priority)"></span>
              </div>

              <p class="task-desc">
                {{ task.description || 'No description' }}
              </p>

              <div class="task-meta">
                <span class="meta-item">
                  Completed: {{ formatDateTime(task.completed_at_ts || task.completed_at) }}
                </span>
                <span class="meta-item">
                  Priority: {{ getPriorityText(task.priority) }}
                </span>
              </div>
            </div>
          </div>

          <div class="task-right">
            <el-dropdown trigger="click" @command="handleCommand(task, $event)">
              <span class="more-btn">•••</span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="view">View</el-dropdown-item>
                  <el-dropdown-item command="reopen">Reopen Task</el-dropdown-item>
                  <el-dropdown-item command="delete" divided>Delete</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>

    <!-- View Dialog -->
    <el-dialog
      v-model="viewDialogVisible"
      title="Task Details"
      width="600px"
    >
      <div v-if="selectedTask" class="task-detail">
        <div class="detail-row">
          <span class="detail-label">Title</span>
          <span class="detail-value">{{ selectedTask.title }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Description</span>
          <span class="detail-value">{{ selectedTask.description || 'No description' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Priority</span>
          <span class="detail-value">{{ getPriorityText(selectedTask.priority) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Completed Time</span>
          <span class="detail-value">
            {{ formatDateTime(selectedTask.completed_at_ts || selectedTask.completed_at) }}
          </span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  fetchFinishedList,
  reopenFinishedTask,
  deleteFinishedTask,
} from '@/api/finished'

const loading = ref(false)
const finishedTasks = ref([])
const selectedTask = ref(null)
const viewDialogVisible = ref(false)

const searchKeyword = ref('')
const priorityFilter = ref('all')
const sortBy = ref('recent')

const summary = reactive({
  totalFinished: 0,
  finishedThisWeek: 0,
  completionRate: 0,
})

function getPriorityText(priority) {
  const p = Number(priority)
  if (p === 3) return 'High'
  if (p === 2) return 'Medium'
  if (p === 1) return 'Low'
  return 'Unknown'
}

function getPriorityClass(priority) {
  const p = Number(priority)
  if (p === 3) return 'high'
  if (p === 2) return 'medium'
  if (p === 1) return 'low'
  return 'low'
}

function formatDateTime(value) {
  if (!value) return '-'
  const date = new Date(Number(value) * 1000)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString()
}

async function loadFinishedTasks() {
  loading.value = true
  try {
    const res = await fetchFinishedList({
      keyword: searchKeyword.value,
      priority: priorityFilter.value,
      sort: sortBy.value,
    })

    const data = res?.data?.data || {}
    finishedTasks.value = Array.isArray(data.list) ? data.list : []

    summary.totalFinished = data.summary?.total_finished || 0
    summary.finishedThisWeek = data.summary?.finished_this_week || 0
    summary.completionRate = data.summary?.completion_rate || 0
  } catch (error) {
    console.error('loadFinishedTasks error:', error)
    ElMessage.error('Failed to load finished tasks')
    finishedTasks.value = []
    summary.totalFinished = 0
    summary.finishedThisWeek = 0
    summary.completionRate = 0
  } finally {
    loading.value = false
  }
}

function handleFilterChange() {
  loadFinishedTasks()
}

function handleCommand(task, command) {
  if (command === 'view') {
    selectedTask.value = task
    viewDialogVisible.value = true
    return
  }

  if (command === 'reopen') {
    handleReopen(task)
    return
  }

  if (command === 'delete') {
    handleDelete(task)
  }
}

async function handleReopen(task) {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to reopen "${task.title}"?`,
      'Confirm',
      { type: 'warning' }
    )

    await reopenFinishedTask({ id: task.id })
    ElMessage.success('Task reopened successfully')
    loadFinishedTasks()
  } catch (error) {
    if (error === 'cancel') return
    console.error('handleReopen error:', error)
    ElMessage.error('Failed to reopen task')
  }
}

async function handleDelete(task) {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete "${task.title}"?`,
      'Warning',
      { type: 'warning' }
    )

    await deleteFinishedTask({ id: task.id })
    ElMessage.success('Task deleted successfully')
    loadFinishedTasks()
  } catch (error) {
    if (error === 'cancel') return
    console.error('handleDelete error:', error)
    ElMessage.error('Failed to delete task')
  }
}

onMounted(() => {
  loadFinishedTasks()
})
</script>

<style scoped>
.finished-page {
  padding: 24px;
  background: #f7f8fc;
  min-height: 100%;
  box-sizing: border-box;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
}

.page-title {
  margin: 0;
  font-size: 30px;
  font-weight: 700;
  color: #1f2937;
}

.page-subtitle {
  margin: 8px 0 0;
  font-size: 14px;
  color: #6b7280;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.summary-card {
  background: #ffffff;
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
}

.summary-label {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 12px;
}

.summary-value {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
}

.summary-extra {
  font-size: 13px;
  color: #10b981;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  background: #ffffff;
  border-radius: 18px;
  padding: 16px;
  margin-bottom: 24px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
}

.filter-left,
.filter-right {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.search-input {
  width: 260px;
}

.filter-select,
.sort-select {
  width: 180px;
}

.state-card,
.empty-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.05);
}

.empty-card {
  text-align: center;
  padding: 48px 24px;
}

.empty-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 16px;
  border-radius: 16px;
  background: #dcfce7;
  color: #16a34a;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: 700;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 850px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 6px;
}
.task-list::-webkit-scrollbar {
  width: 8px;
}

.task-list::-webkit-scrollbar-track {
  background: transparent;
}

.task-list::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 999px;
}

.task-list::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.task-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.05);
  transition: all 0.2s ease;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08);
}

.task-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.task-left {
  display: flex;
  gap: 16px;
  flex: 1;
}

.finished-icon {
  width: 42px;
  height: 42px;
  min-width: 42px;
  border-radius: 12px;
  background: #dcfce7;
  color: #16a34a;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: 18px;
}

.task-main {
  flex: 1;
}

.task-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.task-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  text-decoration: line-through;
}

.priority-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.priority-dot.high {
  background: #ef4444;
}

.priority-dot.medium {
  background: #f59e0b;
}

.priority-dot.low {
  background: #10b981;
}

.task-desc {
  margin: 0 0 12px;
  font-size: 14px;
  line-height: 1.6;
  color: #6b7280;
}

.task-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 16px;
}

.meta-item {
  font-size: 13px;
  color: #4b5563;
  background: #f3f4f6;
  padding: 6px 10px;
  border-radius: 999px;
}

.task-right {
  display: flex;
  align-items: center;
  gap: 14px;
}

.more-btn {
  cursor: pointer;
  font-size: 22px;
  color: #6b7280;
  user-select: none;
  padding: 0 6px;
}

.task-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-label {
  font-size: 13px;
  color: #6b7280;
}

.detail-value {
  font-size: 15px;
  color: #111827;
  word-break: break-word;
}

@media (max-width: 1200px) {
  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .finished-page {
    padding: 16px;
  }

  .page-header,
  .filter-bar,
  .task-top {
    flex-direction: column;
    align-items: stretch;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .search-input,
  .filter-select,
  .sort-select {
    width: 100%;
  }

  .task-right {
    justify-content: flex-end;
  }
}
</style>