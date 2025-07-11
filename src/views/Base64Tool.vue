<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Base64工具</h1>
      <p class="text-gray-600 dark:text-gray-300 mt-2">
        Base64编码解码、文件转换等功能
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

    <!-- 文本编码解码 -->
    <div v-if="activeTab === 'text'" class="space-y-6">
      <Card>
        <template #header>
          <h3 class="text-lg font-medium">文本Base64编码解码</h3>
        </template>
        
        <div class="space-y-4">
          <!-- 输入区域 -->
          <Input
            v-model="textInput"
            type="textarea"
            label="输入文本"
            placeholder="请输入需要编码或解码的文本..."
            :rows="6"
          />

          <!-- 操作按钮 -->
          <div class="flex flex-wrap gap-2">
            <Button @click="encodeText" :disabled="!textInput.trim()">
              Base64编码
            </Button>
            <Button @click="decodeText" variant="secondary" :disabled="!textInput.trim()">
              Base64解码
            </Button>
            <Button @click="clearTextInput" variant="ghost">
              清空
            </Button>
            <Button @click="copyTextResult" variant="outline" :disabled="!textOutput">
              复制结果
            </Button>
          </div>

          <!-- 输出区域 -->
          <div v-if="textOutput">
            <Input
              v-model="textOutput"
              type="textarea"
              label="处理结果"
              :rows="6"
              readonly
            />
          </div>

          <!-- Base64信息 -->
          <div v-if="base64Info && base64Info.isValid" class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <h4 class="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Base64信息</h4>
            <div class="text-sm text-blue-700 dark:text-blue-300">
              <p>数据大小: {{ base64Info.sizeFormatted }}</p>
              <p>字符长度: {{ textOutput.length }}</p>
            </div>
          </div>

          <!-- 错误提示 -->
          <div v-if="textError" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <div class="flex">
              <ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
              <div class="ml-3">
                <p class="text-sm text-red-800 dark:text-red-200">{{ textError }}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>

    <!-- 文件编码 -->
    <div v-if="activeTab === 'file'" class="space-y-6">
      <Card>
        <template #header>
          <h3 class="text-lg font-medium">文件Base64编码</h3>
        </template>
        
        <div class="space-y-4">
          <!-- 文件上传区域 -->
          <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
            <div class="text-center">
              <DocumentIcon class="mx-auto h-12 w-12 text-gray-400" />
              <div class="mt-4">
                <label for="file-upload" class="cursor-pointer">
                  <span class="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                    选择文件或拖拽到此处
                  </span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    class="sr-only"
                    @change="handleFileSelect"
                  />
                </label>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  支持所有文件类型，建议小于10MB
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
            <Button @click="encodeFile" :disabled="!selectedFile || isProcessing">
              {{ isProcessing ? '处理中...' : '编码文件' }}
            </Button>
            <Button @click="clearFileInput" variant="ghost">
              清空
            </Button>
          </div>

          <!-- 编码结果 -->
          <div v-if="fileBase64" class="space-y-4">
            <Input
              v-model="fileBase64"
              type="textarea"
              label="Base64编码结果"
              :rows="8"
              readonly
            />
            
            <div class="flex gap-2">
              <Button @click="copyFileResult" variant="outline">
                复制结果
              </Button>
              <Button @click="downloadAsText" variant="secondary">
                下载为文本文件
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>

    <!-- Base64解码为文件 -->
    <div v-if="activeTab === 'decode-file'" class="space-y-6">
      <Card>
        <template #header>
          <h3 class="text-lg font-medium">Base64解码为文件</h3>
        </template>
        
        <div class="space-y-4">
          <Input
            v-model="decodeFileInput"
            type="textarea"
            label="Base64编码内容"
            placeholder="请输入Base64编码的文件内容..."
            :rows="8"
          />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              v-model="downloadFileName"
              label="文件名"
              placeholder="输入下载的文件名 (如: image.jpg)"
            />
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                文件类型
              </label>
              <select
                v-model="downloadMimeType"
                class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-primary-500"
              >
                <option value="application/octet-stream">自动检测</option>
                <option value="image/jpeg">JPEG图片</option>
                <option value="image/png">PNG图片</option>
                <option value="image/gif">GIF图片</option>
                <option value="text/plain">文本文件</option>
                <option value="application/pdf">PDF文档</option>
                <option value="application/zip">ZIP压缩包</option>
              </select>
            </div>
          </div>

          <Button 
            @click="decodeAndDownload" 
            :disabled="!decodeFileInput.trim() || !downloadFileName.trim()"
          >
            解码并下载文件
          </Button>

          <!-- Base64验证结果 -->
          <div v-if="decodeValidation" class="p-4 rounded-md" :class="decodeValidation.valid ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'">
            <div class="flex">
              <CheckCircleIcon v-if="decodeValidation.valid" class="h-5 w-5 text-green-400" />
              <XCircleIcon v-else class="h-5 w-5 text-red-400" />
              <div class="ml-3">
                <p class="text-sm font-medium" :class="decodeValidation.valid ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'">
                  {{ decodeValidation.valid ? 'Base64格式正确' : 'Base64格式错误' }}
                </p>
                <p v-if="!decodeValidation.valid" class="mt-1 text-sm text-red-700 dark:text-red-300">
                  {{ decodeValidation.error }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { DocumentIcon, ExclamationTriangleIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import { 
  encodeBase64, 
  decodeBase64, 
  validateBase64, 
  fileToBase64, 
  downloadBase64AsFile, 
  getBase64Info 
} from '@/utils/base64'

// 选项卡
const tabs = [
  { id: 'text', name: '文本编码' },
  { id: 'file', name: '文件编码' },
  { id: 'decode-file', name: '解码文件' },
]

const activeTab = ref('text')

// 文本编码解码
const textInput = ref('')
const textOutput = ref('')
const textError = ref('')
const base64Info = ref<any>(null)

// 文件编码
const selectedFile = ref<File | null>(null)
const fileBase64 = ref('')
const isProcessing = ref(false)

// 文件解码
const decodeFileInput = ref('')
const downloadFileName = ref('')
const downloadMimeType = ref('application/octet-stream')
const decodeValidation = ref<any>(null)

// 文本编码
const encodeText = () => {
  try {
    textError.value = ''
    textOutput.value = encodeBase64(textInput.value)
    base64Info.value = getBase64Info(textOutput.value)
  } catch (error) {
    textError.value = error instanceof Error ? error.message : '编码失败'
    textOutput.value = ''
    base64Info.value = null
  }
}

// 文本解码
const decodeText = () => {
  try {
    textError.value = ''
    const validation = validateBase64(textInput.value)
    if (!validation.valid) {
      throw new Error(validation.error)
    }
    textOutput.value = decodeBase64(textInput.value)
    base64Info.value = getBase64Info(textInput.value)
  } catch (error) {
    textError.value = error instanceof Error ? error.message : '解码失败'
    textOutput.value = ''
    base64Info.value = null
  }
}

// 清空文本输入
const clearTextInput = () => {
  textInput.value = ''
  textOutput.value = ''
  textError.value = ''
  base64Info.value = null
}

// 复制文本结果
const copyTextResult = async () => {
  if (textOutput.value) {
    try {
      await navigator.clipboard.writeText(textOutput.value)
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
    fileBase64.value = ''
  }
}

// 编码文件
const encodeFile = async () => {
  if (!selectedFile.value) return
  
  try {
    isProcessing.value = true
    fileBase64.value = await fileToBase64(selectedFile.value)
  } catch (error) {
    console.error('文件编码失败:', error)
  } finally {
    isProcessing.value = false
  }
}

// 清空文件输入
const clearFileInput = () => {
  selectedFile.value = null
  fileBase64.value = ''
  const fileInput = document.getElementById('file-upload') as HTMLInputElement
  if (fileInput) {
    fileInput.value = ''
  }
}

// 复制文件结果
const copyFileResult = async () => {
  if (fileBase64.value) {
    try {
      await navigator.clipboard.writeText(fileBase64.value)
    } catch (error) {
      console.error('复制失败:', error)
    }
  }
}

// 下载为文本文件
const downloadAsText = () => {
  if (fileBase64.value) {
    const blob = new Blob([fileBase64.value], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${selectedFile.value?.name || 'file'}.base64.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

// 解码并下载文件
const decodeAndDownload = () => {
  try {
    downloadBase64AsFile(decodeFileInput.value, downloadFileName.value, downloadMimeType.value)
  } catch (error) {
    console.error('解码下载失败:', error)
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

// 监听解码输入变化，实时验证
watch(decodeFileInput, (newValue) => {
  if (newValue.trim()) {
    decodeValidation.value = validateBase64(newValue.trim())
  } else {
    decodeValidation.value = null
  }
})
</script>
