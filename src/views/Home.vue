<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SidebarMenu from './SidebarMenu.vue'
import MainContent from './MainContent.vue'
import { fetchTodayCount } from '@/api/dashboard'
import AddTaskDialog from '../../src/components/AddTaskDialog.vue'
import { useRouter } from 'vue-router'
import { clearAuth } from '@/utils/auth'
import { logout } from '@/api/auth'

const activeKey = ref('dashboard')
const activeProject = ref('guide')
const collapsed = ref(false)
const router = useRouter()

const showAdd = ref(false)
const todayCount = ref(0)
const searchKeyword = ref('')
const todayRefreshKey = ref(0)
const dashboardRefreshKey = ref(0)
const taskListRefreshKey = ref(0)
async function handleLogout() {
  try {
    await logout({})
  } catch (error) {
    console.error('logout error:', error)
  } finally {
    clearAuth()
    await router.push('/login')
  }
}
async function loadTodayCount() {
  try {
    const res = await fetchTodayCount()
    todayCount.value = Number(res?.data?.data?.today_count || 0)
  } catch (error) {
    console.error('loadTodayCount error:', error)
    todayCount.value = 0
  }
}


const currentTask = ref(null)
const showTaskDialog = ref(false)
const dialogMode = ref('add')

const handleTaskUpdated = async () => {
  showTaskDialog.value = false
  currentTask.value = null
  todayRefreshKey.value += 1
  dashboardRefreshKey.value += 1
  taskListRefreshKey.value += 1
  await loadTodayCount()
}

const onTaskCreated = async () => {
  showAdd.value = false
  todayRefreshKey.value += 1
  dashboardRefreshKey.value += 1
  taskListRefreshKey.value += 1
  await loadTodayCount()
}
function handleSearch(value: string) {
  searchKeyword.value = value
}
function handleOpenTaskDetail(task) {
  currentTask.value = task
  dialogMode.value = 'edit'
  showTaskDialog.value = true
}
onMounted(() => {
  loadTodayCount()
})
</script>

<template>
  <div class="home">
    <SidebarMenu
      v-model:activeKey="activeKey"
      v-model:activeProject="activeProject"
      v-model:collapsed="collapsed"
      v-model:searchKeyword="searchKeyword"
      :todayCount="todayCount"
      @add-task="showAdd = true"
      @logout="handleLogout"
    />

    <main class="main">
      <MainContent
        :active-key="activeKey"
        :active-project="activeProject"
        :search-keyword="searchKeyword"
        :today-refresh-key="todayRefreshKey"
        :dashboard-refresh-key="dashboardRefreshKey"
        :task-list-refresh-key="taskListRefreshKey"
        @update:searchKeyword="searchKeyword = $event"
        @update:todayCount="todayCount = $event"
        @go-task-list="activeKey = 'taskList'"
        @add-task="showAdd = true"
        @open-task-detail="handleOpenTaskDetail"
      />
    </main>

    <AddTaskDialog
      v-model:visible="showAdd"
      @created="onTaskCreated"
    />

    <AddTaskDialog
      v-model:visible="showTaskDialog"
      :mode="dialogMode"
      :task-data="currentTask"
      @created="onTaskCreated"
      @updated="handleTaskUpdated"
    />
  </div>
</template>

<style scoped>
.home {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: #f5f7fb;
}

.main {
  flex: 1;
  min-width: 0;
  min-height: 100vh;
  overflow: auto;
}
</style>