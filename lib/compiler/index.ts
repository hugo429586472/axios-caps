/**
 * 解析yaml，转化为api配置
 */

import YAML from 'yaml'
import fs from 'fs'
import path from 'path'

const __dirname = path.resolve(path.dirname(''))

/* 进行解析 */
export const doComply = (options: { path: string, type: string }): Record<string, unknown> => {
  if (!options.type || options.type === 'yml') {
    const file_path = path.resolve(__dirname, options.path)
    const buffer = fs.readFileSync(file_path, 'utf8')
    const config = YAML.parse(buffer)

    return config
  } else {
    return {}
  }
}

export default {
  doComply
}
