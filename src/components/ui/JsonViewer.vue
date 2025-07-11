<template>
  <div class="json-viewer flex-1 flex flex-col min-h-0">
    <!-- 工具栏 -->
    <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <div class="flex items-center space-x-2">
        <button
          @click="toggleLineNumbers"
          class="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {{ showLineNumbers ? '隐藏行号' : '显示行号' }}
        </button>
        <button
          @click="expandAll"
          class="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          全部展开
        </button>
        <button
          @click="collapseAll"
          class="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          全部折叠
        </button>
      </div>
      <div class="text-xs text-gray-500 dark:text-gray-400">
        {{ jsonData ? `${getObjectSize(jsonData)} 项` : '' }}
      </div>
    </div>

    <!-- JSON内容 -->
    <div class="flex-1 overflow-auto bg-white dark:bg-gray-900 min-h-0">
      <div v-if="jsonData" class="flex min-h-full">
        <!-- 行号 -->
        <div
          v-if="showLineNumbers"
          class="flex-shrink-0 px-2 py-4 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 text-xs font-mono text-gray-500 dark:text-gray-400 select-none"
        >
          <div v-for="n in totalLines" :key="n" class="leading-6 text-right min-w-[2rem]">
            {{ n }}
          </div>
        </div>

        <!-- JSON树 -->
        <div class="flex-1 p-4 min-w-0">
          <JsonNode
            :data="jsonData"
            :path="''"
            :level="0"
            :expanded-paths="expandedPaths"
            @toggle="togglePath"
          />
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-else class="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div class="text-center">
          <DocumentTextIcon class="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p class="text-lg">在左侧输入JSON即可实时预览</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { DocumentTextIcon } from '@heroicons/vue/24/outline'
import JsonNode from './JsonNode.vue'

interface Props {
  jsonString: string
}

const props = defineProps<Props>()

const jsonData = ref<any>(null)
const showLineNumbers = ref(true)
const expandedPaths = ref<Set<string>>(new Set())

// 展开所有节点
const expandAll = () => {
  const paths = new Set<string>()
  const traverse = (obj: any, path: string) => {
    paths.add(path)
    if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(key => {
        const newPath = path ? `${path}.${key}` : key
        traverse(obj[key], newPath)
      })
    }
  }
  if (jsonData.value) {
    traverse(jsonData.value, '')
  }
  expandedPaths.value = paths
}

// 解析JSON
watch(() => props.jsonString, (newValue) => {
  if (newValue.trim()) {
    try {
      jsonData.value = JSON.parse(newValue)
      // 默认全部展开
      expandAll()
    } catch (error) {
      jsonData.value = null
    }
  } else {
    jsonData.value = null
  }
}, { immediate: true })

// 计算总行数
const totalLines = computed(() => {
  if (!jsonData.value) return 0
  return JSON.stringify(jsonData.value, null, 2).split('\n').length
})

// 获取对象大小
const getObjectSize = (obj: any): number => {
  if (Array.isArray(obj)) {
    return obj.length
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.keys(obj).length
  }
  return 0
}

// 切换行号显示
const toggleLineNumbers = () => {
  showLineNumbers.value = !showLineNumbers.value
}



// 折叠所有节点
const collapseAll = () => {
  expandedPaths.value = new Set([''])
}

// 切换路径展开状态
const togglePath = (path: string) => {
  const newPaths = new Set(expandedPaths.value)
  if (newPaths.has(path)) {
    newPaths.delete(path)
  } else {
    newPaths.add(path)
  }
  expandedPaths.value = newPaths
}
</script>

<style scoped>
.json-viewer {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}
</style>
