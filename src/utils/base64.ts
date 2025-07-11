/**
 * Base64编码
 */
export function encodeBase64(text: string): string {
  try {
    // 使用btoa进行Base64编码，但需要处理Unicode字符
    return btoa(unescape(encodeURIComponent(text)))
  } catch (error) {
    throw new Error(`Base64编码失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * Base64解码
 */
export function decodeBase64(encodedText: string): string {
  try {
    // 使用atob进行Base64解码，但需要处理Unicode字符
    return decodeURIComponent(escape(atob(encodedText)))
  } catch (error) {
    throw new Error(`Base64解码失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * 验证Base64格式
 */
export function validateBase64(text: string): { valid: boolean; error?: string } {
  try {
    // Base64字符集验证
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/
    
    if (!base64Regex.test(text)) {
      return { valid: false, error: '包含非Base64字符' }
    }
    
    // 长度验证（Base64编码后的长度应该是4的倍数）
    if (text.length % 4 !== 0) {
      return { valid: false, error: 'Base64长度不正确' }
    }
    
    // 尝试解码验证
    atob(text)
    return { valid: true }
  } catch (error) {
    return {
      valid: false,
      error: '无效的Base64格式'
    }
  }
}

/**
 * 文件转Base64
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = () => {
      try {
        const result = reader.result as string
        // 移除data:开头的部分，只保留Base64数据
        const base64 = result.split(',')[1] || result
        resolve(base64)
      } catch (error) {
        reject(new Error(`文件转换失败: ${error instanceof Error ? error.message : '未知错误'}`))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }
    
    reader.readAsDataURL(file)
  })
}

/**
 * Base64转文件下载
 */
export function downloadBase64AsFile(base64: string, filename: string, mimeType: string = 'application/octet-stream'): void {
  try {
    // 将Base64转换为Blob
    const byteCharacters = atob(base64)
    const byteNumbers = new Array(byteCharacters.length)
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: mimeType })
    
    // 创建下载链接
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  } catch (error) {
    throw new Error(`文件下载失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * 获取Base64字符串信息
 */
export function getBase64Info(base64: string): {
  size: number
  sizeFormatted: string
  isValid: boolean
} {
  try {
    const validation = validateBase64(base64)
    if (!validation.valid) {
      return {
        size: 0,
        sizeFormatted: '0 B',
        isValid: false
      }
    }
    
    // 计算原始数据大小（Base64编码会增加约33%的大小）
    const padding = (base64.match(/=/g) || []).length
    const size = (base64.length * 3) / 4 - padding
    
    return {
      size,
      sizeFormatted: formatBytes(size),
      isValid: true
    }
  } catch (error) {
    return {
      size: 0,
      sizeFormatted: '0 B',
      isValid: false
    }
  }
}

/**
 * 格式化字节大小
 */
function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
