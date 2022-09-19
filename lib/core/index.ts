/**
 * 处理请求
 */

import { request, setConfig } from '../http'

import { Cache } from './cache'

import { AxiosCapsDeclare, Params } from '../types/base'

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
  cache: Cache

  /**
   * Creates an instance of Core.
   * @param {AxiosCapsDeclare.GlobalSetting} config
   * @memberof Core
   */
  public constructor (config: AxiosCapsDeclare.GlobalSetting) {
    this.host = config.host
    this.domain = config.domain
    this.defaultHeader = config.defaultHeader
    this.defaultParams = config.defaultParams
    this.timeout = config.timeout
    this.requestConfig = config.requestConfig
    this.cache = new Cache()

    this.set_config(this.requestConfig)
  }

  /**
   * 执行请求
   *
   * @param {AxiosCapsDeclare.ApiSetting} apiOptions
   * @param {Params} params
   * @param {*} [header={}]
   * @returns
   * @memberof Core
   */
  public async do (apiOptions: AxiosCapsDeclare.ApiSetting, params: Params, header = {}) {
    try {
      const cacheOptions = this.cahce_key(apiOptions, params)
      if (cacheOptions) {
        // 取缓存
        const cacheValue = this.cache.get_cache(cacheOptions.key)
        if (cacheValue) return cacheValue

        const responseRes = await this.do_request(apiOptions, params, header)
        // 设置缓存
        this.cache.create_cache(cacheOptions.key, responseRes, cacheOptions.timeout)
        return responseRes
      } else {
        const responseRes = await this.do_request(apiOptions, params, header)
        return responseRes
      }
    } catch (e) {
      return {
        ...CATCH_ERROR_RESPONSE,
        data: e
      }
    }
  }

  /**
   * 获取请求body
   *
   * @param {AxiosCapsDeclare.ApiSetting} apiOptions
   * @param {Params} params
   * @param {{}} header
   * @returns
   * @memberof Core
   */
  public get_request_body (apiOptions: AxiosCapsDeclare.ApiSetting, params: Params, header: {}) {
    const path = this.get_static_path(apiOptions.path, params)
    if (!path) throw '未找到该接口配置'
    return {
      type: apiOptions.type,
      url: (apiOptions.host || '') + this.get_static_path(apiOptions.path, params),
      params: this.get_params(params),
      headers: this.get_header(header)
    }
  }

  /**
   * 设置header
   *
   * @param {Record<string, any>} [header={}]
   * @returns {Record<string, any>}
   * @memberof Core
   */
  public get_header (header: Record<string, any> = {}): Record<string, any> {
    const deaultHeader = this.defaultHeader || {}
    return {
      ...deaultHeader,
      ...header
    }
  }

  /**
   * 设置请求参数
   *
   * @param {Params} [params={}]
   * @returns {Record<string, any>}
   * @memberof Core
   */
  public get_params (params: Params = {}): Record<string, any> {
    const defaultParams = this.defaultParams || {}
    return {
      ...defaultParams,
      ...params
    }
  }

  /**
   * 设置返回
   * code 1000以上后台正常返回 0-1000 浏览器异常情况（404等） -1000 - 0 后台异常
   *
   * @param {*} response
   * @returns {AxiosCapsDeclare.Response}
   * @memberof Core
   */
  public get_response (response): AxiosCapsDeclare.Response {
    if (response) {
      // 判断后台正常返回
      if (response.status < 400) {
        return response.data
      } else {
        return { code: 404, data: response, message: '接口服务有误，请求不到资源' }
      }
    } else {
      return BASE_ERROR_RESPONSE
    }
  }

  /**
   * 设置默认配置
   *
   * @param {*} config
   * @memberof Core
   */
  public set_config (config) {
    setConfig(config)
  }

  /**
   * 处理动态链接，参数转化
   *
   * @param {string} url
   * @param {Record<string, any>} params
   * @returns {string}
   * @memberof Core
   */
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

  /**
   * 没有接口配置时，返回 获取不到接口配置
   *
   * @returns {AxiosCapsDeclare.Response}
   * @memberof Core
   */
  public return_not_found_request (): AxiosCapsDeclare.Response {
    return NOT_FOUND_REQUEST
  }

  /**
   * 执行请求
   *
   * @protected
   * @param {AxiosCapsDeclare.ApiSetting} apiOptions
   * @param {Params} params
   * @param {*} [header={}]
   * @returns
   * @memberof Core
   */
  protected async do_request (apiOptions: AxiosCapsDeclare.ApiSetting, params: Params, header = {}) {
    const request_body = this.get_request_body(apiOptions, params, header)
    const res = await request(request_body)
    const responseRes = this.get_response(res)
    return responseRes
  }

  /**
   * 获取缓存key
   *
   * @protected
   * @param {AxiosCapsDeclare.ApiSetting} apiOptions
   * @param {Params} params
   * @returns
   * @memberof Core
   */
  protected cahce_key (apiOptions: AxiosCapsDeclare.ApiSetting, params: Params) {
    if (apiOptions?.cache?.use) {
      const cacheKey = apiOptions.cache.key || apiOptions.path
      return {
        key: this.get_static_path(cacheKey, params),
        timeout: apiOptions.cache?.timeout
      }
    } else {
      return undefined
    }
  }
  
}

export default Core
