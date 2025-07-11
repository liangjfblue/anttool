/**
 * URL编码
 */
export function encodeUrl(text: string): string {
  try {
    return encodeURIComponent(text)
  } catch (error) {
    throw new Error(`URL编码失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * URL解码
 */
export function decodeUrl(encodedText: string): string {
  try {
    return decodeURIComponent(encodedText)
  } catch (error) {
    throw new Error(`URL解码失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * 批量URL编码
 */
export function batchEncodeUrl(texts: string[]): string[] {
  return texts.map(text => {
    try {
      return encodeUrl(text)
    } catch (error) {
      return `错误: ${error instanceof Error ? error.message : '未知错误'}`
    }
  })
}

/**
 * 批量URL解码
 */
export function batchDecodeUrl(encodedTexts: string[]): string[] {
  return encodedTexts.map(text => {
    try {
      return decodeUrl(text)
    } catch (error) {
      return `错误: ${error instanceof Error ? error.message : '未知错误'}`
    }
  })
}

/**
 * 验证URL格式
 */
export function validateUrl(url: string): { valid: boolean; error?: string } {
  try {
    new URL(url)
    return { valid: true }
  } catch (error) {
    return {
      valid: false,
      error: '无效的URL格式'
    }
  }
}

/**
 * 解析URL组件
 */
export function parseUrl(url: string): {
  protocol: string
  hostname: string
  port: string
  pathname: string
  search: string
  hash: string
  origin: string
} {
  try {
    const urlObj = new URL(url)
    return {
      protocol: urlObj.protocol,
      hostname: urlObj.hostname,
      port: urlObj.port,
      pathname: urlObj.pathname,
      search: urlObj.search,
      hash: urlObj.hash,
      origin: urlObj.origin
    }
  } catch (error) {
    throw new Error(`URL解析失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * 构建URL查询参数
 */
export function buildQueryString(params: Record<string, string | number | boolean>): string {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      searchParams.append(key, String(value))
    }
  })

  return searchParams.toString()
}

/**
 * 解析URL查询参数
 */
export function parseQueryString(queryString: string): Record<string, string> {
  const params: Record<string, string> = {}
  const searchParams = new URLSearchParams(queryString.startsWith('?') ? queryString.slice(1) : queryString)

  searchParams.forEach((value, key) => {
    params[key] = value
  })

  return params
}


