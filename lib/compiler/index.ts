/**
 * 解析yaml，转化为api配置
 */

import YAML from 'yaml'
import fs from 'fs'
import path from 'path'

/**
 * 进行解析
 *
 * @param {{ path?: string, type: string, config?: any }} options
 * @returns {Record<string, unknown>}
 */
export const doComply = (options: { path?: string, type: string, config?: any }): Record<string, unknown> => {
  if (options.type === 'yml') {
    // vite环境中执行会有问题
    const __dirname = path.resolve(path.dirname(''))
    const file_path = path.resolve(__dirname, options.path)
    const buffer = fs.readFileSync(file_path, 'utf8')
    const config = YAML.parse(buffer)

    return config
  } else if (options.type === 'object' || options.config) {
    // 支持直接传入对象使用
    return options.config
  } else {
    return {}
  }
}

export default {
  doComply
}
