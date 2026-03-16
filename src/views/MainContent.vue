<script setup>
import { computed } from 'vue'
import Dashboard from './Dashboard.vue'
import Today from './Today.vue'
import TaskList from './TaskList.vue'
import Finished from './Finished.vue'

const props = defineProps({
  activeKey: {
    type: String,
    default: 'today',
  },
  activeProject: {
    type: String,
    default: '',
  },
})

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