<template>
  <div class="tasklist">
    <div class="tasklist__header">
      <div>
        <div class="tasklist__title">TaskList</div>
        <div class="tasklist__sub">{{ tasks.length }} 个任务</div>
      </div>
      <el-button type="danger" plain :icon="Plus" @click="showAdd = true">添加任务</el-button>
    </div>

    <div class="tasklist__content">
      <el-skeleton v-if="loading" :rows="4" animated />
      <el-empty v-else-if="tasks.length === 0" description="暂无任务" />
      <TaskItem
        v-else
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @updated="loadTasks"
        @deleted="loadTasks"
      />
    </div>

    <AddTaskDialog v-model:visible="showAdd" @created="loadTasks" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getTaskList } from '../api/task'
import TaskItem from '../components/TaskItem.vue'
import AddTaskDialog from '../components/AddTaskDialog.vue'

const tasks = ref([])
const loading = ref(false)
const showAdd = defineModel<boolean>('showAdd', { default: false })

async function loadTasks() {
  loading.value = true
  try {
    const res = await getTaskList()
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
.tasklist {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.tasklist__header {
  height: 56px;
  flex: 0 0 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
  border-bottom: 1px solid var(--el-border-color);
}
.tasklist__title {
  font-size: 18px;
  font-weight: 700;
}
.tasklist__sub {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 2px;
}
.tasklist__content {
  flex: 1;
  overflow: auto;
  padding: 18px;
}
</style>