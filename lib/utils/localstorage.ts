/*
  * 封装localstorage，设置过期时间
  * @author hugo
*/
declare interface StorageValue<T> {
  value?: T,
  _time?: number,
  _age?: number,
  _isObject?: boolean
}

class LocalStorage {
  age: number

  /**
   * Creates an instance of LocalStorage.
   *  过期时间，默认30分钟
   * 
   * @param {number} [_age=30 * 60 * 1000]
   * @memberof LocalStorage
   */
  constructor (_age = 30 * 60 * 1000) {
    this.age = _age
  }

  /**
   * 设置过期时间
   * 
   * @param age
   */
  public set_age (age: number): void {
    this.age = age
  }

  /**
   * 设置 localStorage
   * 
   * @param key
   * @param value
   */
  public set (key: string, value: any, age: number = undefined) {
    if (typeof localStorage == 'undefined') return

    localStorage.removeItem(key)
    let isObject = value instanceof Object && !(value instanceof Array)
    let _time = new Date().getTime()
    let _age = age || this.age

    let _v: StorageValue<typeof value> = {}
    _v.value = value
    // 如果不是对象，新建一个对象把 value 存起来
    // if (!isObject) {
    //   let b = value
    //   value = {}
    //   value._value = b
    // }
    // 加入时间
    _v._time = _time
    // 过期时间
    _v._age = _time + _age
    // 是否一个对象
    _v._isObject = isObject
    localStorage.setItem(key, JSON.stringify(_v))
  }

  /**
   * 判断一个 localStorage 是否过期
   * 
   * @param key
   * @returns {boolean}
   */
  public is_expire (key: string): boolean {
    if (typeof localStorage == 'undefined') return

    let isExpire = true
    let value = localStorage.getItem(key)
    let now = new Date().getTime()

    if (value) {
      const parseValue = JSON.parse(value) as StorageValue<any>
      // 当前时间是否大于过期时间
      isExpire = now > parseValue._age
    } else {
      // 没有值也是过期
    }
    return isExpire
  }

  /**
   * 获取某个 localStorage 值
   * 
   * @param key
   * @returns {*}
   */
  public get (key: string): any {
    if (typeof localStorage == 'undefined') return

    let isExpire = this.is_expire(key)
    let value: any = null
    if (!isExpire) {
      value = localStorage.getItem(key)
      value = JSON.parse(value) as StorageValue<any>
      // if (!value._isObject) {
      //   value = value._value
      // }
      value = value.value
    } else {
      localStorage.removeItem(key)
    }
    return value
  }

  /**
   * 删除某个 localStorage 值
   * 
   * @param key
   */
  public remove (key: string): void {
    if (typeof localStorage == 'undefined') return

    localStorage.removeItem(key)
  }
}

export default LocalStorage
