
import { doComply } from './compiler'
import Core from './core'
import { deep_copy } from './utils/object'

import { AxiosCapsDeclare, CoreInstance } from './types/base'

let instance = null  // AxiosCaps的实例对象，用于各处获取对象进行请求

export class AxiosCaps {
  config: AxiosCapsDeclare.GlobalSetting
  core: CoreInstance
  apis: Record<string, unknown>

  public constructor (config: AxiosCapsDeclare.GlobalSetting, options: AxiosCapsDeclare.ComplierOPtions) {

    this.config = config

    this.core = new Core(this.config)
    this.apis = doComply(options)
    instance = this
  }
  
  /**
  * 公共的异步 fetch 方法，用于通过提供的 key 和参数发送请求
  * @param key - 请求的键值，用于获取对应的 API 配置
  * @param params - 请求的参数
  * @param headers - 请求的头信息，默认为空对象
  */
  public async fetch (key: string, params: AxiosCapsDeclare.CommonParams, headers = {}) {
    const api_config = this.get_api(key)
    if (api_config) {
      api_config.host = this.get_host(api_config.host)
      return await this.core.do(api_config, params, headers)
    } else {
      return this.core.return_not_found_request()
    }
  }

  /**
   * 发送自定义请求
   *
   * @param options - 请求设置
   * @param params - 请求参数
   * @param headers - 请求头部
   * @returns 请求响应或 false
   */
  public custom_fetch (options: AxiosCapsDeclare.ApiSetting, params: AxiosCapsDeclare.CommonParams, headers = {}): AxiosCapsDeclare.Response | false {
    // 调用内部方法 do，传递 options、params 和 headers 参数
    return this.core.do(options, params, headers)
  }


  /**
   * 根据提供的键来获取API设置，如果获取成功则返回相应的API设置，否则返回false
   *
   * @param key 为 "." 分隔的字符串，用于访问嵌套对象中的特定属性
   * @return 则返回 AxiosCapsDeclare.ApiSetting 类型的对象；如果键不存在或获取过程中出现错误，则返回 false
   *
   * 示例：
   * const apiKey = 'project.module.api';
   * const apiSetting = get_api(apiKey);
   */
  public get_api (key: string): AxiosCapsDeclare.ApiSetting | false {
    if (!key) return false
    const keys = key.split('.')
    let res: any = deep_copy(this.apis)
    for (const item of keys) {
      if (res) {
        res = res[item]
      } else {
        return false
      }
    }
    return res
  }

  /**
   * 获取指定键的host。如果没有提供键或键为空字符串，它将返回默认host。
   *
   * @param {string} key - 要获取其主机信息的键。
   * @returns {string | undefined} - 对应键的主机信息，如果键不存在则返回 undefined。
   */
  public get_host (key: string) {
    return this.config.host[(!key || key === '') ? 'main' : key]
  }
}

export const getInstance = () => {
  return instance
}

export default AxiosCaps