<script setup>
import {
  Search,
  MoreFilled,
  ArrowLeft,
  ArrowRight,
} from '@element-plus/icons-vue'
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = 12

const tasks = ref([
  {
    id: 1,
    name: 'Task Name',
    project: 'project',
    start: '12-03-2026',
    end: '18-03-2026',
    status: 'To Do',
    priority: 'High',
    executors: [
      { name: 'Chris', avatar: '' },
      { name: 'Amy', avatar: '' },
    ],
  },
  {
    id: 2,
    name: 'Task Name',
    project: 'project',
    start: '13-03-2026',
    end: '19-03-2026',
    status: 'In Progress',
    priority: 'Medium',
    executors: [
      { name: 'Tom', avatar: '' },
    ],
  },
  {
    id: 3,
    name: 'Task Name',
    project: 'project',
    start: '14-03-2026',
    end: '20-03-2026',
    status: 'Completed',
    priority: 'Low',
    executors: [
      { name: 'Lily', avatar: '' },
      { name: 'Sam', avatar: '' },
    ],
  },
  {
    id: 4,
    name: 'Task Name',
    project: 'project',
    start: '15-03-2026',
    end: '21-03-2026',
    status: 'Postponed',
    priority: 'High',
    executors: [
      { name: 'Leo', avatar: '' },
    ],
  },
  {
    id: 5,
    name: 'Task Name',
    project: 'project',
    start: '16-03-2026',
    end: '22-03-2026',
    status: 'To Do',
    priority: 'Low',
    executors: [
      { name: 'Nina', avatar: '' },
      { name: 'Ben', avatar: '' },
    ],
  },
  {
    id: 6,
    name: 'Task Name',
    project: 'project',
    start: '17-03-2026',
    end: '23-03-2026',
    status: 'In Progress',
    priority: 'Medium',
    executors: [
      { name: 'Ava', avatar: '' },
    ],
  },
  {
    id: 7,
    name: 'Task Name',
    project: 'project',
    start: '18-03-2026',
    end: '24-03-2026',
    status: 'Completed',
    priority: 'Low',
    executors: [
      { name: 'Mia', avatar: '' },
      { name: 'Noah', avatar: '' },
    ],
  },
  {
    id: 8,
    name: 'Task Name',
    project: 'project',
    start: '19-03-2026',
    end: '25-03-2026',
    status: 'To Do',
    priority: 'High',
    executors: [
      { name: 'Jack', avatar: '' },
    ],
  },
  {
    id: 9,
    name: 'Task Name',
    project: 'project',
    start: '20-03-2026',
    end: '26-03-2026',
    status: 'Postponed',
    priority: 'Medium',
    executors: [
      { name: 'Emma', avatar: '' },
    ],
  },
  {
    id: 10,
    name: 'Task Name',
    project: 'project',
    start: '21-03-2026',
    end: '27-03-2026',
    status: 'To Do',
    priority: 'Low',
    executors: [
      { name: 'Ivy', avatar: '' },
    ],
  },
  {
    id: 11,
    name: 'Task Name',
    project: 'project',
    start: '22-03-2026',
    end: '28-03-2026',
    status: 'In Progress',
    priority: 'High',
    executors: [
      { name: 'Luke', avatar: '' },
      { name: 'Anna', avatar: '' },
    ],
  },
  {
    id: 12,
    name: 'Task Name',
    project: 'project',
    start: '23-03-2026',
    end: '29-03-2026',
    status: 'Completed',
    priority: 'Medium',
    executors: [
      { name: 'Eva', avatar: '' },
    ],
  },
  {
    id: 13,
    name: 'Task Name',
    project: 'project',
    start: '24-03-2026',
    end: '30-03-2026',
    status: 'To Do',
    priority: 'Low',
    executors: [
      { name: 'Chris', avatar: '' },
    ],
  },
  {
    id: 14,
    name: 'Task Name',
    project: 'project',
    start: '25-03-2026',
    end: '31-03-2026',
    status: 'Postponed',
    priority: 'High',
    executors: [
      { name: 'Amy', avatar: '' },
    ],
  },
  {
    id: 15,
    name: 'Task Name',
    project: 'project',
    start: '26-03-2026',
    end: '01-04-2026',
    status: 'To Do',
    priority: 'Medium',
    executors: [
      { name: 'Tom', avatar: '' },
      { name: 'Lily', avatar: '' },
    ],
  },
  {
    id: 16,
    name: 'Task Name',
    project: 'project',
    start: '27-03-2026',
    end: '02-04-2026',
    status: 'In Progress',
    priority: 'High',
    executors: [
      { name: 'Sam', avatar: '' },
    ],
  },
  {
    id: 17,
    name: 'Task Name',
    project: 'project',
    start: '28-03-2026',
    end: '03-04-2026',
    status: 'Completed',
    priority: 'Low',
    executors: [
      { name: 'Leo', avatar: '' },
    ],
  },
  {
    id: 18,
    name: 'Task Name',
    project: 'project',
    start: '29-03-2026',
    end: '04-04-2026',
    status: 'To Do',
    priority: 'Medium',
    executors: [
      { name: 'Ben', avatar: '' },
      { name: 'Nina', avatar: '' },
    ],
  },
  {
    id: 19,
    name: 'Task Name',
    project: 'project',
    start: '30-03-2026',
    end: '05-04-2026',
    status: 'Postponed',
    priority: 'High',
    executors: [
      { name: 'Ava', avatar: '' },
    ],
  },
  {
    id: 20,
    name: 'Task Name',
    project: 'project',
    start: '31-03-2026',
    end: '06-04-2026',
    status: 'To Do',
    priority: 'Low',
    executors: [
      { name: 'Mia', avatar: '' },
    ],
  },
  {
    id: 21,
    name: 'Task Name',
    project: 'project',
    start: '01-04-2026',
    end: '07-04-2026',
    status: 'In Progress',
    priority: 'Medium',
    executors: [
      { name: 'Noah', avatar: '' },
    ],
  },
  {
    id: 22,
    name: 'Task Name',
    project: 'project',
    start: '02-04-2026',
    end: '08-04-2026',
    status: 'Completed',
    priority: 'High',
    executors: [
      { name: 'Jack', avatar: '' },
      { name: 'Emma', avatar: '' },
    ],
  },
  {
    id: 23,
    name: 'Task Name',
    project: 'project',
    start: '03-04-2026',
    end: '09-04-2026',
    status: 'To Do',
    priority: 'Low',
    executors: [
      { name: 'Ivy', avatar: '' },
    ],
  },
  {
    id: 24,
    name: 'Task Name',
    project: 'project',
    start: '04-04-2026',
    end: '10-04-2026',
    status: 'Postponed',
    priority: 'Medium',
    executors: [
      { name: 'Luke', avatar: '' },
    ],
  },
])

