<script setup lang="ts">
import { ref } from 'vue'
import SidebarMenu from './SidebarMenu.vue'
import MainContent from './MainContent.vue'
import AddTaskDialog from '../../src/components/AddTaskDialog.vue'

const activeKey = ref('dashboard')
const activeProject = ref('guide')
const collapsed = ref(false)

const showAdd = ref(false)
const todayCount = ref(0)
const searchKeyword = ref('')
const todayRefreshKey = ref(0)


const currentTask = ref(null)
const showTaskDialog = ref(false)
const dialogMode = ref('add')

function handleTaskUpdated() {
  showTaskDialog.value = false
  currentTask.value = null
  todayRefreshKey.value += 1
}

const onTaskCreated = () => {
  showAdd.value = false
  // 后面这里可以加刷新逻辑
}
function handleSearch(value: string) {
  searchKeyword.value = value
}
function handleOpenTaskDetail(task) {
  currentTask.value = task
  dialogMode.value = 'edit'
  showTaskDialog.value = true
}
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
    />

    <main class="main">
      <MainContent
        :active-key="activeKey"
        :active-project="activeProject"
        :search-keyword="searchKeyword"
        :today-refresh-key="todayRefreshKey"
        @update:searchKeyword="searchKeyword = $event"
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