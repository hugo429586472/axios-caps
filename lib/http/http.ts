/**
 * http配置
 */
// import config from '../config/index'
import axios from 'axios'
import qs from 'qs'
import type { RepeatInterceptor } from '../types/base'

// const CancelToken = axios.CancelToken // 取消请求
const clearRequest = {
  source: {
    token: null,
    cancel: null
  }
}
// 超时时间
axios.defaults.timeout = 30000
// 重复请求判定时间
const repeatSetTime = 500
// 重复返回判定时间
const repeatResponseTime = 500

let pendingInterceptors = null

// axios.defaults.baseURL = config.host
// http请求拦截器
axios.interceptors.request.use((config: any) => {
  if (config.data && (config.data.file || (config.data.get && (config.data.get('file') || config.data.get('files'))))) {
    config.headers['Content-Type'] = 'multipart/form-data'
    // axios.defaults.withCredentials = true
  }
  config.cancelToken = clearRequest.source.token
  config.paramsSerializer = function (params: any) {
    return qs.stringify(params, {arrayFormat: 'brackets'})
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 重复请求拦截器处理
const setPendingInterceptors = (repeatRequestInterceptor: RepeatInterceptor) => {
  axios.interceptors.request.eject(pendingInterceptors)
  if (!repeatRequestInterceptor) return

  pendingInterceptors = axios.interceptors.request.use((config: any) => {
    if (repeatRequestInterceptor.use) {
      let requestMes = repeatRequestInterceptor.key || getRequestIdentify(config)
      removePending(requestMes, true)
    }
    return config
  }, error => {
    return Promise.reject(error)
  })
}

// 处理重复请求
let pending = {}
/**
 * config: 请求数据
 * 给每个请求加上标识
 */
const getRequestIdentify = (config: any, isReuest = false) => {
  let url = config.url
  if (isReuest) {
    url = config.method + ':' + config.baseURL + config.url.substring(1, config.url.length)
  }
  return config.method === 'get' ? encodeURIComponent(url + JSON.stringify(config.params)) : encodeURIComponent(config.url + JSON.stringify(config.data))
}

// key: 请求标识；isRequest 完成请求后也需要执行删除记录，所以添加此参数避免执行无用操作
const removePending = (key, isRequest = false) => {
  if (pending[key] && pending[key].t && isRequest) {
    // pending[key]中存放cancelToken对象
    const nowT = Date.now()
    // 2秒内重复请求取消
    if (nowT - pending[key].t <= repeatSetTime) {
      let err = new Error('repeat request: ' + key)
      err.name = 'RepeatRequestError'
      err.message = 'repeat request'
      throw err
    } else {
      // delete pending[key] // 把这条记录从 pending 中移除
      pending[key] = {
        t: Date.now()
      }
    }
  } else if (isRequest) {
    pending[key] = {
      t: Date.now()
    }
  }
}

// 处理重复返回
// 格式： {响应码: 上次返回时间}
let responsePending = {}

// key: 请求标识；isRequest 完成请求后也需要执行删除记录，所以添加此参数避免执行无用操作
const removeResponsePending = (key, isRequest = false) => {
  if (responsePending[key] && responsePending[key].t && isRequest) {
    // pending[key]中存放cancelToken对象
    const nowT = Date.now()
    // 重复返回取消
    if (nowT - responsePending[key].t <= repeatResponseTime) {
      let err = new Error('repeat response: ' + key)
      err.name = 'RepeatResponseError'
      err.message = 'repeat response'
      throw err
    } else {
      // delete pending[key] // 把这条记录从 pending 中移除
      responsePending[key] = {
        t: Date.now()
      }
    }
  } else if (isRequest) {
    responsePending[key] = {
      t: Date.now()
    }
  }
}

/**
 * config: 返回数据
 * 给每个返回加上标识
 */
const getResponseIdentify = (data, isReuest = false) => {
  // TODO: 这里重复判断应该要换个方式
  if (data.data && data.status === 200 && data.data.code < 10000) {
    return data.data.code
  } else {
    return null
  }
}

// http响应拦截器
axios.interceptors.response.use(data => {
  // 这块拦截逻辑处理太单一了，会有问题，先去掉
  // let responseCode = getResponseIdentify(data)
  // if (responseCode) {
  //   removeResponsePending(responseCode, true)
  // }
  return data
}, error => {
  return Promise.reject(error)
})

export default { axios, clearRequest, setPendingInterceptors }
