import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildUrl, isAbsoluteUrl, combineUrl } from '../helpers/url'
import { flattenHeaders } from '../helpers/headers'
import transform from './transform'

function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  // 检查是否已经取消了请求
  throwIfCancellationRequested(config)
  processConfig(config)
  // 要对响应数据做处理，先.then()
  return xhr(config).then(
    res => {
      return transformResponseData(res)
    },
    e => {
      if (e && e.response) {
        e.response = transformResponseData(e.response)
      }
      return Promise.reject(e)
    }
  )
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformUrl(config)
  // 必须要先处理headers，因为下面的处理已经将config的data转换为了json字符串了
  config.data = transform(config.data, config.headers, config.transformRequest)
  config.headers = flattenHeaders(config.headers, config.method!)
}

export function transformUrl(config: AxiosRequestConfig): string {
  const { params, paramsSerializer, baseURL } = config
  // 因为要改变url
  let { url } = config
  if (baseURL && !isAbsoluteUrl(url!)) {
    url = combineUrl(baseURL, url)
  }
  // 强制断言非空
  return buildUrl(url!, params, paramsSerializer)
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformReponse)
  return res
}

function throwIfCancellationRequested(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}

export default dispatchRequest
