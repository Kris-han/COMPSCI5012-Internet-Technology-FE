<script setup>
import { ref } from 'vue'
import SidebarMenu from './SidebarMenu.vue'
import MainContent from './MainContent.vue'
import AddTaskDialog from '../../src/components/AddTaskDialog.vue'

const activeKey = ref('dashboard')
const activeProject = ref('guide')
const collapsed = ref(false)

const showAdd = ref(false)
const todayCount = ref(0)

const onTaskCreated = () => {
  showAdd.value = false
  // 后面这里可以加刷新逻辑
}
</script>

<template>
  <div class="home">
    <SidebarMenu
      v-model:activeKey="activeKey"
      v-model:activeProject="activeProject"
      v-model:collapsed="collapsed"
      :todayCount="todayCount"
      @add-task="showAdd = true"
    />

    <main class="main">
      <MainContent
        :active-key="activeKey"
        :active-project="activeProject"
      />
    </main>

    <AddTaskDialog
      v-model:visible="showAdd"
      @created="onTaskCreated"
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