<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">时间工具</h1>
      <p class="text-gray-600 dark:text-gray-300 mt-2">
        时间戳转换、时区转换、日期计算等功能
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

    <!-- 当前时间 -->
    <div v-if="activeTab === 'current'" class="space-y-6">
      <Card>
        <template #header>
          <h3 class="text-lg font-medium">当前时间</h3>
        </template>
        
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="text-sm text-gray-500 dark:text-gray-400">当前时间</div>
              <div class="text-lg font-mono">{{ currentTime.dateString }}</div>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="text-sm text-gray-500 dark:text-gray-400">时间戳 (毫秒)</div>
              <div class="text-lg font-mono">{{ currentTime.timestamp }}</div>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="text-sm text-gray-500 dark:text-gray-400">时间戳 (秒)</div>
              <div class="text-lg font-mono">{{ Math.floor(currentTime.timestamp / 1000) }}</div>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="text-sm text-gray-500 dark:text-gray-400">时区</div>
              <div class="text-lg font-mono">{{ currentTime.timezone }}</div>
            </div>
          </div>
          
          <Button @click="updateCurrentTime" variant="outline">
            刷新时间
          </Button>
        </div>
      </Card>
    </div>

    <!-- 时间戳转换 -->
    <div v-if="activeTab === 'convert'" class="space-y-6">
      <Card>
        <template #header>
          <h3 class="text-lg font-medium">时间戳转换</h3>
        </template>
        
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- 时间戳转日期 -->
            <div class="space-y-4">
              <h4 class="font-medium text-gray-900 dark:text-white">时间戳转日期</h4>
              <Input
                v-model="timestampInput"
                label="时间戳"
                placeholder="输入时间戳 (支持秒级和毫秒级)"
                type="number"
              />
              <Button @click="convertTimestampToDate" :disabled="!timestampInput">
                转换为日期
              </Button>
              <div v-if="timestampResult" class="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <div class="text-sm text-gray-500 dark:text-gray-400">转换结果:</div>
                <div class="font-mono">{{ timestampResult }}</div>
              </div>
            </div>

            <!-- 日期转时间戳 -->
            <div class="space-y-4">
              <h4 class="font-medium text-gray-900 dark:text-white">日期转时间戳</h4>
              <Input
                v-model="dateInput"
                label="日期时间"
                placeholder="输入日期时间 (如: 2024-01-01 12:00:00)"
              />
              <div class="flex gap-2">
                <Button @click="convertDateToTimestamp('milliseconds')" :disabled="!dateInput">
                  转换为毫秒
                </Button>
                <Button @click="convertDateToTimestamp('seconds')" variant="secondary" :disabled="!dateInput">
                  转换为秒
                </Button>
              </div>
              <div v-if="dateResult" class="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <div class="text-sm text-gray-500 dark:text-gray-400">转换结果:</div>
                <div class="font-mono">{{ dateResult }}</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>

    <!-- 日期计算 -->
    <div v-if="activeTab === 'calculate'" class="space-y-6">
      <Card>
        <template #header>
          <h3 class="text-lg font-medium">日期间隔计算</h3>
        </template>
        
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              v-model="startDate"
              label="开始日期"
              placeholder="输入开始日期 (如: 2024-01-01)"
            />
            <Input
              v-model="endDate"
              label="结束日期"
              placeholder="输入结束日期 (如: 2024-12-31)"
            />
          </div>
          
          <Button @click="calculateDifference" :disabled="!startDate || !endDate">
            计算间隔
          </Button>
          
          <div v-if="dateDifference" class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded text-center">
              <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ dateDifference.years }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">年</div>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded text-center">
              <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ dateDifference.months }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">月</div>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded text-center">
              <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ dateDifference.days }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">天</div>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded text-center">
              <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ dateDifference.hours }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">小时</div>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded text-center">
              <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ dateDifference.minutes }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">分钟</div>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded text-center">
              <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ dateDifference.seconds }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">秒</div>
            </div>
          </div>
        </div>
      </Card>
    </div>

    <!-- 日期间隔计算 -->
    <div v-if="activeTab === 'interval'" class="space-y-6">
      <Card>
        <template #header>
          <h3 class="text-lg font-medium">日期间隔计算</h3>
        </template>

        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              v-model="intervalStartDate"
              label="开始日期"
              placeholder="输入开始日期 (如: 2024-01-01)"
            />
            <Input
              v-model="intervalDays"
              label="天数间隔"
              placeholder="输入天数 (正数为未来，负数为过去)"
              type="number"
            />
          </div>

          <Button @click="calculateInterval" :disabled="!intervalStartDate || !intervalDays">
            计算结束时间
          </Button>

          <div v-if="intervalResult" class="space-y-4">
            <!-- 基本信息 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div class="text-sm text-gray-500 dark:text-gray-400">结束日期</div>
                <div class="text-lg font-mono">{{ intervalResult.endDate }}</div>
              </div>
              <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div class="text-sm text-gray-500 dark:text-gray-400">星期</div>
                <div class="text-lg font-mono">{{ intervalResult.weekday }}</div>
              </div>
            </div>

            <!-- 完整时间信息 -->
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">完整时间</div>
              <div class="text-lg font-mono">{{ intervalResult.endDateFormatted }}</div>
            </div>

            <!-- 时间戳信息 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div class="text-sm text-gray-500 dark:text-gray-400">时间戳 (毫秒)</div>
                <div class="text-lg font-mono">{{ intervalResult.timestamp }}</div>
              </div>
              <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div class="text-sm text-gray-500 dark:text-gray-400">时间戳 (秒)</div>
                <div class="text-lg font-mono">{{ intervalResult.timestampSeconds }}</div>
              </div>
            </div>

            <!-- 统计信息 -->
            <div class="space-y-2">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">时间间隔统计</h4>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded text-center">
                  <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ intervalResult.totalDays }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">天</div>
                </div>
                <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded text-center">
                  <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ intervalResult.totalHours }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">小时</div>
                </div>
                <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded text-center">
                  <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ intervalResult.totalMinutes }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">分钟</div>
                </div>
                <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded text-center">
                  <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ intervalResult.totalSeconds }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">秒</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>

    <!-- 格式转换 -->
    <div v-if="activeTab === 'format'" class="space-y-6">
      <Card>
        <template #header>
          <h3 class="text-lg font-medium">日期格式转换</h3>
        </template>
        
        <div class="space-y-4">
          <Input
            v-model="formatInput"
            label="输入日期"
            placeholder="输入日期时间..."
          />
          
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              选择格式
            </label>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
              <button
                v-for="format in dateFormats"
                :key="format.format"
                @click="applyFormat(format.format)"
                class="p-3 text-left border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                :disabled="!formatInput"
              >
                <div class="font-medium text-sm">{{ format.label }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400 font-mono">{{ format.example }}</div>
              </button>
            </div>
          </div>
          
          <div v-if="formatResult" class="p-3 bg-gray-50 dark:bg-gray-800 rounded">
            <div class="text-sm text-gray-500 dark:text-gray-400">格式化结果:</div>
            <div class="font-mono">{{ formatResult }}</div>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import {
  getCurrentTime as getCurrentTimeUtil,
  timestampToDate,
  dateToTimestamp,
  calculateDateDifference,
  calculateDateInterval,
  formatDate,
  getCommonDateFormats
} from '@/utils/time'
import type { TimeConversion, DateDifference, DateIntervalResult } from '@/types'

// 选项卡
const tabs = [
  { id: 'current', name: '当前时间' },
  { id: 'convert', name: '时间戳转换' },
  { id: 'calculate', name: '日期计算' },
  { id: 'interval', name: '日期间隔' },
  { id: 'format', name: '格式转换' },
]

const activeTab = ref('current')

// 当前时间
const currentTime = ref<TimeConversion>({ timestamp: 0, dateString: '', timezone: '' })
let timeInterval: number | null = null

// 时间戳转换
const timestampInput = ref('')
const timestampResult = ref('')
const dateInput = ref('')
const dateResult = ref('')

// 日期计算
const startDate = ref('')
const endDate = ref('')
const dateDifference = ref<DateDifference | null>(null)

// 日期间隔计算
const intervalStartDate = ref('')
const intervalDays = ref('')
const intervalResult = ref<DateIntervalResult | null>(null)

// 格式转换
const formatInput = ref('')
const formatResult = ref('')
const dateFormats = ref(getCommonDateFormats())

// 更新当前时间
const updateCurrentTime = () => {
  currentTime.value = getCurrentTimeUtil()
}

// 时间戳转日期
const convertTimestampToDate = () => {
  try {
    const timestamp = Number(timestampInput.value)
    timestampResult.value = timestampToDate(timestamp)
  } catch (error) {
    timestampResult.value = `错误: ${error instanceof Error ? error.message : '转换失败'}`
  }
}

// 日期转时间戳
const convertDateToTimestamp = (unit: 'seconds' | 'milliseconds') => {
  try {
    const timestamp = dateToTimestamp(dateInput.value, unit)
    dateResult.value = `${timestamp} (${unit === 'seconds' ? '秒' : '毫秒'})`
  } catch (error) {
    dateResult.value = `错误: ${error instanceof Error ? error.message : '转换失败'}`
  }
}

// 计算日期差异
const calculateDifference = () => {
  try {
    dateDifference.value = calculateDateDifference(startDate.value, endDate.value)
  } catch (error) {
    console.error('计算失败:', error)
    dateDifference.value = null
  }
}

// 计算日期间隔
const calculateInterval = () => {
  try {
    const days = parseInt(intervalDays.value)
    if (isNaN(days)) {
      throw new Error('请输入有效的天数')
    }
    intervalResult.value = calculateDateInterval(intervalStartDate.value, days)
  } catch (error) {
    console.error('间隔计算失败:', error)
    intervalResult.value = null
  }
}

// 应用格式
const applyFormat = (format: string) => {
  try {
    formatResult.value = formatDate(formatInput.value, format)
  } catch (error) {
    formatResult.value = `错误: ${error instanceof Error ? error.message : '格式化失败'}`
  }
}

onMounted(() => {
  updateCurrentTime()
  // 每秒更新当前时间
  timeInterval = window.setInterval(updateCurrentTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>
