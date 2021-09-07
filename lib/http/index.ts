import { AxiosRequestConfig } from 'axios'
import http from './http'

let base_config: AxiosRequestConfig = {
  timeout: 3000 // 默认30s超时
}

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

  const res = await http.axios(request_body)
  return res
}

export const setConfig = (config = {}) => {
  base_config = Object.assign(base_config, config)
}

export default {
  request,
}