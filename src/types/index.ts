// 主题类型
export type Theme = 'light' | 'dark'

// 工具类型
export interface Tool {
  id: string
  name: string
  description: string
  icon: any // Vue组件类型
  path: string
}

// JSON工具相关类型
export interface JsonFormatOptions {
  indent: number
  sortKeys: boolean
}

export interface JsonCompareResult {
  isEqual: boolean
  differences: JsonDifference[]
}

export interface JsonDifference {
  path: string
  type: 'added' | 'removed' | 'modified'
  oldValue?: any
  newValue?: any
}

// 时间工具相关类型
export interface TimeConversion {
  timestamp: number
  dateString: string
  timezone: string
}

export interface DateDifference {
  years: number
  months: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

export interface DateIntervalResult {
  endDate: string
  endDateFormatted: string
  weekday: string
  timestamp: number
  timestampSeconds: number
  totalDays: number
  totalHours: number
  totalMinutes: number
  totalSeconds: number
}

// 通用响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

// 文件处理类型
export interface FileInfo {
  name: string
  size: number
  type: string
  content: string
}
