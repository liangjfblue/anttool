<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-2 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-2 scale-95"
    >
      <div
        v-if="visible"
        class="fixed top-4 right-4 z-50 max-w-sm w-full"
      >
        <div
          class="rounded-lg shadow-lg p-4 flex items-center space-x-3"
          :class="toastClasses"
        >
          <!-- 图标 -->
          <div class="flex-shrink-0">
            <CheckCircleIcon v-if="type === 'success'" class="h-5 w-5" />
            <XCircleIcon v-else-if="type === 'error'" class="h-5 w-5" />
            <InformationCircleIcon v-else-if="type === 'info'" class="h-5 w-5" />
            <ExclamationTriangleIcon v-else-if="type === 'warning'" class="h-5 w-5" />
          </div>
          
          <!-- 消息内容 -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium" :class="textClasses">
              {{ message }}
            </p>
          </div>
          
          <!-- 关闭按钮 -->
          <button
            @click="close"
            class="flex-shrink-0 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
            :class="closeButtonClasses"
          >
            <XMarkIcon class="h-4 w-4" />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

export interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
  onClose?: () => void
}

const props = withDefaults(defineProps<ToastProps>(), {
  type: 'info',
  duration: 3000
})

const visible = ref(false)
let timer: NodeJS.Timeout | null = null

// 计算样式类
const toastClasses = computed(() => {
  const baseClasses = 'border'
  
  switch (props.type) {
    case 'success':
      return `${baseClasses} bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800`
    case 'error':
      return `${baseClasses} bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800`
    case 'warning':
      return `${baseClasses} bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800`
    case 'info':
    default:
      return `${baseClasses} bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800`
  }
})

const textClasses = computed(() => {
  switch (props.type) {
    case 'success':
      return 'text-green-800 dark:text-green-200'
    case 'error':
      return 'text-red-800 dark:text-red-200'
    case 'warning':
      return 'text-yellow-800 dark:text-yellow-200'
    case 'info':
    default:
      return 'text-blue-800 dark:text-blue-200'
  }
})

const closeButtonClasses = computed(() => {
  switch (props.type) {
    case 'success':
      return 'text-green-400 hover:text-green-600 dark:text-green-300 dark:hover:text-green-100 focus:ring-green-500'
    case 'error':
      return 'text-red-400 hover:text-red-600 dark:text-red-300 dark:hover:text-red-100 focus:ring-red-500'
    case 'warning':
      return 'text-yellow-400 hover:text-yellow-600 dark:text-yellow-300 dark:hover:text-yellow-100 focus:ring-yellow-500'
    case 'info':
    default:
      return 'text-blue-400 hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-100 focus:ring-blue-500'
  }
})

// 关闭Toast
const close = () => {
  visible.value = false
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  props.onClose?.()
}

// 组件挂载时显示Toast
onMounted(() => {
  visible.value = true
  
  // 设置自动关闭定时器
  if (props.duration > 0) {
    timer = setTimeout(() => {
      close()
    }, props.duration)
  }
})

// 组件卸载时清理定时器
import { onUnmounted } from 'vue'
onUnmounted(() => {
  if (timer) {
    clearTimeout(timer)
  }
})
</script>
