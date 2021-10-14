import { AxiosCaps } from '../dist'
import config from './request_setting'

// // 通过YML文件读取api配置
const options = { path: 'example/example_apis.yml', path_type: 'yml'}
// const fetch = new AxiosCaps(config, options)

// const res = fetch.fetch('base.list', {})

// console.log(res)

// res.then((rl) => {
//   console.log(rl, '-=-=-=-')
// })

// 手动传入api配置
import YAML from 'yaml'
import fs from 'fs'
import path from 'path'
// const file_path = path.resolve(__dirname__, options.path)
const buffer = fs.readFileSync(options.path, 'utf8')
const yaml_config = YAML.parse(buffer)
const api_options = { type: 'object', config: yaml_config }
const fetch2 = new AxiosCaps(config, api_options)
const res2 = fetch2.fetch('base.list', {})
console.log(res2)