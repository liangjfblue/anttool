<template>
  <div class="space-y-12">
    <!-- 欢迎区域 -->
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white">
        AntTool
      </h1>
    </div>

    <!-- 工具卡片网格 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <Card
        v-for="tool in tools"
        :key="tool.id"
        class="hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-0 shadow-lg"
        @click="$router.push(tool.path)"
      >
        <div class="p-8">
          <div class="flex items-center mb-6">
            <div class="p-4 bg-primary-100 dark:bg-primary-900 rounded-xl">
              <component :is="tool.icon" class="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 class="ml-6 text-xl font-bold text-gray-900 dark:text-white">
              {{ tool.name }}
            </h3>
          </div>
          <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
            {{ tool.description }}
          </p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CodeBracketIcon,
  ClockIcon,
  LinkIcon,
  DocumentTextIcon,
  HashtagIcon,
} from '@heroicons/vue/24/outline'
import Card from '@/components/ui/Card.vue'
import type { Tool } from '@/types'

// 工具列表
const tools: Tool[] = [
  {
    id: 'json',
    name: 'JSON工具',
    description: 'JSON格式化、验证、对比、搜索等功能',
    icon: CodeBracketIcon,
    path: '/json',
  },
  {
    id: 'time',
    name: '时间工具',
    description: '时间戳转换、时区转换、日期计算',
    icon: ClockIcon,
    path: '/time',
  },
  {
    id: 'url',
    name: 'URL工具',
    description: 'URL编码解码、参数解析',
    icon: LinkIcon,
    path: '/url',
  },
  {
    id: 'base64',
    name: 'Base64工具',
    description: 'Base64编码解码、文件转换',
    icon: DocumentTextIcon,
    path: '/base64',
  },
  {
    id: 'md5',
    name: 'MD5工具',
    description: 'MD5哈希生成、文件校验',
    icon: HashtagIcon,
    path: '/md5',
  },
]
</script>
