<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { fetchDashboardData } from '@/api/dashboard'

const loading = ref(false)
const props = defineProps({
  dashboardRefreshKey: {
    type: Number,
    default: 0,
  },
})
const emit = defineEmits(['add-task'])
const dashboardData = ref({
  summary: {
    total_tasks: 0,
    completed: 0,
    in_progress: 0,
    postponed: 0,
  },
  due_stats: {
    within_24_hours: 0,
    within_7_days: 0,
    within_14_days: 0,
    within_month: 0,
  },
  status_stats: {
    completed: 0,
    in_progress: 0,
    todo: 0,
    postponed: 0,
  },
  recent_summary: {
    completed_last_24_hours: 0,
    in_progress_now: 0,
    postponed_this_week: 0,
  },
})

const summaryCards = computed(() => [
  { label: 'Total Tasks', value: dashboardData.value.summary.total_tasks },
  { label: 'Completed', value: dashboardData.value.summary.completed },
  { label: 'In Progress', value: dashboardData.value.summary.in_progress },
  { label: 'Postponed', value: dashboardData.value.summary.postponed },
])

const timeStats = computed(() => [
  { label: '24 hours', value: dashboardData.value.due_stats.within_24_hours, color: '#EF4444' },
  { label: '7 days', value: dashboardData.value.due_stats.within_7_days, color: '#F97316' },
  { label: '14 days', value: dashboardData.value.due_stats.within_14_days, color: '#EAB308' },
  { label: 'month', value: dashboardData.value.due_stats.within_month, color: '#22C55E' },
])

const statusStats = computed(() => [
  { label: 'Completed', value: dashboardData.value.status_stats.completed, color: '#2563EB' },
  { label: 'In Progress', value: dashboardData.value.status_stats.in_progress, color: '#60A5FA' },
  { label: 'To Do', value: dashboardData.value.status_stats.todo, color: '#93C5FD' },
  { label: 'Postponed', value: dashboardData.value.status_stats.postponed, color: '#DBEAFE' },
])

const recentSummaryList = computed(() => [
  `${dashboardData.value.recent_summary.completed_last_24_hours} tasks were completed in the last 24 hours.`,
  `${dashboardData.value.recent_summary.in_progress_now} tasks are currently in progress.`,
  `${dashboardData.value.recent_summary.postponed_this_week} postponed task may need follow-up this week.`,
])

const maxTimeValue = computed(() => {
  const values = timeStats.value.map(item => item.value)
  return Math.max(...values, 1)
})

const getBarWidth = (value) => {
  return `${(value / maxTimeValue.value) * 100}%`
}

const donutStyle = computed(() => {
  const stats = statusStats.value
  const total = stats.reduce((sum, item) => sum + item.value, 0)

  if (!total) {
    return {
      background: 'conic-gradient(#E5E7EB 0% 100%)',
    }
  }

  let currentPercent = 0
  const parts = stats.map(item => {
    const start = currentPercent
    const end = currentPercent + (item.value / total) * 100
    currentPercent = end
    return `${item.color} ${start}% ${end}%`
  })

  return {
    background: `conic-gradient(${parts.join(', ')})`,
  }
})

const loadDashboardData = async () => {
  loading.value = true
  try {
    const res = await fetchDashboardData()
    if (res.code === 200) {
      dashboardData.value = res.data
      return
    }

    // 你的 http 封装如果返回 axios 原始响应
    if (res.data && res.data.code === 200) {
      dashboardData.value = res.data.data
    }
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  } finally {
    loading.value = false
  }
}
watch(
  () => props.dashboardRefreshKey,
  () => {
    loadDashboardData()
  }
)
onMounted(() => {
  loadDashboardData()
})
</script>

