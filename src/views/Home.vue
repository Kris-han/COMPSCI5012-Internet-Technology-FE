<script setup>
import { ref } from 'vue'
import SidebarMenu from './SidebarMenu.vue'
import MainContent from './MainContent.vue'

const activeKey = ref('today')
const activeProject = ref('guide')
const collapsed = ref(false)
</script>

<template>
  <div class="home">
    <SidebarMenu
      v-model:activeKey="activeKey"
      v-model:activeProject="activeProject"
      v-model:collapsed="collapsed"
    />

    <main class="main">
      <MainContent
        :active-key="activeKey"
        :active-project="activeProject"
      />
    </main>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  min-height: 100vh;
  background: #f7f8fa;
}

.main {
  flex: 1;
  min-width: 0;
  overflow: auto;
}
</style>