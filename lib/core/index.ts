/**
 * 处理请求
 */

import { request, setConfig } from '../http'

import { AxiosCapsDeclare } from '../types/base'

const NOT_FOUND_REQUEST = { code: -1, data: {}, message: '找不到该接口配置' }

const BASE_ERROR_RESPONSE = { code: -2, message: '请求有误', data: {} }

const CATCH_ERROR_RESPONSE = { code: -3, message: '请求失败', data: {} }

export class Core {

  host: AxiosCapsDeclare.GlobalSetting['host']
  domain: AxiosCapsDeclare.GlobalSetting['domain'] // 缓存、cookie等挂靠的域名
  defaultHeader: AxiosCapsDeclare.GlobalSetting['defaultHeader'] // 全局header(一些特殊header，比如需要读localstorage中某个参数传后端，需要自己二次封装)
  defaultParams: AxiosCapsDeclare.GlobalSetting['defaultParams'] // 全局默认params
  timeout: AxiosCapsDeclare.GlobalSetting['timeout'] // 全局通用超时时间
  requestConfig: AxiosCapsDeclare.GlobalSetting['requestConfig'] // 请求配置

  public constructor (config: AxiosCapsDeclare.GlobalSetting) {
    this.host = config.host
    this.domain = config.domain
    this.defaultHeader = config.defaultHeader
    this.defaultParams = config.defaultParams
    this.timeout = config.timeout
    this.requestConfig = config.requestConfig

    this.set_config(this.requestConfig)
  }
  
  public do (api_options: AxiosCapsDeclare.ApiSetting, params: Record<string, unknown>, header = {}) {
    try {
      const request_body = this.get_request_body(api_options, params, header)
      const res = request(request_body)
      return this.get_response(res)
    } catch (e) {
      console.log(e)
      return CATCH_ERROR_RESPONSE
    }
  }

  public get_request_body (api_options: AxiosCapsDeclare.ApiSetting, params: Record<string, unknown>, header = {}) {
    return {
      type: api_options.type,
      url: api_options.host + this.get_static_path(api_options.path, params),
      params: this.get_params(params),
      headers: this.get_header(header)
    }
  }

  // 设置header
  public get_header (header: Record<string, any>) {
    return Object.assign(this.defaultHeader, header)
  }

  // 设置请求参数
  public get_params (params) {
    return Object.assign(this.defaultParams, params)
  }

  // 设置返回
  // code 1000以上后台正常返回 0-1000 浏览器异常情况（404等） -1000 - 0 后台异常
  public get_response (response) {
    if (response) {
      if (response.code) {
        return response
      } else {
        return { code: 404, data: response, message: '接口有误' }
      }
    } else {
      return BASE_ERROR_RESPONSE
    }
  }

  // 设置默认配置
  public set_config (config) {
    setConfig(config)
  }

  // 处理动态链接，参数转化
  public get_static_path (url: string, params: Record<string, any>): string {
    const match_name = url ? url.match(/\$.*?\$/g) : undefined
    let res
    if (match_name) {
      res = url
      for (const item of match_name) {
        res = res.replace(item, params[item.replace(/\$/g, '')])
      }
      return res
    } else {
      return url
    }
  }

  // 没有接口配置时，返回 获取不到接口配置
  public return_not_found_request () {
    return NOT_FOUND_REQUEST
  }
  
}

export default Core
