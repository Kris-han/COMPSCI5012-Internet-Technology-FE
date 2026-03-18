<template>
  <div class="today-page">
    <div class="today-header">
      <div class="today-header-left">
        <p class="today-greeting">Good morning, Chris</p>
        <h1 class="page-title">Today</h1>
        <p class="page-subtitle">
          You have <strong>{{ totalCount }}</strong> tasks today, including
          <strong>{{ highPriorityCount }}</strong> high priority items that need attention.
        </p>
      </div>

      <div class="today-header-actions">
        <button class="ghost-btn" @click="emit('go-task-list')">View All Tasks</button>
        <button class="primary-btn" @click="emit('add-task')">+ Add New Task</button>
      </div>
    </div>

    <div class="summary-grid">
      <div class="summary-card">
        <div class="summary-top">
          <span class="summary-label">Today Tasks</span>
          <span class="summary-trend neutral">{{ todayVsYesterdayText }}</span>
        </div>
        <div class="summary-value">{{ totalCount }}</div>
        <div class="summary-note">Tasks scheduled for today</div>
      </div>

      <div class="summary-card">
        <div class="summary-top">
          <span class="summary-label">In Progress</span>
          <span class="summary-trend warning">Most active</span>
        </div>
       <div class="summary-value">{{ inProgressCount }}</div>
        <div class="summary-note">Currently being worked on</div>
      </div>

      <div class="summary-card">
        <div class="summary-top">
          <span class="summary-label">Completed</span>
          <span class="summary-trend success">25% done</span>
        </div>
        <div class="summary-value">{{ completedCount }}</div>
        <div class="summary-note">Finished so far today</div>
      </div>

      <div class="summary-card">
        <div class="summary-top">
          <span class="summary-label">High Priority</span>
          <span class="summary-trend danger">Need attention</span>
        </div>
        <div class="summary-value danger">{{ highPriorityCount }}</div>
        <div class="summary-note">Urgent tasks still open</div>
      </div>
    </div>

    <div class="content-grid">
      <section class="panel focus-panel">
        <div class="panel-header">
          <div>
            <div class="panel-eyebrow">Main focus</div>
            <h2>Focus Task</h2>
          </div>
          <span class="badge badge-danger">High Priority</span>
        </div>

        <div v-if="focusTask" class="focus-task-card">
          <div class="focus-top">
            <div>
              <h3>{{ focusTask.title }}</h3>
              <p class="project-text">
                {{ focusTask.project_name || `Project ${focusTask.project_name || ''}` }}
              </p>
            </div>
            <span class="status-tag" :class="getStatusClass(Number(focusTask.status))">
              {{ getStatusText(Number(focusTask.status)) }}
            </span>
          </div>

          <p class="task-desc">
            {{ focusTask.description || 'No description available.' }}
          </p>

          <div class="focus-meta-row">
            <div class="focus-meta-card">
              <span class="meta-label">Time Block</span>
              <span class="meta-value">
                {{ formatTimeRange(focusTask.start_time_ts, focusTask.end_time_ts) }}
              </span>
            </div>
            <div class="focus-meta-card">
              <span class="meta-label">Priority</span>
              <span class="meta-value">
                {{ Number(focusTask.priority) === 3 ? 'High' : Number(focusTask.priority) === 2 ? 'Medium' : 'Low' }}
              </span>
            </div>
            <div class="focus-meta-card">
              <span class="meta-label">Status</span>
              <span class="meta-value">
                {{ getStatusText(Number(focusTask.status)) }}
              </span>
            </div>
          </div>

          <div class="focus-actions">
            <button class="ghost-btn" @click="emit('open-task-detail', focusTask)">Edit Task</button>
            <button class="primary-btn" @click="handleContinueTask(focusTask)">Continue Task</button>
          </div>
        </div>

        <div v-else class="focus-task-card">
          <p class="task-desc">No focus task for today.</p>
        </div>
      </section>

      <section class="panel progress-panel">
        <div class="panel-header">
          <div>
            <div class="panel-eyebrow">Daily progress</div>
            <h2>Progress Summary</h2>
          </div>
        </div>

        <div class="progress-main">
          <div class="progress-number">{{ completionRate }}%</div>
          <div class="progress-text">{{ completedCount }} of {{ totalCount }} tasks completed</div>
        </div>

        <div class="progress-bar-wrap">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: completionRate + '%' }"></div>
          </div>
        </div>

         <div class="progress-caption">
          Keep going — you still have <strong>{{ totalCount - completedCount }}</strong> tasks remaining for today.
        </div>

        <div class="mini-stat">
          <span class="dot green"></span>
          <span>Completed: {{ completedCount }}</span>
        </div>
        <div class="mini-stat">
          <span class="dot orange"></span>
          <span>Pending: {{ totalCount - completedCount }}</span>
        </div>
        <div class="mini-stat">
          <span class="dot red"></span>
          <span>Urgent: {{ highPriorityCount }}</span>
        </div>
      </section>
    </div>

    <section class="panel task-list-panel">
      <div class="panel-header">
        <div>
          <div class="panel-eyebrow">Execution list</div>
          <h2>Today Task List</h2>
        </div>

        <div class="panel-tools">
          <button
            class="tab-btn"
            :class="{ active: activeFilter === 'all' }"
            @click="activeFilter = 'all'"
          >
            All
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeFilter === 'unfinished' }"
            @click="activeFilter = 'unfinished'"
          >
            Unfinished
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeFilter === 'high' }"
            @click="activeFilter = 'high'"
          >
            High Priority
          </button>
        </div>
      </div>

      <div v-if="filteredTodayTasks.length" class="today-task-list">
        <div
          v-for="task in filteredTodayTasks"
          :key="task.id"
          class="today-task-item"
        >
          <div class="task-left">
            <span class="dot" :class="task.priorityDotClass"></span>
            <div>
              <div class="task-title">{{ task.title }}</div>
              <div class="task-meta">{{ task.projectText }} · {{ task.timeText }}</div>
            </div>
          </div>
          <div class="task-right">
            <span class="status-tag" :class="task.statusClass">
              {{ task.statusText }}
            </span>
            <button class="mini-btn" @click="emit('open-task-detail', task)">Open</button>
          </div>
        </div>
      </div>

      <div v-else class="empty-box">
        No tasks scheduled for today.
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted,watch } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchTaskList } from '../api/task_list.js'
import { updateTask } from '../api/task.js'

