import type { JsonFormatOptions, JsonCompareResult, JsonDifference } from '@/types'

/**
 * 格式化JSON字符串
 */
export function formatJson(jsonString: string, options: JsonFormatOptions = { indent: 2, sortKeys: false }): string {
  try {
    const parsed = JSON.parse(jsonString)
    if (options.sortKeys) {
      return JSON.stringify(sortObjectKeys(parsed), null, options.indent)
    }
    return JSON.stringify(parsed, null, options.indent)
  } catch (error) {
    throw new Error(`JSON格式错误: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * 压缩JSON字符串
 */
export function compressJson(jsonString: string): string {
  try {
    const parsed = JSON.parse(jsonString)
    return JSON.stringify(parsed)
  } catch (error) {
    throw new Error(`JSON格式错误: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * 验证JSON字符串
 */
export function validateJson(jsonString: string): { valid: boolean; error?: string } {
  try {
    JSON.parse(jsonString)
    return { valid: true }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : '未知错误'
    }
  }
}

/**
 * 对比两个JSON对象
 */
export function compareJson(json1: string, json2: string): JsonCompareResult {
  try {
    const obj1 = JSON.parse(json1)
    const obj2 = JSON.parse(json2)
    
    const differences: JsonDifference[] = []
    findDifferences(obj1, obj2, '', differences)
    
    return {
      isEqual: differences.length === 0,
      differences
    }
  } catch (error) {
    throw new Error(`JSON格式错误: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * 在JSON中搜索字段
 */
export function searchInJson(jsonString: string, searchTerm: string): Array<{ path: string; value: any }> {
  try {
    const parsed = JSON.parse(jsonString)
    const results: Array<{ path: string; value: any }> = []
    
    function search(obj: any, currentPath: string = '') {
      if (typeof obj === 'object' && obj !== null) {
        if (Array.isArray(obj)) {
          obj.forEach((item, index) => {
            const path = currentPath ? `${currentPath}[${index}]` : `[${index}]`
            search(item, path)
          })
        } else {
          Object.keys(obj).forEach(key => {
            const path = currentPath ? `${currentPath}.${key}` : key
            
            // 检查键名是否匹配
            if (key.toLowerCase().includes(searchTerm.toLowerCase())) {
              results.push({ path, value: obj[key] })
            }
            
            // 检查值是否匹配
            if (typeof obj[key] === 'string' && obj[key].toLowerCase().includes(searchTerm.toLowerCase())) {
              results.push({ path, value: obj[key] })
            }
            
            search(obj[key], path)
          })
        }
      }
    }
    
    search(parsed)
    return results
  } catch (error) {
    throw new Error(`JSON格式错误: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * 导出JSON到文件
 */
export function exportJson(data: any, filename: string = 'data.json'): void {
  try {
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  } catch (error) {
    throw new Error(`导出失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * 从文件导入JSON
 */
export function importJson(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        // 验证JSON格式
        JSON.parse(content)
        resolve(content)
      } catch (error) {
        reject(new Error(`文件内容不是有效的JSON格式: ${error instanceof Error ? error.message : '未知错误'}`))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }
    
    reader.readAsText(file)
  })
}

// 辅助函数：递归排序对象键
function sortObjectKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys)
  } else if (obj !== null && typeof obj === 'object') {
    const sorted: any = {}
    Object.keys(obj).sort().forEach(key => {
      sorted[key] = sortObjectKeys(obj[key])
    })
    return sorted
  }
  return obj
}

// 辅助函数：查找差异
function findDifferences(obj1: any, obj2: any, path: string, differences: JsonDifference[]): void {
  const keys1 = obj1 && typeof obj1 === 'object' ? Object.keys(obj1) : []
  const keys2 = obj2 && typeof obj2 === 'object' ? Object.keys(obj2) : []
  const allKeys = new Set([...keys1, ...keys2])
  
  for (const key of allKeys) {
    const currentPath = path ? `${path}.${key}` : key
    const hasKey1 = keys1.includes(key)
    const hasKey2 = keys2.includes(key)
    
    if (!hasKey1) {
      differences.push({
        path: currentPath,
        type: 'added',
        newValue: obj2[key]
      })
    } else if (!hasKey2) {
      differences.push({
        path: currentPath,
        type: 'removed',
        oldValue: obj1[key]
      })
    } else if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
      if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object' && obj1[key] !== null && obj2[key] !== null) {
        findDifferences(obj1[key], obj2[key], currentPath, differences)
      } else {
        differences.push({
          path: currentPath,
          type: 'modified',
          oldValue: obj1[key],
          newValue: obj2[key]
        })
      }
    }
  }
}
