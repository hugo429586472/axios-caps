
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
  
  // 请求接口获取数据
  public async fetch (key: string, params: AxiosCapsDeclare.CommonParams, headers = {}) {
    const api_config = this.get_api(key)
    if (api_config) {
      api_config.host = this.get_host(api_config.host)
      return await this.core.do(api_config, params, headers)
    } else {
      return this.core.return_not_found_request()
    }
  }

  /* 传入自定义参数进行接口调用 */
  public custom_fetch (options: AxiosCapsDeclare.ApiSetting, params: AxiosCapsDeclare.CommonParams, headers = {}): AxiosCapsDeclare.Response | false {
    return this.core.do(options, params, headers)
  }

  // 或者key对应的api配置
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

  // 处理域名
  public get_host (key: string) {
    return this.config.host[(!key || key === '') ? 'main' : key]
  }
}

export const getInstance = () => {
  return instance
}

export default AxiosCaps