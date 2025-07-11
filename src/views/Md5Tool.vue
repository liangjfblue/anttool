<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">MD5工具</h1>
      <p class="text-gray-600 dark:text-gray-300 mt-2">
        MD5哈希生成、文件校验、哈希对比等功能
      </p>
    </div>

    <!-- 功能选项卡 -->
    <div class="border-b border-gray-200 dark:border-gray-700">
      <nav class="-mb-px flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm',
            activeTab === tab.id
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          ]"
        >
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- 文本MD5 -->
    <div v-if="activeTab === 'text'" class="space-y-6">
      <Card>
        <template #header>
          <h3 class="text-lg font-medium">文本MD5生成</h3>
        </template>
        
        <div class="space-y-4">
          <!-- 输入区域 -->
          <Input
            v-model="textInput"
            type="textarea"
            label="输入文本"
            placeholder="请输入需要生成MD5的文本..."
            :rows="6"
          />

          <!-- 操作按钮 -->
          <div class="flex flex-wrap gap-2">
            <Button @click="generateTextMd5" :disabled="!textInput.trim()">
              生成MD5
            </Button>
            <Button @click="clearTextInput" variant="ghost">
              清空
            </Button>
            <Button @click="copyTextResult" variant="outline" :disabled="!textMd5">
              复制结果
            </Button>
          </div>

          <!-- MD5结果 -->
          <div v-if="textMd5" class="space-y-3">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">MD5哈希值:</div>
              <div class="font-mono text-lg break-all select-all">{{ textMd5 }}</div>
            </div>
            
            <!-- 其他哈希算法 -->
            <div class="space-y-2">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">其他哈希算法:</h4>
              <div class="grid grid-cols-1 gap-2">
                <div
                  v-for="hash in otherHashes"
                  :key="hash.algorithm"
                  class="p-3 bg-gray-50 dark:bg-gray-800 rounded"
                >
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ hash.algorithm }}:</div>
                  <div class="font-mono text-sm break-all select-all">{{ hash.value }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>

    <!-- 文件MD5 -->
    <div v-if="activeTab === 'file'" class="space-y-6">
      <Card>
        <template #header>
          <h3 class="text-lg font-medium">文件MD5校验</h3>
        </template>
        
        <div class="space-y-4">
          <!-- 文件上传区域 -->
          <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
            <div class="text-center">
              <DocumentIcon class="mx-auto h-12 w-12 text-gray-400" />
              <div class="mt-4">
                <label for="file-upload-md5" class="cursor-pointer">
                  <span class="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                    选择文件或拖拽到此处
                  </span>
                  <input
                    id="file-upload-md5"
                    name="file-upload-md5"
                    type="file"
                    class="sr-only"
                    @change="handleFileSelect"
                  />
                </label>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  支持所有文件类型
                </p>
              </div>
            </div>
          </div>

          <!-- 文件信息 -->
          <div v-if="selectedFile" class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 class="font-medium text-gray-900 dark:text-white mb-2">文件信息</h4>
            <div class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p>文件名: {{ selectedFile.name }}</p>
              <p>文件大小: {{ formatFileSize(selectedFile.size) }}</p>
              <p>文件类型: {{ selectedFile.type || '未知' }}</p>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex gap-2">
            <Button @click="generateFileMd5" :disabled="!selectedFile || isProcessing">
              {{ isProcessing ? '计算中...' : '计算MD5' }}
            </Button>
            <Button @click="clearFileInput" variant="ghost">
              清空
            </Button>
          </div>

          <!-- 进度条 -->
          <div v-if="isProcessing" class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div class="bg-primary-600 h-2 rounded-full transition-all duration-300" style="width: 50%"></div>
          </div>

          <!-- MD5结果 -->
          <div v-if="fileMd5" class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">文件MD5:</div>
            <div class="font-mono text-lg break-all select-all">{{ fileMd5 }}</div>
            <Button @click="copyFileResult" variant="outline" size="sm" class="mt-2">
              复制MD5
            </Button>
          </div>
        </div>
      </Card>
    </div>

    <!-- MD5验证 -->
    <div v-if="activeTab === 'verify'" class="space-y-6">
      <Card>
        <template #header>
          <h3 class="text-lg font-medium">MD5验证和对比</h3>
        </template>
        
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              v-model="verifyHash1"
              label="MD5哈希值 1"
              placeholder="输入第一个MD5哈希值..."
            />
            <Input
              v-model="verifyHash2"
              label="MD5哈希值 2"
              placeholder="输入第二个MD5哈希值..."
            />
          </div>

          <Button @click="compareMd5" :disabled="!verifyHash1.trim() || !verifyHash2.trim()">
            对比MD5
          </Button>

          <!-- 验证结果 -->
          <div v-if="compareResult !== null" class="p-4 rounded-md" :class="compareResult ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'">
            <div class="flex">
              <CheckCircleIcon v-if="compareResult" class="h-5 w-5 text-green-400" />
              <XCircleIcon v-else class="h-5 w-5 text-red-400" />
              <div class="ml-3">
                <p class="text-sm font-medium" :class="compareResult ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'">
                  {{ compareResult ? 'MD5哈希值相同' : 'MD5哈希值不同' }}
                </p>
              </div>
            </div>
          </div>

          <!-- MD5格式验证 -->
          <div class="space-y-2">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white">格式验证:</h4>
            <div class="space-y-2">
              <div v-if="verifyHash1.trim()" class="flex items-center">
                <span class="text-sm text-gray-500 dark:text-gray-400 w-20">哈希值1:</span>
                <CheckCircleIcon v-if="validateMd5Format(verifyHash1).valid" class="h-4 w-4 text-green-500 mr-2" />
                <XCircleIcon v-else class="h-4 w-4 text-red-500 mr-2" />
                <span class="text-sm" :class="validateMd5Format(verifyHash1).valid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                  {{ validateMd5Format(verifyHash1).valid ? '格式正确' : validateMd5Format(verifyHash1).error }}
                </span>
              </div>
              <div v-if="verifyHash2.trim()" class="flex items-center">
                <span class="text-sm text-gray-500 dark:text-gray-400 w-20">哈希值2:</span>
                <CheckCircleIcon v-if="validateMd5Format(verifyHash2).valid" class="h-4 w-4 text-green-500 mr-2" />
                <XCircleIcon v-else class="h-4 w-4 text-red-500 mr-2" />
                <span class="text-sm" :class="validateMd5Format(verifyHash2).valid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                  {{ validateMd5Format(verifyHash2).valid ? '格式正确' : validateMd5Format(verifyHash2).error }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>

    <!-- 批量处理 -->
    <div v-if="activeTab === 'batch'" class="space-y-6">
      <Card>
        <template #header>
          <h3 class="text-lg font-medium">批量MD5生成</h3>
        </template>
        
        <div class="space-y-4">
          <Input
            v-model="batchInput"
            type="textarea"
            label="批量输入 (每行一个文本)"
            placeholder="请输入多个文本，每行一个..."
            :rows="8"
          />

          <Button @click="generateBatchMd5" :disabled="!batchInput.trim()">
            批量生成MD5
          </Button>

          <div v-if="batchResults.length > 0" class="space-y-2">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white">
              生成结果 ({{ batchResults.length }} 条):
            </h4>
            <div class="max-h-60 overflow-y-auto space-y-2">
              <div
                v-for="(result, index) in batchResults"
                :key="index"
                class="p-3 bg-gray-50 dark:bg-gray-800 rounded text-sm"
              >
                <div class="text-gray-600 dark:text-gray-400 mb-1">原文: {{ result.text }}</div>
                <div class="font-mono break-all select-all">MD5: {{ result.md5 }}</div>
              </div>
            </div>
            
            <Button @click="copyBatchResults" variant="outline" size="sm">
              复制所有结果
            </Button>
          </div>
        </div>
      </Card>
    </div>

    <!-- 支持的算法 -->
    <Card>
      <template #header>
        <h3 class="text-lg font-medium">支持的哈希算法</h3>
      </template>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="algorithm in supportedAlgorithms"
          :key="algorithm.value"
          class="p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
        >
          <h4 class="font-medium text-gray-900 dark:text-white">{{ algorithm.label }}</h4>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ algorithm.description }}</p>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DocumentIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import { 
  generateMd5, 
  generateFileMd5, 
  validateMd5, 
  compareMd5, 
  generateHash, 
  batchGenerateMd5,
  getSupportedHashAlgorithms 
} from '@/utils/md5'