<template>
  <div class="dashboard-page" v-loading="loading">
    <div class="dashboard-topbar">
      <el-button type="primary" class="add-task-btn" :icon="Plus" @click="$emit('add-task')">
        Add New Task
      </el-button>

    </div>

    <div class="dashboard-main">
      <section class="summary-row">
        <div
          v-for="item in summaryCards"
          :key="item.label"
          class="summary-card"
        >
          <div class="summary-card__label">{{ item.label }}</div>
          <div class="summary-card__value">{{ item.value }}</div>
        </div>
      </section>

      <section class="chart-panel">
        <div class="panel-title">Task Count</div>

        <div class="bar-chart">
          <div
            v-for="item in timeStats"
            :key="item.label"
            class="bar-row"
          >
            <div class="bar-label">{{ item.label }}</div>

            <div class="bar-track">
              <div
                class="bar-fill"
                :style="{
                  width: getBarWidth(item.value),
                  background: item.color
                }"
              ></div>
            </div>

            <div class="bar-value">{{ item.value }}</div>
          </div>
        </div>

        <div class="chart-caption">task count</div>
      </section>

      <section class="overview-panel">
        <div class="panel-title">Task Overview</div>

        <div class="donut-wrap">
          <div class="donut-chart" :style="donutStyle"></div>

          <div class="donut-legend">
            <div
              v-for="item in statusStats"
              :key="item.label"
              class="legend-item"
            >
              <span class="legend-text">{{ item.label }} ({{ item.value }})</span>
              <span
                class="legend-color"
                :style="{ background: item.color }"
              ></span>
            </div>
          </div>
        </div>

        <div class="overview-caption">task overview</div>
      </section>

      <section class="notes-panel">
        <div class="panel-title">Recent Summary</div>
        <ul class="notes-list">
          <li v-for="(item, index) in recentSummaryList" :key="index">
            {{ item }}
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  background: #f5f7fb;
  padding: 24px;
  box-sizing: border-box;
}

.dashboard-topbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.add-task-btn {
  font-weight: 600;
}

.dashboard-main {
  background: #fff;
  border: 1px solid #dcdfe6;
  padding: 28px 28px 32px;
  box-sizing: border-box;
  min-height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* summary cards */
.summary-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.summary-card {
  border: 1px solid #dcdfe6;
  background: #fafafa;
  padding: 16px 18px;
  border-radius: 12px;
}

.summary-card__label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 10px;
}

.summary-card__value {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
}

/* panels */
.chart-panel,
.overview-panel,
.notes-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.panel-title {
  width: 100%;
  font-size: 16px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 18px;
  text-align: left;
}

/* bar chart */
.bar-chart {
  width: 100%;
  max-width: 560px;
}

.bar-row {
  display: grid;
  grid-template-columns: 100px 1fr 24px;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.bar-label {
  font-size: 16px;
  color: #303133;
  text-align: right;
}

.bar-track {
  height: 30px;
  border: 1px solid #D1D5DB;
  background:
    linear-gradient(to right, transparent 24.5%, #D1D5DB 25%, transparent 25.5%),
    linear-gradient(to right, transparent 49.5%, #D1D5DB 50%, transparent 50.5%),
    linear-gradient(to right, transparent 74.5%, #D1D5DB 75%, transparent 75.5%),
    #F8FAFC;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

.bar-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.bar-value {
  font-size: 16px;
  color: #303133;
  text-align: left;
}

.chart-caption {
  margin-top: 18px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

/* donut */
.donut-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 28px;
}

.donut-chart {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  position: relative;
  flex-shrink: 0;
}

.donut-chart::after {
  content: '';
  position: absolute;
  inset: 28px;
  border-radius: 50%;
  background: white;
}

.donut-legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-text {
  font-size: 14px;
  color: #303133;
}

.legend-color {
  width: 18px;
  height: 12px;
  border-radius: 2px;
  display: inline-block;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.overview-caption {
  margin-top: 20px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

/* notes */
.notes-panel {
  align-items: stretch;
  border: 1px solid #dcdfe6;
  background: #fafafa;
  padding: 20px;
  border-radius: 12px;
}

.notes-list {
  margin: 0;
  padding-left: 20px;
  color: #303133;
  line-height: 1.9;
  font-size: 14px;
}

@media (max-width: 900px) {
  .dashboard-page {
    padding: 16px;
  }

  .dashboard-main {
    padding: 20px 16px 24px;
    gap: 28px;
  }

  .summary-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .donut-wrap {
    flex-direction: column;
  }

  .bar-row {
    grid-template-columns: 90px 1fr 24px;
  }
}

@media (max-width: 640px) {
  .summary-row {
    grid-template-columns: 1fr;
  }

  .bar-row {
    grid-template-columns: 80px 1fr 24px;
    gap: 8px;
  }

  .bar-label {
    font-size: 14px;
  }
}
</style>