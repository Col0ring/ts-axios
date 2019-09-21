import { AxiosTransformer } from '../types'

export default function transform(
  data: any,
  headers: any,
  fns?: AxiosTransformer | AxiosTransformer[]
): any {
  if (!fns) {
    return data
  }
  // 如果不是数组强制变成一个数组
  if (!Array.isArray(fns)) {
    fns = [fns]
  }
  // 将上一次遍历的结果当做下一次的参数传递
  fns.forEach(fn => {
    data = fn(data, headers)
  })
  return data
}
