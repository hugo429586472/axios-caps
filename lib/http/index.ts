import { AxiosRequestConfig } from 'axios'
import http from './http'

let base_config: AxiosRequestConfig = {
  timeout: 3000 // 默认30s超时
}

/**
 * http请求
 *
 * @param {*} options
 * @returns
 */
export const request = async (options) => {
  let request_body: AxiosRequestConfig = Object.assign(base_config, {
    method: options.type,
    url: options.url,
    canRepeat: options.canRepeat,
    headers: options.headers,
    responseType: options.responseType
  })
  let params = options.params
  // post和get的传参不一样
  if (options.type === 'post') {
    request_body.data = params
  } else {
    request_body.params = params
  }

  // TODO 处理 文件流 返回
  // TODO 缓存处理
  const res = await http.axios(request_body)
  return res
}

/**
 * 设置请求配置
 *
 * @param {*} [config={}]
 */
export const setConfig = (config = {}) => {
  base_config = Object.assign(base_config, config)
}

export default {
  request,
}