// 处理请求data
import { isPlainObject } from '../utils'

export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}

export function transformResponse(data: any): any {
  if (typeof data === 'string') {
    try {
      // 尝试将JSON的字符串默认转换为对象《这里需要捕捉异常
      data = JSON.parse(data)
    } catch (err) {
      // do nothing
    }
  }
  return data
}