const statusOptions = ['To Do', 'In Progress', 'Completed', 'Postponed']

const filteredTasks = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()
  if (!keyword) return tasks.value

  return tasks.value.filter(
    (task) =>
      task.name.toLowerCase().includes(keyword) ||
      task.project.toLowerCase().includes(keyword) ||
      task.status.toLowerCase().includes(keyword) ||
      task.priority.toLowerCase().includes(keyword) ||
      task.executors.some((item) => item.name.toLowerCase().includes(keyword))
  )
})

const totalPages = computed(() => Math.ceil(filteredTasks.value.length / pageSize))

const paginatedTasks = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredTasks.value.slice(start, end)
})

const visiblePages = computed(() => {
  return Array.from({ length: totalPages.value }, (_, i) => i + 1).slice(0, 5)
})

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

function handleSearch() {
  currentPage.value = 1
}

function getPriorityColor(priority) {
  if (priority === 'High') return '#EF4444'
  if (priority === 'Medium') return '#F59E0B'
  return '#22C55E'
}

function handleCommand(command, task) {
  if (command === 'edit') {
    ElMessage({
      message: `Edit task: ${task.name}`,
      type: 'info',
    })
  }

  if (command === 'delete') {
    ElMessageBox.confirm(
      `Are you sure you want to delete "${task.name}"?`,
      'Delete Task',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )
      .then(() => {
        tasks.value = tasks.value.filter((item) => item.id !== task.id)
        if (currentPage.value > totalPages.value) {
          currentPage.value = Math.max(1, totalPages.value)
        }
        ElMessage({
          message: 'Task deleted successfully',
          type: 'success',
        })
      })
      .catch(() => {})
  }
}
</script>

<template>
  <div class="task-page">
    <div class="task-shell">
      <div class="task-topbar">
        <div class="task-total">({{ filteredTasks.length }})</div>

        <el-input
          v-model="searchKeyword"
          class="task-search"
          placeholder="Search Task"
          :prefix-icon="Search"
          clearable
          @input="handleSearch"
        />
      </div>

      <div class="task-grid">
        <div
          v-for="task in paginatedTasks"
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
              <el-button text class="more-btn">
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

          <div class="task-card__executor-label">Executor</div>

          <div class="task-card__executor-row">
            <div class="executor-avatars">
              <el-avatar
                v-for="person in task.executors"
                :key="person.name"
                :size="28"
                class="executor-avatar"
              >
                {{ person.name.charAt(0).toUpperCase() }}
              </el-avatar>
            </div>

            <div
              class="priority-dot"
              :style="{ background: getPriorityColor(task.priority) }"
              :title="task.priority"
            ></div>
          </div>

          <div class="task-card__priority-text">
            Priority: {{ task.priority }}
          </div>

          <div class="task-card__dates">
            <div>{{ task.start }}</div>
            <div>{{ task.end }}</div>
          </div>

          <el-select
            v-model="task.status"
            class="status-select"
            placeholder="Status"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </div>
      </div>

      <div class="task-pagination">
        <el-button
          class="page-btn"
          :icon="ArrowLeft"
          :disabled="currentPage === 1"
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
          @click="goToPage(currentPage + 1)"
        />
      </div>
    </div>
  </div>
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

.task-total {
  font-size: 18px;
  font-weight: 700;
  color: #303133;
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

.task-card__executor-label {
  margin-top: 14px;
  font-size: 15px;
  font-weight: 700;
  color: #303133;
}

.task-card__executor-row {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.executor-avatars {
  display: flex;
  align-items: center;
}

.executor-avatar {
  margin-right: -6px;
  border: 2px solid #fff;
  background: #93c5fd;
  color: #1e3a8a;
  font-weight: 700;
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
  margin-top: 10px;
  font-size: 13px;
  color: #606266;
}

.task-card__dates {
  margin-top: 14px;
  font-size: 14px;
  line-height: 1.8;
  color: #606266;
}

.status-select {
  width: 100%;
  margin-top: 16px;
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

.page-total {
  margin-left: 6px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
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