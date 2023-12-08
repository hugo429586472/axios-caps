/**
 * 接口库全局配置
 * 因可能需要根据环境变量等配置进行初始化，这里先不用yml格式
 */
export default {
  host: {
    main: 'http://localhost: 3030/api/',
    external: 'https://api.google.com/'
  },
  domain: '', // 缓存、cookie等挂靠的域名
  headers: {
    version: '0.0.1',
    'Content-Type': 'application/json'
  }, // 全局header(一些特殊header，比如需要读localstorage中某个参数传后端，需要自己二次封装)
  params: {}, // 全局默认params
  timeout: 3000, // 全局通用超时时间
}