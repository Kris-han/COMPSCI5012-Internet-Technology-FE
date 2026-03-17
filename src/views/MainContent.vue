<script setup>
import { computed } from 'vue'
import Dashboard from './Dashboard.vue'
import Today from './Today.vue'
import TaskList from './TaskList.vue'
import Finished from './Finished.vue'

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