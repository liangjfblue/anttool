import CryptoJS from 'crypto-js'

/**
 * 生成MD5哈希值
 */
export function generateMd5(text: string): string {
  try {
    return CryptoJS.MD5(text).toString()
  } catch (error) {
    throw new Error(`MD5生成失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * 生成文件MD5哈希值
 */
export function generateFileMd5(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer
        const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer)
        const md5 = CryptoJS.MD5(wordArray).toString()
        resolve(md5)
      } catch (error) {
        reject(new Error(`文件MD5生成失败: ${error instanceof Error ? error.message : '未知错误'}`))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }
    
    reader.readAsArrayBuffer(file)
  })
}

/**
 * 批量生成MD5哈希值
 */
export function batchGenerateMd5(texts: string[]): string[] {
  return texts.map(text => {
    try {
      return generateMd5(text)
    } catch (error) {
      return `错误: ${error instanceof Error ? error.message : '未知错误'}`
    }
  })
}

/**
 * 验证MD5格式
 */
export function validateMd5(hash: string): { valid: boolean; error?: string } {
  const md5Regex = /^[a-f0-9]{32}$/i
  
  if (!md5Regex.test(hash)) {
    return {
      valid: false,
      error: 'MD5哈希值应为32位十六进制字符'
    }
  }
  
  return { valid: true }
}

/**
 * 比较两个MD5哈希值
 */
export function compareMd5(hash1: string, hash2: string): boolean {
  return hash1.toLowerCase() === hash2.toLowerCase()
}

/**
 * 生成其他哈希算法
 */
export function generateHash(text: string, algorithm: 'SHA1' | 'SHA256' | 'SHA512' = 'SHA256'): string {
  try {
    switch (algorithm) {
      case 'SHA1':
        return CryptoJS.SHA1(text).toString()
      case 'SHA256':
        return CryptoJS.SHA256(text).toString()
      case 'SHA512':
        return CryptoJS.SHA512(text).toString()
      default:
        throw new Error('不支持的哈希算法')
    }
  } catch (error) {
    throw new Error(`${algorithm}生成失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * 获取支持的哈希算法列表
 */
export function getSupportedHashAlgorithms(): Array<{ label: string; value: string; description: string }> {
  return [
    {
      label: 'MD5',
      value: 'MD5',
      description: '128位哈希值，常用但安全性较低'
    },
    {
      label: 'SHA1',
      value: 'SHA1',
      description: '160位哈希值，安全性中等'
    },
    {
      label: 'SHA256',
      value: 'SHA256',
      description: '256位哈希值，安全性高'
    },
    {
      label: 'SHA512',
      value: 'SHA512',
      description: '512位哈希值，安全性最高'
    }
  ]
}
