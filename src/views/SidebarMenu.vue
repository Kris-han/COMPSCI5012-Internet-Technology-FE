<template>
  <aside class="sidebar" :class="{ 'is-collapsed': collapsed }">
    <!-- Header -->
    <div class="sidebar_header">
      <el-avatar :size="28">韩</el-avatar>

      <div v-if="!collapsed" class="sidebar_title">
        <div class="sidebar_name">chris</div>
        <div class="sidebar_sub">个人工作区</div>
      </div>

      <div class="sidebar_actions">
        <el-button circle size="small" :icon="Bell" aria-label="Notifications" />
        <el-button circle size="small" :icon="MoreFilled" aria-label="More options" />
        <el-button
          circle
          size="small"
          class="collapse_btn"
          :icon="collapsed ? Expand : Fold"
          :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
          @click="$emit('update:collapsed', !collapsed)"
        />
      </div>
    </div>

    <!-- Add -->
    <el-button
      v-if="!collapsed"
      class="sidebar_add"
      type="danger"
      plain
      :icon="Plus"
      @click="$emit('add-task')"
    >
      Add New Task
    </el-button>

    <!-- Search -->
    <el-input
      v-if="!collapsed"
      class="sidebar_search"
      :model-value="searchKeyword"
      placeholder="Search"
      :prefix-icon="Search"
      clearable
      @input="handleSidebarSearch"
    />

    <!-- Menu -->
    <el-menu
      class="sidebar_menu"
      :default-active="activeKey"
      @select="onSelect"
    >
      <el-menu-item index="dashboard">
        <el-icon><Message /></el-icon>
        <span v-if="!collapsed" class="menu_text">Dashboard</span>
      </el-menu-item>

      <el-menu-item index="today">
        <el-icon><Calendar /></el-icon>
        <span v-if="!collapsed" class="menu_text">Today</span>

        <!-- Badge：用一个容器固定在右侧，并且垂直居中 -->
        <span v-if="!collapsed" class="menu_right">
          <el-badge :value="todayCount" class="sidebar_badge" />
        </span>
      </el-menu-item>

      <el-menu-item index="taskList">
        <el-icon><Clock /></el-icon>
        <span v-if="!collapsed" class="menu_text">TaskList</span>
      </el-menu-item>

      <el-menu-item index="finished">
        <el-icon><CircleCheck /></el-icon>
        <span v-if="!collapsed" class="menu_text">Finished</span>
      </el-menu-item>
    </el-menu>

    <!-- Footer -->
    <div v-if="!collapsed" class="sidebar_footer">
      <el-button text :icon="SwitchButton" @click="handleLogoutClick">
        Log out
      </el-button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import {
  Plus,
  Search,
  Bell,
  MoreFilled,
  Message,
  Calendar,
  Clock,
  CircleCheck,
  Document,
  SwitchButton,
  Fold,
  Expand,
} from "@element-plus/icons-vue"

const props = defineProps<{
  activeKey: string
  activeProject?: string
  collapsed?: boolean
  todayCount?: number
  searchKeyword?: string
}>()

const emit = defineEmits<{
  (e: "update:activeKey", v: string): void
  (e: "update:collapsed", v: boolean): void
  (e: "update:activeProject", v: string): void
  (e: "update:searchKeyword", v: string): void
  (e: "add-task"): void
  (e: "logout"): void
}>()

function handleSidebarSearch(value: string) {
  emit("update:searchKeyword", value)
}

function onSelect(key: string) {
  emit("update:activeKey", key)
}
function handleLogoutClick() {
  emit("logout")
}

function onSelectProject(key: string) {
  emit("update:activeProject", key)
}
</script>

<style scoped>
/* Layout */
.sidebar {
  width: 280px;
  min-width: 280px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 12px;
  box-sizing: border-box;
  border-right: 1px solid var(--el-border-color);
  background: var(--el-bg-color);
}

.sidebar.is-collapsed {
  width: 64px;
  min-width: 64px;
  padding: 12px 10px;
}

/* Header */
.sidebar_header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.sidebar_title {
  flex: 1 1 auto;
  min-width: 0;
}

.sidebar_name {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.2;
}

.sidebar_sub {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 2px;
}

.sidebar_actions {
  display: flex;
  gap: 6px;
}

.collapse_btn {
  margin-left: 2px;
}

/* Add/Search */
.sidebar_add {
  width: 100%;
  margin: 6px 0 12px;
}
.sidebar_search {
  margin-bottom: 10px;
}

/* Menu base */
.sidebar_menu {
  border-right: none;
  background: transparent;
}

/* ✅ 核心：强制 el-menu-item 为 flex 并垂直居中 */
.sidebar_menu :deep(.el-menu-item) {
  display: flex;
  align-items: center;
  gap: 10px;

  height: 40px;
  line-height: 40px;
  border-radius: 10px;
  margin: 4px 0;

  /* 让内容不要挤压 */
  padding: 0 10px !important;
}

/* icon对齐和宽度一致，看起来更工整 */
.sidebar_menu :deep(.el-menu-item .el-icon) {
  width: 18px;
  font-size: 18px;
  flex: 0 0 auto;
}

/* 文本不换行 */
.menu_text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ✅ 右侧容器：把 badge/计数永远推到最右，并保持居中 */
.menu_right {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
}

/* hover 更像产品 */
.sidebar_menu :deep(.el-menu-item:hover) {
  background: var(--el-fill-color-light);
}

/* active 状态更明显 */
.sidebar_menu :deep(.el-menu-item.is-active) {
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

/* badge 微调（避免上下偏移） */
.sidebar_badge :deep(.el-badge__content) {
  transform: translateY(-10px);
}

/* Projects */
.sidebar_section {
  margin-top: 12px;
}
.sidebar_section-title {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin: 10px 0 6px;
}

.sidebar_count {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

/* Footer pinned */
.sidebar_footer {
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid var(--el-border-color);
  display: flex;
  flex-direction: column;
  gap: 6px;
}
</style>