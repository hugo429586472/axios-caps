
import LocalStorage from "../utils/localstorage"

type AllowTypes = 'localstorage' | 'sessionstorage'

export class Cache {
  storage: any

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

  public create_cache (key: string, value: any, timeout: number = undefined): void {
    this.storage.set(key, value, timeout)
  }

  public get_cache (key: string): any {
    return this.storage.get(key)
  }
}

export default Cache