<script setup>
import { computed, defineAsyncComponent } from 'vue'
import Dashboard from './Dashboard.vue'
const Today = defineAsyncComponent(() => import('./Today.vue'))
const TaskList = defineAsyncComponent(() => import('./TaskList.vue'))
const Finished = defineAsyncComponent(() => import('./Finished.vue'))

const props = defineProps({
  activeKey: {
    type: String,
    default: 'dashboard',
  },
  activeProject: {
    type: String,
    default: '',
  },
  searchKeyword: {
    type: String,
    default: '',
  },
  todayRefreshKey: {
    type: Number,
    default: 0,
  },
  dashboardRefreshKey: {
    type: Number,
    default: 0,
  },
  taskListRefreshKey: {
    type: Number,
    default: 0,
  },
})
const emit = defineEmits(['add-task', 'update:searchKeyword', 'go-task-list', 'open-task-detail','update:todayCount',])

const currentComponent = computed(() => {
  switch (props.activeKey) {
    case 'dashboard':
      return Dashboard
    case 'today':
      return Today
    case 'taskList':
      return TaskList
    case 'finished':
      return Finished
    default:
      return Dashboard
  }
})
</script>

<template>
  <section class="main-content">
    <component
      :is="currentComponent"
      :active-project="activeProject"
      :search-keyword="searchKeyword"
      :today-refresh-key="todayRefreshKey"
      :dashboard-refresh-key="dashboardRefreshKey"
      :task-list-refresh-key="taskListRefreshKey"
      @update:searchKeyword="emit('update:searchKeyword', $event)"
      @update:todayCount="emit('update:todayCount', $event)"
      @go-task-list="emit('go-task-list')"
      @add-task="emit('add-task')"
      @open-task-detail="emit('open-task-detail', $event)"
    />
  </section>
</template>

<style scoped>
.main-content {
  flex: 1;
  min-width: 0;
  background: #f5f7fb;
}
</style>