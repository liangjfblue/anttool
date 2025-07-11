<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">URL工具</h1>
      <p class="text-gray-600 dark:text-gray-300 mt-2">
        URL编码解码、参数解析等功能
      </p>
    </div>

    <!-- URL编码解码 -->
    <Card>
      <template #header>
        <h3 class="text-lg font-medium">URL编码解码</h3>
      </template>
      
      <div class="space-y-4">
        <!-- 输入区域 -->
        <Input
          v-model="urlInput"
          type="textarea"
          label="输入文本或URL"
          placeholder="请输入需要编码或解码的文本..."
          :rows="6"
        />

        <!-- 操作按钮 -->
        <div class="flex flex-wrap gap-2">
          <Button @click="encodeUrl" :disabled="!urlInput.trim()">
            URL编码
          </Button>
          <Button @click="decodeUrl" variant="secondary" :disabled="!urlInput.trim()">
            URL解码
          </Button>
          <Button @click="clearInput" variant="ghost">
            清空
          </Button>
          <Button @click="copyResult" variant="outline" :disabled="!urlOutput">
            复制结果
          </Button>
        </div>

        <!-- 输出区域 -->
        <div v-if="urlOutput">
          <Input
            v-model="urlOutput"
            type="textarea"
            label="处理结果"
            :rows="6"
            readonly
          />
        </div>

        <!-- 错误提示 -->
        <div v-if="errorMessage" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <div class="flex">
            <ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
            <div class="ml-3">
              <p class="text-sm text-red-800 dark:text-red-200">{{ errorMessage }}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- URL解析 -->
    <Card>
      <template #header>
        <h3 class="text-lg font-medium">URL解析</h3>
      </template>
      
      <div class="space-y-4">
        <Input
          v-model="parseUrlInput"
          label="输入完整URL"
          placeholder="https://example.com:8080/path?param=value#hash"
        />
        
        <Button @click="parseUrl" :disabled="!parseUrlInput.trim()">
          解析URL
        </Button>
        
        <!-- 解析结果 -->
        <div v-if="parsedUrl" class="space-y-3">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded">
              <div class="text-sm text-gray-500 dark:text-gray-400">协议 (Protocol)</div>
              <div class="font-mono break-all">{{ parsedUrl.protocol }}</div>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded">
              <div class="text-sm text-gray-500 dark:text-gray-400">主机名 (Hostname)</div>
              <div class="font-mono break-all">{{ parsedUrl.hostname }}</div>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded">
              <div class="text-sm text-gray-500 dark:text-gray-400">端口 (Port)</div>
              <div class="font-mono break-all">{{ parsedUrl.port || '默认端口' }}</div>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded">
              <div class="text-sm text-gray-500 dark:text-gray-400">路径 (Pathname)</div>
              <div class="font-mono break-all">{{ parsedUrl.pathname }}</div>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded">
              <div class="text-sm text-gray-500 dark:text-gray-400">查询参数 (Search)</div>
              <div class="font-mono break-all">{{ parsedUrl.search || '无' }}</div>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded">
              <div class="text-sm text-gray-500 dark:text-gray-400">锚点 (Hash)</div>
              <div class="font-mono break-all">{{ parsedUrl.hash || '无' }}</div>
            </div>
          </div>
          
          <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded">
            <div class="text-sm text-gray-500 dark:text-gray-400">源 (Origin)</div>
            <div class="font-mono break-all">{{ parsedUrl.origin }}</div>
          </div>
        </div>
      </div>
    </Card>

    <!-- 批量处理 -->
    <Card>
      <template #header>
        <h3 class="text-lg font-medium">批量处理</h3>
      </template>
      
      <div class="space-y-4">
        <Input
          v-model="batchInput"
          type="textarea"
          label="批量输入 (每行一个)"
          placeholder="请输入多个URL或文本，每行一个..."
          :rows="8"
        />

        <div class="flex gap-2">
          <Button @click="batchEncode" :disabled="!batchInput.trim()">
            批量编码
          </Button>
          <Button @click="batchDecode" variant="secondary" :disabled="!batchInput.trim()">
            批量解码
          </Button>
        </div>

        <div v-if="batchOutput">
          <Input
            v-model="batchOutput"
            type="textarea"
            label="批量处理结果"
            :rows="8"
            readonly
          />
        </div>
      </div>
    </Card>

    <!-- 常用示例 -->
    <Card>
      <template #header>
        <h3 class="text-lg font-medium">常用示例</h3>
      </template>
      
      <div class="space-y-3">
        <div
          v-for="example in examples"
          :key="example.title"
          class="p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
        >
          <h4 class="font-medium text-gray-900 dark:text-white mb-2">{{ example.title }}</h4>
          <div class="space-y-2">
            <div>
              <span class="text-sm text-gray-500 dark:text-gray-400">原文:</span>
              <code class="ml-2 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">{{ example.original }}</code>
            </div>
            <div>
              <span class="text-sm text-gray-500 dark:text-gray-400">编码:</span>
              <code class="ml-2 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm break-all">{{ example.encoded }}</code>
            </div>
          </div>
          <Button 
            @click="useExample(example.original)" 
            variant="ghost" 
            size="sm" 
            class="mt-2"
          >
            使用此示例
          </Button>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import { encodeUrl as encodeUrlUtil, decodeUrl as decodeUrlUtil, parseUrl as parseUrlUtil, batchEncodeUrl, batchDecodeUrl } from '@/utils/url'