const props = defineProps({
  todayRefreshKey: {
    type: Number,
    default: 0,
  },
})
const activeFilter = ref('all')
const loading = ref(false)
const taskList = ref([])
const emit = defineEmits(['go-task-list', 'add-task', 'open-task-detail', 'update:todayCount'])
function getTodayStartAndEnd() {
  const now = new Date()

  const start = new Date(now)
  start.setHours(0, 0, 0, 0)

  const end = new Date(now)
  end.setHours(23, 59, 59, 999)

  return {
    startTs: Math.floor(start.getTime() / 1000),
    endTs: Math.floor(end.getTime() / 1000),
  }
}
const unfinishedCount = computed(() => {
  return todayTasks.value.filter((task) => Number(task.status) !== 3).length
})
function getYesterdayStartAndEnd() {
  const now = new Date()

  const start = new Date(now)
  start.setDate(start.getDate() - 1)
  start.setHours(0, 0, 0, 0)

  const end = new Date(now)
  end.setDate(end.getDate() - 1)
  end.setHours(23, 59, 59, 999)

  return {
    startTs: Math.floor(start.getTime() / 1000),
    endTs: Math.floor(end.getTime() / 1000),
  }
}
async function handleContinueTask(task) {
  if (!task) return

  if (Number(task.status) === 2) {
    ElMessage({
      message: 'This task is already in progress',
      type: 'info',
    })
    return
  }

  try {
    await updateTask(task.id, {
      status: 2,
    })

    ElMessage({
      message: 'Task moved to In Progress',
      type: 'success',
    })

    await loadTodayTasks()
  } catch (error) {
    ElMessage({
      message: 'Failed to continue task',
      type: 'error',
    })
    console.error(error)
  }
}
const yesterdayTasks = computed(() => {
  const { startTs, endTs } = getYesterdayStartAndEnd()

  return taskList.value.filter((task) => {
    if (Number(task.is_deleted) === 1) return false

    const startTime = Number(task.start_time_ts || 0)
    const endTime = Number(task.end_time_ts || 0)

    const startInYesterday = startTime >= startTs && startTime <= endTs
    const endInYesterday = endTime >= startTs && endTime <= endTs
    const spansYesterday = startTime < startTs && endTime > endTs

    return startInYesterday || endInYesterday || spansYesterday
  })
})

const todayVsYesterday = computed(() => {
  return totalCount.value - yesterdayTasks.value.length
})

const todayVsYesterdayText = computed(() => {
  const diff = todayVsYesterday.value

  if (diff > 0) return `+${diff} vs yesterday`
  if (diff < 0) return `${diff} vs yesterday`
  return 'Same as yesterday'
})

