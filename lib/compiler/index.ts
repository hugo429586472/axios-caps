/**
 * 解析yaml，转化为api配置
 */

import * as YAML from 'yaml'
import * as fs from 'fs'


/* 进行解析 */
export const doComply = (options: { path: string, type: 'yml' }): Record<string, unknown> => {
  if (options.type === 'yml') {
    const buffer = fs.readFileSync(options.path, 'utf8')
    const config = YAML.parse(buffer)

    return config
  } else {
    return {}
  }
}

export default {
  doComply
}