// 编码解码
const urlInput = ref('')
const urlOutput = ref('')
const errorMessage = ref('')

// URL解析
const parseUrlInput = ref('')
const parsedUrl = ref<any>(null)

// 批量处理
const batchInput = ref('')
const batchOutput = ref('')

// 常用示例
const examples = [
  {
    title: '中文字符',
    original: '你好世界',
    encoded: '%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C'
  },
  {
    title: '特殊字符',
    original: 'hello world!@#$%^&*()',
    encoded: 'hello%20world!%40%23%24%25%5E%26*()' 
  },
  {
    title: '邮箱地址',
    original: 'user@example.com',
    encoded: 'user%40example.com'
  },
  {
    title: 'URL参数',
    original: 'name=张三&age=25',
    encoded: 'name%3D%E5%BC%A0%E4%B8%89%26age%3D25'
  }
]

// URL编码
const encodeUrl = () => {
  try {
    errorMessage.value = ''
    urlOutput.value = encodeUrlUtil(urlInput.value)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '编码失败'
    urlOutput.value = ''
  }
}

// URL解码
const decodeUrl = () => {
  try {
    errorMessage.value = ''
    urlOutput.value = decodeUrlUtil(urlInput.value)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '解码失败'
    urlOutput.value = ''
  }
}

// 清空输入
const clearInput = () => {
  urlInput.value = ''
  urlOutput.value = ''
  errorMessage.value = ''
}

// 复制结果
const copyResult = async () => {
  if (urlOutput.value) {
    try {
      await navigator.clipboard.writeText(urlOutput.value)
      // 这里可以添加成功提示
    } catch (error) {
      console.error('复制失败:', error)
    }
  }
}

// 解析URL
const parseUrl = () => {
  try {
    parsedUrl.value = parseUrlUtil(parseUrlInput.value)
  } catch (error) {
    console.error('解析失败:', error)
    parsedUrl.value = null
  }
}

// 批量编码
const batchEncode = () => {
  const lines = batchInput.value.split('\n').filter(line => line.trim())
  const results = batchEncodeUrl(lines)
  batchOutput.value = results.join('\n')
}

// 批量解码
const batchDecode = () => {
  const lines = batchInput.value.split('\n').filter(line => line.trim())
  const results = batchDecodeUrl(lines)
  batchOutput.value = results.join('\n')
}

// 使用示例
const useExample = (example: string) => {
  urlInput.value = example
  urlOutput.value = ''
  errorMessage.value = ''
}
</script>
