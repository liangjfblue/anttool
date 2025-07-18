import { format, parseISO, differenceInYears, differenceInMonths, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns'
import type { TimeConversion, DateDifference } from '@/types'

/**
 * 时间戳转换为日期字符串
 */
export function timestampToDate(timestamp: number, formatStr: string = 'yyyy-MM-dd HH:mm:ss'): string {
  try {
    // 处理秒级和毫秒级时间戳
    const date = new Date(timestamp < 10000000000 ? timestamp * 1000 : timestamp)
    return format(date, formatStr)
  } catch (error) {
    throw new Error(`时间戳转换失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * 日期字符串转换为时间戳
 */
export function dateToTimestamp(dateString: string, unit: 'seconds' | 'milliseconds' = 'milliseconds'): number {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      throw new Error('无效的日期格式')
    }
    const timestamp = date.getTime()
    return unit === 'seconds' ? Math.floor(timestamp / 1000) : timestamp
  } catch (error) {
    throw new Error(`日期转换失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * 获取当前时间的多种格式
 */
export function getCurrentTime(): TimeConversion {
  const now = new Date()
  return {
    timestamp: now.getTime(),
    dateString: format(now, 'yyyy-MM-dd HH:mm:ss'),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  }
}

/**
 * 时区转换
 */
export function convertTimezone(dateString: string, _fromTimezone: string, toTimezone: string): string {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      throw new Error('无效的日期格式')
    }
    
    // 使用Intl.DateTimeFormat进行时区转换
    const formatter = new Intl.DateTimeFormat('sv-SE', {
      timeZone: toTimezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
    
    return formatter.format(date).replace(' ', ' ')
  } catch (error) {
    throw new Error(`时区转换失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * 计算两个日期之间的差异
 */
export function calculateDateDifference(startDate: string, endDate: string): DateDifference {
  try {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('无效的日期格式')
    }
    
    return {
      years: Math.abs(differenceInYears(end, start)),
      months: Math.abs(differenceInMonths(end, start)),
      days: Math.abs(differenceInDays(end, start)),
      hours: Math.abs(differenceInHours(end, start)),
      minutes: Math.abs(differenceInMinutes(end, start)),
      seconds: Math.abs(differenceInSeconds(end, start))
    }
  } catch (error) {
    throw new Error(`日期计算失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * 格式化日期
 */
export function formatDate(dateString: string, formatStr: string): string {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      throw new Error('无效的日期格式')
    }
    return format(date, formatStr)
  } catch (error) {
    throw new Error(`日期格式化失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * 解析ISO日期字符串
 */
export function parseISODate(isoString: string): Date {
  try {
    return parseISO(isoString)
  } catch (error) {
    throw new Error(`ISO日期解析失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * 获取常用的日期格式列表
 */
export function getCommonDateFormats(): Array<{ label: string; format: string; example: string }> {
  const now = new Date()
  
  const formats = [
    { label: '标准格式', format: 'yyyy-MM-dd HH:mm:ss' },
    { label: '日期', format: 'yyyy-MM-dd' },
    { label: '时间', format: 'HH:mm:ss' },
    { label: 'ISO格式', format: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx" },
    { label: '美式格式', format: 'MM/dd/yyyy' },
    { label: '欧式格式', format: 'dd/MM/yyyy' },
    { label: '中文格式', format: 'yyyy年MM月dd日' },
    { label: '完整中文', format: 'yyyy年MM月dd日 HH时mm分ss秒' },
    { label: 'RFC2822', format: 'EEE, dd MMM yyyy HH:mm:ss xx' },
    { label: '相对时间', format: 'yyyy-MM-dd (EEEE)' }
  ]
  
  return formats.map(f => ({
    ...f,
    example: format(now, f.format)
  }))
}

/**
 * 获取常用时区列表
 */
export function getCommonTimezones(): Array<{ label: string; value: string; offset: string }> {
  const timezones = [
    { label: '北京时间 (CST)', value: 'Asia/Shanghai', offset: '+08:00' },
    { label: '东京时间 (JST)', value: 'Asia/Tokyo', offset: '+09:00' },
    { label: '首尔时间 (KST)', value: 'Asia/Seoul', offset: '+09:00' },
    { label: '新加坡时间 (SGT)', value: 'Asia/Singapore', offset: '+08:00' },
    { label: '香港时间 (HKT)', value: 'Asia/Hong_Kong', offset: '+08:00' },
    { label: '台北时间 (CST)', value: 'Asia/Taipei', offset: '+08:00' },
    { label: '协调世界时 (UTC)', value: 'UTC', offset: '+00:00' },
    { label: '伦敦时间 (GMT)', value: 'Europe/London', offset: '+00:00' },
    { label: '巴黎时间 (CET)', value: 'Europe/Paris', offset: '+01:00' },
    { label: '纽约时间 (EST)', value: 'America/New_York', offset: '-05:00' },
    { label: '洛杉矶时间 (PST)', value: 'America/Los_Angeles', offset: '-08:00' },
    { label: '芝加哥时间 (CST)', value: 'America/Chicago', offset: '-06:00' },
    { label: '丹佛时间 (MST)', value: 'America/Denver', offset: '-07:00' },
    { label: '悉尼时间 (AEDT)', value: 'Australia/Sydney', offset: '+11:00' },
    { label: '墨尔本时间 (AEDT)', value: 'Australia/Melbourne', offset: '+11:00' }
  ]
  
  return timezones
}

/**
 * 验证日期字符串格式
 */
export function validateDateString(dateString: string): { valid: boolean; error?: string } {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return { valid: false, error: '无效的日期格式' }
    }
    return { valid: true }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : '未知错误'
    }
  }
}
