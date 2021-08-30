import Fetch from '../dist'
import config from './request_setting'

const fetch = new Fetch(config, { api_path: './example_apis.yml', api_path_type: 'yml'})

fetch.fetch('base.list', {})