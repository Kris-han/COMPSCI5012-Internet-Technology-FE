<template>
  <div class="finished">
    <div class="finished__header">
      <div>
        <div class="finished__title">Finished</div>
        <div class="finished__sub">{{ tasks.length }} 个任务</div>
      </div>
    </div>

    <div class="finished__content">
      <el-skeleton v-if="loading" :rows="4" animated />
      <el-empty v-else-if="tasks.length === 0" description="暂无已完成任务" />
      <TaskItem
        v-else
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @updated="loadTasks"
        @deleted="loadTasks"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getTaskList } from '../api/task'
import TaskItem from '../components/TaskItem.vue'

const tasks = ref([])
const loading = ref(false)

async function loadTasks() {
  loading.value = true
  try {
    const res = await getTaskList({ date: 'completed' })
    tasks.value = res.data.data
  } catch (err) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTasks()
})
</script>

<style scoped>
.finished {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.finished__header {
  height: 56px;
  flex: 0 0 56px;
  display: flex;
  align-items: center;
  padding: 0 18px;
  border-bottom: 1px solid var(--el-border-color);
}
.finished__title {
  font-size: 18px;
  font-weight: 700;
}
.finished__sub {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 2px;
}
.finished__content {
  flex: 1;
  overflow: auto;
  padding: 18px;
}
</style>