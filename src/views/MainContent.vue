<template>
  <div class="main">
    <!-- Header -->
    <div class="main__header">
      <div class="main__header-left">
        <div class="main__title">今天</div>
        <div class="main__sub">2 个任务</div>
      </div>

      <div class="main__header-right">
        <el-button size="small" :icon="Search">搜索</el-button>
        <el-button size="small" :icon="Sort">排序</el-button>
        <el-button size="small" :icon="Grid">布局</el-button>
      </div>
    </div>

    <!-- Content area -->
    <div class="main__content">
      <el-empty description="下一步：在这里放 TaskList / TaskItem" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search, Sort, Grid } from "@element-plus/icons-vue"
</script>

<style scoped>
.main {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Header fixed */
.main__header {
  height: 56px;
  flex: 0 0 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 18px;
  border-bottom: 1px solid var(--el-border-color);
}

.main__header-left {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.main__title {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.1;
}

.main__sub {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 2px;
}

.main__header-right {
  display: flex;
  gap: 8px;
}

/* Scrollable content */
.main__content {
  flex: 1 1 auto;
  overflow: auto;
  padding: 18px;
  box-sizing: border-box;
}
</style>