// 选项卡
const tabs = [
  { id: 'text', name: '文本MD5' },
  { id: 'file', name: '文件MD5' },
  { id: 'verify', name: 'MD5验证' },
  { id: 'batch', name: '批量处理' },
]

const activeTab = ref('text')

// 文本MD5
const textInput = ref('')
const textMd5 = ref('')
const otherHashes = ref<Array<{ algorithm: string; value: string }>>([])

// 文件MD5
const selectedFile = ref<File | null>(null)
const fileMd5 = ref('')
const isProcessing = ref(false)

// MD5验证
const verifyHash1 = ref('')
const verifyHash2 = ref('')
const compareResult = ref<boolean | null>(null)

// 批量处理
const batchInput = ref('')
const batchResults = ref<Array<{ text: string; md5: string }>>([])

// 支持的算法
const supportedAlgorithms = getSupportedHashAlgorithms()

// 生成文本MD5
const generateTextMd5 = () => {
  try {
    textMd5.value = generateMd5(textInput.value)
    
    // 生成其他哈希算法
    otherHashes.value = [
      { algorithm: 'SHA1', value: generateHash(textInput.value, 'SHA1') },
      { algorithm: 'SHA256', value: generateHash(textInput.value, 'SHA256') },
      { algorithm: 'SHA512', value: generateHash(textInput.value, 'SHA512') },
    ]
  } catch (error) {
    console.error('MD5生成失败:', error)
  }
}

