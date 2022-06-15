
import LocalStorage from "../utils/localstorage"

type AllowTypes = 'localstorage' | 'sessionstorage'

export class Cache {
  storage: any

  /**
   * Creates an instance of Cache.
   * @param {AllowTypes} [type='localstorage']
   * @memberof Cache
   */
  constructor (type: AllowTypes = 'localstorage') {
    switch (type) {
      case 'localstorage':
        this.storage = new LocalStorage()
        break
      default:
        this.storage = new LocalStorage()
        break
    }
  }

  /**
   * 创建缓存
   *
   * @param {string} key
   * @param {*} value
   * @param {number} [timeout=undefined]
   * @memberof Cache
   */
  public create_cache (key: string, value: any, timeout: number = undefined): void {
    this.storage.set(key, value, timeout)
  }

  /**
   * 获取缓存
   *
   * @param {string} key
   * @returns {*}
   * @memberof Cache
   */
  public get_cache (key: string): any {
    return this.storage.get(key)
  }
}

export default Cache