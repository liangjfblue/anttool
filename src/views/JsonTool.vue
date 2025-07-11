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
      </div>
    </div>

    <!-- 验证结果 -->
    <div v-if="validationResult" class="mx-4 mb-4 p-4 rounded-md flex-shrink-0" :class="validationResult.valid ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'">
      <div class="flex">
        <CheckCircleIcon v-if="validationResult.valid" class="h-5 w-5 text-green-400" />
        <XCircleIcon v-else class="h-5 w-5 text-red-400" />
        <div class="ml-3">
          <p class="text-sm font-medium" :class="validationResult.valid ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'">
            {{ validationResult.valid ? 'JSON格式正确' : 'JSON格式错误' }}
          </p>
          <p v-if="!validationResult.valid" class="mt-1 text-sm" :class="'text-red-700 dark:text-red-300'">
            {{ validationResult.error }}
          </p>
        </div>
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
            v-model="jsonInput"
            @input="onInputChange"
            placeholder="请输入..."
            class="w-full h-full p-4 border-0 resize-none focus:outline-none bg-transparent text-sm font-mono text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 leading-6"
            :class="{ 'text-red-600 dark:text-red-400': validationError }"
          />
        </div>
      </div>

      <!-- 右侧：预览区域 -->
      <div class="flex-1 flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md min-h-0">
        <JsonViewer :json-string="jsonInput" />
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { CheckCircleIcon, XCircleIcon, DocumentTextIcon } from '@heroicons/vue/24/outline'
import Button from '@/components/ui/Button.vue'
import JsonViewer from '@/components/ui/JsonViewer.vue'
import { formatJson as formatJsonUtil, compressJson as compressJsonUtil, validateJson as validateJsonUtil } from '@/utils/json'

// 格式化相关
const jsonInput = ref('')
const jsonOutput = ref('')
const validationError = ref('')
const validationResult = ref<{ valid: boolean; error?: string } | null>(null)

// 实时预览 - 监听输入变化
watch(jsonInput, (newValue) => {
  if (newValue.trim()) {
    try {
      // 自动格式化预览
      jsonOutput.value = formatJsonUtil(newValue, { indent: 2, sortKeys: false })
      validationError.value = ''
      validationResult.value = { valid: true }
    } catch (error) {
      // 如果格式化失败，显示原始输入
      jsonOutput.value = ''
      validationError.value = error instanceof Error ? error.message : '格式错误'
      validationResult.value = { valid: false, error: validationError.value }
    }
  } else {
    jsonOutput.value = ''
    validationError.value = ''
    validationResult.value = null
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
    validationResult.value = null
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
    validationResult.value = null
    jsonOutput.value = compressJsonUtil(jsonInput.value)
  } catch (error) {
    validationError.value = error instanceof Error ? error.message : '压缩失败'
    jsonOutput.value = ''
  }
}

// 验证JSON
const validateJson = () => {
  validationResult.value = validateJsonUtil(jsonInput.value)
  if (!validationResult.value.valid) {
    validationError.value = validationResult.value.error || '验证失败'
  } else {
    validationError.value = ''
  }
}

// 清空输入
const clearInput = () => {
  jsonInput.value = ''
  jsonOutput.value = ''
  validationError.value = ''
  validationResult.value = null
}

// 复制结果
const copyResult = async () => {
  if (jsonOutput.value) {
    try {
      await navigator.clipboard.writeText(jsonOutput.value)
      // 这里可以添加成功提示
    } catch (error) {
      console.error('复制失败:', error)
    }
  }
}


</script>
