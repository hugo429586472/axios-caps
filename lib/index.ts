
import { doComply } from './compiler'
import Core from './core'

import { AxiosCapsDeclare, CoreInstance } from './types/base'

let instance = null  // AxiosCaps的实例对象，用于各处获取对象进行请求

export class AxiosCaps {
  config: AxiosCapsDeclare.GlobalSetting
  core: CoreInstance
  apis: Record<string, unknown>

  public constructor (config, options: AxiosCapsDeclare.ComplierOPtions) {

    this.config = config

    this.core = new Core(this.config)
    this.apis = doComply(options)
    instance = this
  }
  
  // 请求接口获取数据
  public fetch (key: string, params: AxiosCapsDeclare.CommonParams, header = {}): AxiosCapsDeclare.Response | false {
    const api_config = this.get_api(key)
    if (api_config) {
      api_config.host = this.get_host(api_config.host)
      return this.core.do(api_config, params, header)
    } else {
      return this.core.return_not_found_request()
    }
  }

  /* 传入自定义参数进行接口调用 */
  public custom_fetch (options: AxiosCapsDeclare.ApiSetting, params: AxiosCapsDeclare.CommonParams, header = {}): AxiosCapsDeclare.Response | false {
    return this.core.do(options, params, header)
  }

  // 或者key对应的api配置
  public get_api (key: string): AxiosCapsDeclare.ApiSetting | false {
    if (!key) return false
    const keys = key.split('.')
    let res: any = this.apis
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
    if (!key || key === '') key = 'main'
    return this.config.host[key]
  }
}

export const getInstance = () => {
  return instance
}

export default AxiosCaps