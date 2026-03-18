<script setup>
import { ref, onMounted } from 'vue'
import { RefreshRight } from '@element-plus/icons-vue'
import { fetchDailyQuote, fetchRandomQuote } from '@/api/thirdParty'

const loading = ref(false)
const quote = ref('')
const author = ref('')
const error = ref('')

const loadDailyQuote = async () => {
  loading.value = true
  error.value = ''

  try {
    const res = await fetchDailyQuote()
    const result = res?.data

    if (result?.code === 0 || result?.success === true) {
      quote.value = result.data?.quote || ''
      author.value = result.data?.author || 'Unknown'
    } else {
      error.value = result?.message || 'Failed to load daily quote.'
    }
  } catch (err) {
    error.value =
      err?.response?.data?.message ||
      err?.message ||
      'Failed to load daily quote.'
  } finally {
    loading.value = false
  }
}

const loadRandomQuote = async () => {
  loading.value = true
  error.value = ''

  try {
    const res = await fetchRandomQuote()
    const result = res?.data

    if (result?.code === 0 || result?.success === true) {
      quote.value = result.data?.quote || ''
      author.value = result.data?.author || 'Unknown'
    } else {
      error.value = result?.message || 'Failed to load random quote.'
    }
  } catch (err) {
    error.value =
      err?.response?.data?.message ||
      err?.message ||
      'Failed to load random quote.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDailyQuote()
})
</script>

<template>
  <section class="quote-panel">
    <div class="quote-header">
      <div>
        <div class="quote-label">DAILY INSPIRATION</div>
        <h3 class="quote-title">Quote of the Day</h3>
      </div>

      <el-button
        class="quote-refresh-btn"
        type="primary"
        plain
        :icon="RefreshRight"
        :loading="loading"
        @click="loadRandomQuote"
      >
        Random Quote
      </el-button>
    </div>

    <div v-if="loading" class="quote-state">
      Loading quote...
    </div>

    <div v-else-if="error" class="quote-state quote-error">
      {{ error }}
    </div>

    <div v-else class="quote-body">
      <p class="quote-text">
        “{{ quote || 'No quote available.' }}”
      </p>
      <p class="quote-author">
        — {{ author || 'Unknown' }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.quote-panel {
  background: #ffffff;
  border: 1px solid #e9eef5;
  border-radius: 18px;
  padding: 22px 24px;
  margin-bottom: 24px;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.04);
}

.quote-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.quote-label {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #94a3b8;
  margin-bottom: 6px;
}

.quote-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
}

.quote-refresh-btn {
  border-radius: 10px;
}

.quote-state {
  font-size: 14px;
  color: #64748b;
}

.quote-error {
  color: #ef4444;
}

.quote-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.quote-text {
  margin: 0;
  font-size: 18px;
  line-height: 1.8;
  color: #1e293b;
  font-style: italic;
}

.quote-author {
  margin: 0;
  font-size: 14px;
  color: #64748b;
  font-weight: 600;
}

@media (max-width: 768px) {
  .quote-header {
    flex-direction: column;
    align-items: stretch;
  }

  .quote-title {
    font-size: 20px;
  }

  .quote-text {
    font-size: 16px;
  }
}
</style>