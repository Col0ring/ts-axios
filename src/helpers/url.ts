// 处理请求url
import { isDate, isPlainObject, isUrlSearchParams } from './../utils/index'

interface UrlOrigin {
  protocol: string
  host: string
}

function encode(val: string): string {
  // 将传入的参数转换为url码，注意要把特殊符号转义回来
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/$2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}
// 封装传送过来的url
export function buildUrl(
  url: string,
  params?: any,
  paramsSerializer?: (params: any) => string
): string {
  if (!params) {
    return url
  }

  let serializedParams
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
    // 判断是否为UrlSearchParams对象
  } else if (isUrlSearchParams(params)) {
    serializedParams = params.toString()
  } else {
    const parts: string[] = []
    Object.keys(params).forEach(key => {
      const val: any = params[key]
      // forEach中的return不会跳出来，但是会立刻进入下一次循环，相当于continue
      if (val === null || typeof val === 'undefined') {
        return
      }
      let values = []
      // 如果传入的值为一个数组
      if (Array.isArray(val)) {
        values = val
        key += '[]'
      } else {
        values = [val]
      }
      // 都将传入的参数转换为数组好统一的转换
      values.forEach(val => {
        if (isDate(val)) {
          val = val.toISOString()
        } else if (isPlainObject(val)) {
          val = JSON.stringify(val)
        }
        parts.push(`${encode(key)}=${encode(val)}`)
      })
    })
    serializedParams = parts.join('&')
  }
  // 如果没有值serializedParams中其实是空字符串
  if (serializedParams) {
    // 去除hash值
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }
    // 给url加上params中的值
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }
  return url
}

export function isAbsoluteUrl(url: string): boolean {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

export function combineUrl(baseUrl: string, relativeUrl?: string): string {
  return relativeUrl ? baseUrl.replace(/\/+$/, '') + '/' + relativeUrl.replace(/^\/+/, '') : baseUrl
}

// 下面都在判断现在的域名是否和目标同源
export function isUrlSameOrigin(requestUrl: string): boolean {
  const parseOrigin = resolveUrl(requestUrl)
  return parseOrigin.protocol === currentOrigin.protocol && parseOrigin.host === currentOrigin.host
}

const urlParsingNode = document.createElement('a')
const currentOrigin = resolveUrl(window.location.href)

function resolveUrl(url: string): UrlOrigin {
  urlParsingNode.setAttribute('href', url)
  const { protocol, host } = urlParsingNode
  return { protocol, host }
}