function formatTimeRange(startTs, endTs) {
  if (!startTs || !endTs) return 'No time range'

  const start = new Date(startTs * 1000)
  const end = new Date(endTs * 1000)

  const hh1 = String(start.getHours()).padStart(2, '0')
  const mm1 = String(start.getMinutes()).padStart(2, '0')
  const hh2 = String(end.getHours()).padStart(2, '0')
  const mm2 = String(end.getMinutes()).padStart(2, '0')

  return `Today · ${hh1}:${mm1} - ${hh2}:${mm2}`
}

function getPriorityDotClass(priority) {
  if (priority === 3) return 'red'
  if (priority === 2) return 'orange'
  return 'green'
}

function getStatusText(status) {
  if (status === 1) return 'To Do'
  if (status === 2) return 'In Progress'
  if (status === 3) return 'Completed'
  if (status === 4) return 'Postponed'
  return 'Unknown'
}

function getStatusClass(status) {
  if (status === 1) return 'todo'
  if (status === 2) return 'in-progress'
  if (status === 3) return 'completed'
  if (status === 4) return 'postponed'
  return 'todo'
}

async function loadTodayTasks() {
  loading.value = true
  try {
    const res = await fetchTaskList({
      page: 1,
      page_size: 100,
    })

    const list = res.data?.data?.list || res.data?.data || []
    taskList.value = Array.isArray(list) ? list : []
  } catch (error) {
    console.error('Failed to load today tasks:', error)
  } finally {
    loading.value = false
  }
}

const todayTasks = computed(() => {
  const { startTs, endTs } = getTodayStartAndEnd()

  return taskList.value.filter((task) => {
    if (Number(task.is_deleted) === 1) return false

    const startTime = Number(task.start_time_ts || 0)
    const endTime = Number(task.end_time_ts || 0)

    const startInToday = startTime >= startTs && startTime <= endTs
    const endInToday = endTime >= startTs && endTime <= endTs
    const spansToday = startTime < startTs && endTime > endTs

    return startInToday || endInToday || spansToday
  })
})

const totalCount = computed(() => todayTasks.value.length)

const inProgressCount = computed(() => {
  return todayTasks.value.filter((task) => Number(task.status) === 2).length
})

const completedCount = computed(() => {
  return todayTasks.value.filter((task) => Number(task.status) === 3).length
})

const highPriorityCount = computed(() => {
  return todayTasks.value.filter(
    (task) => Number(task.priority) === 3 && Number(task.status) !== 3
  ).length
})

const completionRate = computed(() => {
  if (!totalCount.value) return 0
  return Math.round((completedCount.value / totalCount.value) * 100)
})

const focusTask = computed(() => {
  const candidates = todayTasks.value
    .filter((task) => Number(task.status) !== 3)
    .sort((a, b) => {
      const priorityDiff = Number(b.priority) - Number(a.priority)
      if (priorityDiff !== 0) return priorityDiff
      return Number(a.end_time_ts || 0) - Number(b.end_time_ts || 0)
    })

  return candidates[0] || null
})

const displayTodayTasks = computed(() => {
  return todayTasks.value.map((task) => ({
    ...task,
    timeText: formatTimeRange(task.start_time_ts, task.end_time_ts),
    priorityDotClass: getPriorityDotClass(Number(task.priority)),
    statusText: getStatusText(Number(task.status)),
    statusClass: getStatusClass(Number(task.status)),
    projectText: task.project_name || `Project ${task.project_name || ''}`,
  }))
})
const filteredTodayTasks = computed(() => {
  if (activeFilter.value === 'unfinished') {
    return displayTodayTasks.value.filter((task) => Number(task.status) !== 3)
  }

  if (activeFilter.value === 'high') {
    return displayTodayTasks.value.filter((task) => Number(task.priority) === 3)
  }

  return displayTodayTasks.value
})


watch(
  () => props.todayRefreshKey,
  () => {
    loadTodayTasks()
  }
)
watch(
  unfinishedCount,
  (value) => {
    emit('update:todayCount', value)
  },
  { immediate: true }
)
onMounted(() => {
  loadTodayTasks()
})
</script>

<style scoped>
.today-page {
  padding: 24px;
  background: #f5f7fb;
  min-height: 100%;
  box-sizing: border-box;
}

.today-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
}

.today-header-left {
  display: flex;
  flex-direction: column;
}

.today-greeting {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
}
.empty-box {
  padding: 24px;
  border: 1px dashed #dbe3ee;
  border-radius: 16px;
  color: #94a3b8;
  text-align: center;
  background: #fcfdff;
}
.page-title {
  margin: 0;
  font-size: 42px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.1;
}

.page-subtitle {
  margin: 10px 0 0;
  font-size: 16px;
  color: #64748b;
  line-height: 1.6;
}

.today-header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.summary-card {
  background: #fff;
  border-radius: 18px;
  padding: 18px 20px;
  border: 1px solid #e9eef5;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
}

