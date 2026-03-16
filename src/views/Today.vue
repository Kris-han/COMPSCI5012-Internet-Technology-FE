<template>
  <div class="page">
    <h1 class="page__title">Today</h1>
    <p class="page__sub">Focus on the most important tasks for today</p>

    <div class="panel">
      <p>这里是 Today 页面内容。</p>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 24px;
  min-height: 100vh;
  box-sizing: border-box;
}
.page__title {
  margin: 0;
  font-size: 30px;
  font-weight: 700;
  color: #111827;
}
.page__sub {
  margin: 8px 0 24px;
  color: #6b7280;
}
.panel {
  background: #fff;
  border-radius: 18px;
  padding: 24px;
}
</style>