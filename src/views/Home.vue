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
      <TodayView v-if="activeKey === 'today'" v-model:showAdd="showAdd" @count-change="todayCount = $event" />
      <TaskListView v-else-if="activeKey === 'upcoming'" :key="taskListKey" v-model:showAdd="showAdd" />
      <FinishedView v-else-if="activeKey === 'completed'" />
    </main>

    <AddTaskDialog v-model:visible="showAdd" @created="onTaskCreated" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import SidebarMenu from "./SidebarMenu.vue"
import TodayView from "./TodayView.vue"
import TaskListView from "./TaskListView.vue"
import FinishedView from "./FinishedView.vue"
import AddTaskDialog from "../components/AddTaskDialog.vue"

const activeKey = ref("today")
const activeProject = ref("guide")
const collapsed = ref(false)
const showAdd = ref(false)
const todayCount = ref(0)
const taskListKey = ref(0)

function onTaskCreated() {
  taskListKey.value++
  activeKey.value = 'upcoming'
}
</script>

<style scoped>
.home {
  display: flex;
  height: 100vh;
}

.main {
  flex: 1;
  padding: 16px;
  overflow: hidden;
  box-sizing: border-box;
}
</style>
