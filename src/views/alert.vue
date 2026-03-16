<template>
  <div 
    v-if="show" 
    class="alert alert-dismissible fade show position-fixed top-3 end-3 z-50"
    :class="`alert-${type}`"
    role="alert"
  >
    {{ message }}
    <button 
      type="button" 
      class="btn-close" 
      aria-label="Close"
      @click="closeAlert"
    ></button>
  </div>
</template>

<script setup>
import { defineProps, emit } from 'vue'

// 接收 props：消息类型、内容、显示状态
const props = defineProps({
  type: {
    type: String,
    default: 'success' // success/error/warning/info
  },
  message: {
    type: String,
    required: true
  },
  show: {
    type: Boolean,
    default: false
  }
})

// 关闭消息提示
const emit = defineEmits(['close'])
const closeAlert = () => {
  emit('close')
}
</script>