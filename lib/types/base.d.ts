/**
 * 全局参数与接口参数类型定义
 */

import { AxiosRequestConfig, Method } from 'axios'

interface Host {
  [key: string]: string
}

type ExtHeaders = Headers & {
  [key: string]: string
}

interface Domain {}

interface Params {
  [key: string]: unknown
}

interface RepeatInterceptor {
  use: boolean  // 是否不允许重复请求（先判断缓存，再判断这个）
  key: string // 自定义请求key，不设置则会自动生成，设置后同一key请求在一段时间内都不会执行（防抖）
  duration: number // 不允许多少时间内的重复请求
}

interface Cookie {
  use: boolean
}

interface Cache {
  use: boolean // 是否使用cache缓存
  key: string  // 自定义缓存键，可以通过同名缓存键获取数据
  timeout: number // 缓存时间
}

// 全局参数
declare namespace AxiosCapsDeclare {

  export interface ComplierOPtions {
    path?: string
    type: string
    config?: any
  }
  export interface GlobalSetting {
    host: Host
    domain: string // 缓存、cookie等挂靠的域名
    defaultHeader: ExtHeaders // 全局header(一些特殊header，比如需要读localstorage中某个参数传后端，需要自己二次封装)
    defaultParams: Params // 全局默认params
    timeout: number // 全局通用超时时间，默认3000
    requestConfig: AxiosRequestConfig // 请求配置
  }

  // 接口参数
  export interface ApiSetting {
    host: string // 使用base对应的域名（main为默认值）
    path: string // $menu$ 代表需要通过参数中的menu对象的值进行过滤
    type: Method
    cookie: Cookie
    cache: Cache
    header: ExtHeaders
    repeat_request_interceptor: RepeatInterceptor
    repeat_reponse_interceptor: RepeatInterceptor
  }

  // 返回数据格式
  export interface Response {
    code: number // 1000以上后台正常返回 0-1000 浏览器异常情况（404等） 0以下后台异常
    data?: any // 返回数据
    created_at?: string
    message: string // 返回信息
  }

  export interface CommonParams {
    string: unknown
  }
}

export interface CoreInstance {
  do: Function,
  return_not_found_request: Function
} 

declare module 'axios-caps' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whatever: any;
  export = whatever;
}