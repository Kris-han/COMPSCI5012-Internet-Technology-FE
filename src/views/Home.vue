<template>
  <div class="home">
    <SidebarMenu
      v-model:activeKey="activeKey"
      v-model:activeProject="activeProject"
      v-model:collapsed="collapsed"
    />

    <main class="main">
      <h2>当前页面：{{ activeKey }}</h2>
      <!-- 这里根据 activeKey 切换你的右侧内容组件 -->
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import SidebarMenu from "./SidebarMenu.vue"

const activeKey = ref("today")
const activeProject = ref("guide")
const collapsed = ref(false)
</script>

<style scoped>
.home {
  display: flex;
  height: 100vh;
}

.main {
  flex: 1;
  padding: 16px;
}
</style>