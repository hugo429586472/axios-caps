// 单元测试
import AxiosCaps from '../dist'
import config from './request_setting'

const instance = new AxiosCaps(config, { api_path: './example_apis.yml', api_path_type: 'yml'})

instance.fetch('base.list', {})