// 清空文本输入
const clearTextInput = () => {
  textInput.value = ''
  textMd5.value = ''
  otherHashes.value = []
}

// 复制文本结果
const copyTextResult = async () => {
  if (textMd5.value) {
    try {
      await navigator.clipboard.writeText(textMd5.value)
    } catch (error) {
      console.error('复制失败:', error)
    }
  }
}

// 处理文件选择
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0]
    fileMd5.value = ''
  }
}

// 生成文件MD5
const generateFileMd5 = async () => {
  if (!selectedFile.value) return
  
  try {
    isProcessing.value = true
    fileMd5.value = await generateFileMd5(selectedFile.value)
  } catch (error) {
    console.error('文件MD5生成失败:', error)
  } finally {
    isProcessing.value = false
  }
}

// 清空文件输入
const clearFileInput = () => {
  selectedFile.value = null
  fileMd5.value = ''
  const fileInput = document.getElementById('file-upload-md5') as HTMLInputElement
  if (fileInput) {
    fileInput.value = ''
  }
}

// 复制文件结果
const copyFileResult = async () => {
  if (fileMd5.value) {
    try {
      await navigator.clipboard.writeText(fileMd5.value)
    } catch (error) {
      console.error('复制失败:', error)
    }
  }
}

// 对比MD5
const compareMd5 = () => {
  compareResult.value = compareMd5(verifyHash1.value, verifyHash2.value)
}

// 验证MD5格式
const validateMd5Format = (hash: string) => {
  return validateMd5(hash)
}

// 批量生成MD5
const generateBatchMd5 = () => {
  const lines = batchInput.value.split('\n').filter(line => line.trim())
  const results = batchGenerateMd5(lines)
  
  batchResults.value = lines.map((text, index) => ({
    text: text.trim(),
    md5: results[index]
  }))
}

// 复制批量结果
const copyBatchResults = async () => {
  const results = batchResults.value.map(result => `${result.text}: ${result.md5}`).join('\n')
  try {
    await navigator.clipboard.writeText(results)
  } catch (error) {
    console.error('复制失败:', error)
  }
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>
