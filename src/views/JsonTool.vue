<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between p-4 flex-shrink-0">
      <div>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">JSON工具</h1>
      </div>

      <!-- 操作按钮 -->
      <div class="flex flex-wrap gap-2">
        <Button @click="formatJson" :disabled="!jsonInput.trim()" size="sm">
          格式化
        </Button>
        <Button @click="compressJson" variant="secondary" :disabled="!jsonInput.trim()" size="sm">
          压缩
        </Button>
        <Button @click="validateJson" variant="outline" :disabled="!jsonInput.trim()" size="sm">
          验证
        </Button>
        <Button @click="clearInput" variant="ghost" size="sm">
          清空
        </Button>
        <Button @click="copyResult" variant="outline" :disabled="!jsonOutput" size="sm">
          复制结果
        </Button>
        <Button
          @click="toggleSyncScroll"
          :variant="syncScroll ? 'default' : 'outline'"
          size="sm"
          class="flex items-center gap-1"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
          </svg>
          {{ syncScroll ? '同步滚动' : '独立滚动' }}
        </Button>
      </div>
    </div>



    <!-- 左右分栏布局 -->
    <div class="flex-1 flex flex-col lg:flex-row gap-4 px-4 pb-4 min-h-0">
      <!-- 左侧：输入区域 -->
      <div class="flex-1 flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md min-h-0">
        <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">输入JSON</h3>
        </div>
        <div class="flex-1 min-h-0">
          <textarea
            ref="leftScrollRef"
            v-model="jsonInput"
            @input="onInputChange"
            @scroll="onLeftScroll"
            placeholder="请输入..."
            class="w-full h-full p-4 border-0 resize-none focus:outline-none bg-transparent text-sm font-mono text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 leading-6"
            :class="{ 'text-red-600 dark:text-red-400': validationError }"
          />
        </div>
      </div>

      <!-- 右侧：预览区域 -->
      <div ref="rightScrollRef" class="flex-1 flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md min-h-0">
        <JsonViewer :json-string="jsonInput" @scroll="onRightScroll" />
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Button from '@/components/ui/Button.vue'
import JsonViewer from '@/components/ui/JsonViewer.vue'
import { formatJson as formatJsonUtil, compressJson as compressJsonUtil, validateJson as validateJsonUtil } from '@/utils/json'
import { useToast } from '@/composables/useToast'

// Toast通知
const { success, error } = useToast()

// 格式化相关
const jsonInput = ref('')
const jsonOutput = ref('')
const validationError = ref('')

// 滚动同步相关
const syncScroll = ref(true)
const leftScrollRef = ref<HTMLTextAreaElement>()
const rightScrollRef = ref<HTMLElement>()
const isScrolling = ref(false)

// 实时预览 - 监听输入变化
watch(jsonInput, (newValue) => {
  if (newValue.trim()) {
    try {
      // 自动格式化预览
      jsonOutput.value = formatJsonUtil(newValue, { indent: 2, sortKeys: false })
      validationError.value = ''
    } catch (error) {
      // 如果格式化失败，显示原始输入
      jsonOutput.value = ''
      validationError.value = error instanceof Error ? error.message : '格式错误'
    }
  } else {
    jsonOutput.value = ''
    validationError.value = ''
  }
}, { immediate: true })

// 输入变化处理
const onInputChange = () => {
  // watch已经处理了实时预览，这里可以添加其他逻辑
}

// 格式化JSON
const formatJson = () => {
  try {
    validationError.value = ''
    jsonOutput.value = formatJsonUtil(jsonInput.value, { indent: 2, sortKeys: false })
  } catch (error) {
    validationError.value = error instanceof Error ? error.message : '格式化失败'
    jsonOutput.value = ''
  }
}

// 压缩JSON
const compressJson = () => {
  try {
    validationError.value = ''
    jsonOutput.value = compressJsonUtil(jsonInput.value)
  } catch (error) {
    validationError.value = error instanceof Error ? error.message : '压缩失败'
    jsonOutput.value = ''
  }
}

// 验证JSON
const validateJson = () => {
  const result = validateJsonUtil(jsonInput.value)

  if (result.valid) {
    success('JSON格式正确')
    validationError.value = ''
  } else {
    error(`JSON格式错误: ${result.error || '验证失败'}`)
    validationError.value = result.error || '验证失败'
  }
}

// 清空输入
const clearInput = () => {
  jsonInput.value = ''
  jsonOutput.value = ''
  validationError.value = ''
}

// 复制结果
const copyResult = async () => {
  if (jsonOutput.value) {
    try {
      await navigator.clipboard.writeText(jsonOutput.value)
      success('复制成功')
    } catch (err) {
      console.error('复制失败:', err)
      error('复制失败')
    }
  }
}

// 切换同步滚动
const toggleSyncScroll = () => {
  syncScroll.value = !syncScroll.value
}

// 左侧滚动处理
const onLeftScroll = (event: Event) => {
  if (!syncScroll.value || isScrolling.value) return

  const target = event.target as HTMLTextAreaElement
  const maxScroll = target.scrollHeight - target.clientHeight

  if (maxScroll <= 0) return

  const scrollRatio = target.scrollTop / maxScroll

  if (rightScrollRef.value && !isNaN(scrollRatio) && isFinite(scrollRatio)) {
    isScrolling.value = true
    const rightScrollContainer = rightScrollRef.value.querySelector('.overflow-auto')
    if (rightScrollContainer) {
      const rightMaxScroll = rightScrollContainer.scrollHeight - rightScrollContainer.clientHeight
      if (rightMaxScroll > 0) {
        rightScrollContainer.scrollTop = scrollRatio * rightMaxScroll
      }
    }
    setTimeout(() => {
      isScrolling.value = false
    }, 50)
  }
}

// 右侧滚动处理
const onRightScroll = (scrollTop: number, scrollHeight: number, clientHeight: number) => {
  if (!syncScroll.value || isScrolling.value) return

  const maxScroll = scrollHeight - clientHeight

  if (maxScroll <= 0) return

  const scrollRatio = scrollTop / maxScroll

  if (leftScrollRef.value && !isNaN(scrollRatio) && isFinite(scrollRatio)) {
    isScrolling.value = true
    const leftMaxScroll = leftScrollRef.value.scrollHeight - leftScrollRef.value.clientHeight
    if (leftMaxScroll > 0) {
      leftScrollRef.value.scrollTop = scrollRatio * leftMaxScroll
    }
    setTimeout(() => {
      isScrolling.value = false
    }, 50)
  }
}


</script>