.summary-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.summary-label {
  font-size: 14px;
  color: #64748b;
}

.summary-trend {
  font-size: 12px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 999px;
}

.summary-trend.neutral {
  background: #f1f5f9;
  color: #64748b;
}

.summary-trend.warning {
  background: #fff7ed;
  color: #ea580c;
}

.summary-trend.success {
  background: #ecfdf5;
  color: #16a34a;
}

.summary-trend.danger {
  background: #fef2f2;
  color: #ef4444;
}

.summary-value {
  font-size: 30px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 8px;
}

.summary-value.danger {
  color: #ef4444;
}

.summary-note {
  font-size: 13px;
  color: #94a3b8;
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.panel {
  background: #fff;
  border-radius: 20px;
  padding: 20px;
  border: 1px solid #e9eef5;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 18px;
  gap: 16px;
}

.panel-header h2 {
  margin: 2px 0 0;
  font-size: 20px;
  color: #0f172a;
}

.panel-eyebrow {
  font-size: 12px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.focus-task-card {
  background: linear-gradient(180deg, #fff 0%, #fafcff 100%);
  border: 1px solid #edf2f7;
  border-radius: 18px;
  padding: 18px;
}

.focus-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 14px;
}

.focus-top h3 {
  margin: 0;
  font-size: 24px;
  color: #0f172a;
}

.project-text {
  margin: 6px 0 0;
  font-size: 14px;
  color: #64748b;
}

.task-desc {
  margin: 0 0 18px;
  color: #475569;
  line-height: 1.65;
  font-size: 14px;
}

.focus-meta-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.focus-meta-card {
  border: 1px solid #edf2f7;
  background: #fff;
  border-radius: 14px;
  padding: 12px;
}

.meta-label {
  display: block;
  font-size: 12px;
  color: #94a3b8;
  margin-bottom: 6px;
}

.meta-value {
  font-size: 14px;
  color: #0f172a;
  font-weight: 700;
}

.focus-actions {
  display: flex;
  gap: 12px;
}

.progress-main {
  margin-bottom: 16px;
}

.progress-number {
  font-size: 40px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 8px;
}

.progress-text {
  color: #64748b;
  font-size: 14px;
}

.progress-bar-wrap {
  margin-bottom: 14px;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background: #edf2f7;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #f87171 0%, #fb7185 100%);
}

.progress-caption {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 18px;
  line-height: 1.6;
}

.mini-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mini-stat {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #475569;
  font-size: 14px;
}

.task-list-panel {
  margin-bottom: 0;
}

.panel-tools {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.today-task-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.today-task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 14px;
  border: 1px solid #edf2f7;
  border-radius: 16px;
  background: #fcfdff;
  gap: 16px;
}

.task-left {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.task-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
}

.task-meta {
  font-size: 13px;
  color: #64748b;
}

.task-right {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-top: 4px;
  display: inline-block;
}

.dot.red {
  background: #ef4444;
}

.dot.orange {
  background: #f59e0b;
}

.dot.green {
  background: #22c55e;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.badge-danger {
  background: #fef2f2;
  color: #ef4444;
}

.status-tag {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.status-tag.todo {
  background: #eff6ff;
  color: #2563eb;
}

.status-tag.in-progress {
  background: #fff7ed;
  color: #ea580c;
}

.status-tag.completed {
  background: #ecfdf5;
  color: #16a34a;
}

.status-tag.postponed {
  background: #f8fafc;
  color: #64748b;
}

.primary-btn,
.ghost-btn,
.tab-btn,
.mini-btn {
  border: none;
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.primary-btn {
  background: #f87171;
  color: #fff;
  height: 40px;
  padding: 0 16px;
  border-radius: 12px;
  font-weight: 700;
}

.primary-btn:hover {
  background: #ef4444;
}

.ghost-btn {
  background: #fff;
  color: #475569;
  height: 40px;
  padding: 0 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  font-weight: 600;
}

.ghost-btn:hover {
  background: #f8fafc;
}

.tab-btn {
  height: 34px;
  padding: 0 14px;
  border-radius: 10px;
  background: #f1f5f9;
  color: #64748b;
  font-weight: 600;
}

.tab-btn.active {
  background: #e0ecff;
  color: #2563eb;
}

.mini-btn {
  height: 32px;
  padding: 0 12px;
  border-radius: 10px;
  background: #fff;
  border: 1px solid #e2e8f0;
  color: #475569;
  font-weight: 600;
}

.mini-btn:hover {
  background: #f8fafc;
}

@media (max-width: 1200px) {
  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .focus-meta-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .today-header {
    flex-direction: column;
    align-items: stretch;
  }

  .today-header-actions {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .today-task-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .task-right {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
}
</style>