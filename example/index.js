import { AxiosCaps } from '../dist'
import config from './request_setting'

const options = { api_path: 'example/example_apis.yml', api_path_type: 'yml'}
const fetch = new AxiosCaps(config, options)

const res = fetch.fetch('base.list', {})

console.log(res)

// res.then((rl) => {
//   console.log(rl, '-=-=-=-')
// })