<template>
  <div class="json-node">
    <div class="flex items-start">
      <!-- 缩进 -->
      <div :style="{ width: `${level * 20}px` }" class="flex-shrink-0"></div>
      
      <!-- 展开/折叠按钮 -->
      <button
        v-if="isExpandable"
        @click="toggle"
        class="flex-shrink-0 w-4 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
      >
        <ChevronRightIcon
          :class="[
            'w-3 h-3 transition-transform',
            isExpanded ? 'rotate-90' : ''
          ]"
        />
      </button>
      <div v-else class="w-4 flex-shrink-0"></div>

      <!-- 键名 -->
      <span v-if="keyName !== null" class="text-blue-600 dark:text-blue-400 mr-1">
        "{{ keyName }}"
      </span>
      <span v-if="keyName !== null" class="text-gray-500 mr-1">:</span>

      <!-- 值 -->
      <div class="flex-1 min-w-0">
        <!-- 对象/数组的开始标记 -->
        <span v-if="isObject || isArray" class="text-gray-500">
          {{ isArray ? '[' : '{' }}
          <span v-if="!isExpanded" class="text-gray-400 ml-1">
            {{ isArray ? `${data.length} items` : `${Object.keys(data).length} keys` }}
          </span>
          <span v-if="!isExpanded" class="text-gray-500 ml-1">
            {{ isArray ? ']' : '}' }}
          </span>
        </span>

        <!-- 基本类型值 -->
        <span v-else :class="getValueClass(data)" class="break-words">
          {{ formatValue(data) }}
        </span>
      </div>
    </div>

    <!-- 展开的子节点 -->
    <div v-if="isExpanded && (isObject || isArray)">
      <JsonNode
        v-for="(value, key) in data"
        :key="key"
        :data="value"
        :key-name="String(key)"
        :path="childPath(String(key))"
        :level="level + 1"
        :expanded-paths="expandedPaths"
        @toggle="$emit('toggle', $event)"
      />
      
      <!-- 结束标记 -->
      <div class="flex">
        <div :style="{ width: `${level * 20}px` }" class="flex-shrink-0"></div>
        <div class="w-4 flex-shrink-0"></div>
        <span class="text-gray-500">{{ isArray ? ']' : '}' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChevronRightIcon } from '@heroicons/vue/24/outline'

interface Props {
  data: any
  keyName?: string | null
  path: string
  level: number
  expandedPaths: Set<string>
}

const props = withDefaults(defineProps<Props>(), {
  keyName: null
})

const emit = defineEmits<{
  toggle: [path: string]
}>()

// 计算属性
const isObject = computed(() => 
  typeof props.data === 'object' && props.data !== null && !Array.isArray(props.data)
)

const isArray = computed(() => Array.isArray(props.data))

const isExpandable = computed(() => isObject.value || isArray.value)

const isExpanded = computed(() => props.expandedPaths.has(props.path))

// 生成子路径
const childPath = (key: string) => {
  return props.path ? `${props.path}.${key}` : key
}

// 切换展开状态
const toggle = () => {
  if (isExpandable.value) {
    emit('toggle', props.path)
  }
}

// 格式化值显示
const formatValue = (value: any): string => {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (typeof value === 'string') return `"${value}"`
  if (typeof value === 'boolean') return value.toString()
  if (typeof value === 'number') return value.toString()
  return String(value)
}

// 获取值的样式类
const getValueClass = (value: any): string => {
  const baseClass = 'font-mono'
  
  if (value === null || value === undefined) {
    return `${baseClass} text-gray-500 dark:text-gray-400`
  }
  if (typeof value === 'string') {
    return `${baseClass} text-green-600 dark:text-green-400`
  }
  if (typeof value === 'number') {
    return `${baseClass} text-purple-600 dark:text-purple-400`
  }
  if (typeof value === 'boolean') {
    return `${baseClass} text-orange-600 dark:text-orange-400`
  }
  
  return baseClass
}
</script>

<style scoped>
.json-node {
  line-height: 1.5;
}
</style>
