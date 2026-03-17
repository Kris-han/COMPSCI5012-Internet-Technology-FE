<script setup></script>

<template>
  <router-view />
</template>

<style>
:root {
  --el-text-color-secondary: #595959;
}

/* Fix el-tag contrast */
.el-tag--success { color: #1a6600 !important; }
.el-tag--warning { color: #7a4a00 !important; }
.el-tag--danger  { color: #8b0000 !important; }
.el-tag--info    { color: #3d3d3d !important; }

/* Fix sidebar secondary text */
.sidebar_sub { color: #595959 !important; }

/* Fix plain danger button (Add New Task in sidebar) */
.el-button--danger.is-plain { color: #8b0000 !important; }

/* Fix active menu item text (blue on light blue fails) */
.el-menu-item.is-active { color: #1a56a0 !important; }

/* Fix primary button (white on #409eff = 2.7:1, fails) */
.el-button--primary { background-color: #1a6dd3 !important; border-color: #1a6dd3 !important; }
</style>
