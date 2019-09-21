import { AxiosRequestConfig, AxiosStatic } from './types'
import Axios from './core/Axios'
import { extend } from './utils'
import defaults from './defaults'
import mergeConfig from './core/mergeConfig'
import CancelToken from './cancel/CancelToken'
import Cancel, { isCancel } from './cancel/Cancel'

function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config)
  const instance = Axios.prototype.request.bind(context)
  // 将instance本身变为一个函数
  // 为函数本身添加方法
  extend(instance, context)
  return instance as AxiosStatic
}

const axios = createInstance(defaults)

// axios的create方法
axios.create = config => {
  return createInstance(mergeConfig(defaults, config))
}

axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel

axios.all = promises => {
  return Promise.all(promises)
}

axios.spread = callback => {
  return arr => {
    return callback.apply(null, arr)
  }
}

axios.Axios = Axios

export default axios
