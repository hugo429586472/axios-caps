// 单元测试
import AxiosCaps from '../dist'
import config from './request_setting'

const instance = new AxiosCaps(config, { path: './example_apis.yml', type: 'yml'})

instance.fetch('base.list', {})