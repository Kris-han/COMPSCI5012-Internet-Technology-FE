<script setup>
import { Plus } from '@element-plus/icons-vue'

const timeStats = [
  { label: '24 hours', value: 1, color: '#EF4444' },
  { label: '7 days', value: 2, color: '#F97316' },
  { label: '14 days', value: 3, color: '#EAB308' },
  { label: 'month', value: 4, color: '#22C55E' },
]

const statusStats = [
  { label: 'Completed', color: '#2563EB' },
  { label: 'In Progress', color: '#60A5FA' },
  { label: 'To Do', color: '#93C5FD' },
  { label: 'Postponed', color: '#DBEAFE' },
]

const summaryCards = [
  { label: 'Total Tasks', value: 10 },
  { label: 'Completed', value: 3 },
  { label: 'In Progress', value: 2 },
  { label: 'Postponed', value: 1 },
]
</script>

<template>
  <div class="dashboard-page">
    <div class="dashboard-topbar">
      <el-button type="primary" class="add-task-btn" :icon="Plus">
        Add New Task
      </el-button>
    </div>

    <div class="dashboard-main">
      <!-- 顶部统计卡片 -->
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

      <!-- task count -->
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
                    width: `${item.value * 25}%`,
                    background: item.color
                  }"
                ></div>
            </div>

            <div class="bar-value">{{ item.value }}</div>
          </div>
        </div>

        <div class="chart-caption">task count</div>
      </section>

      <!-- task overview -->
      <section class="overview-panel">
        <div class="panel-title">Task Overview</div>

        <div class="donut-wrap">
          <div class="donut-chart"></div>

          <div class="donut-legend">
            <div
              v-for="item in statusStats"
              :key="item.label"
              class="legend-item"
            >
              <span class="legend-text">{{ item.label }}</span>
              <span
                class="legend-color"
                :style="{ background: item.color }"
              ></span>
            </div>
          </div>
        </div>

        <div class="overview-caption">task overview</div>
      </section>

      <!-- 底部说明 -->
      <section class="notes-panel">
        <div class="panel-title">Recent Summary</div>
        <ul class="notes-list">
          <li>2 tasks were completed in the last 24 hours.</li>
          <li>3 tasks are currently in progress.</li>
          <li>1 postponed task may need follow-up this week.</li>
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
}

.bar-fill {
  height: 100%;
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
  background: conic-gradient(
    #2563EB 0% 25%,
    #60A5FA 25% 55%,
    #93C5FD 55% 75%,
    #DBEAFE 75% 100%
  );
  position: relative;
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
}
</style>