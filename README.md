# axios-caps

基于axios二次封装的http请求客户端，统一规范前端项目接口层

## 功能点

- [x] [axios支持的功能](https://github.com/axios/axios/blob/5bc9ea24dd/README.md#features)

- [x] 从浏览器发出 XMLHttpRequests

- [x] 支持 Promise API

- [x] 支持根据特定规则过滤参数，实现动态接口

- [x] 拦截请求和响应，可以设置是否拦截重复请求、是否归并重复返回，以及重复请求、返回相关参数（判定时间等）

- [x] 将返回归类，自动处理正常返回与失败返回（400、500+等），并归纳返回

- [ ] 内置缓存模块，支持外部传入 是否缓存、缓存key、缓存时间

- [ ] 支持上传文件和自定义文件参数 与 文件返回处理

- [ ] 国际化

- [ ] 文件格式处理

## 安装

npm安装

```console

npm install axios-caps

```

yarn 安装

```console

yarn add axios-caps

```

js直接引入暂不支持

注：如果是vite项目中引入，需要处理path包和process对象，以及将path包引入改为path-browserify

```console

npm install path-browserify --save-dev

```

```js
// vite.config.js中
import { defineConfig, loadEnv } from 'vite'

export defineConfig({ mode }) => {
  return {
    define: {
      'process.env': { ...process.env, ...loadEnv(mode, root) },
      'process.argv': process.argv,
    },
    resolve: {
      alias: [
        ...
        {
          find: 'path',
          replacement: 'path-browserify'
        }
      ],
    },
    ...
  }
}
```

## 示例

详细示例与参数说明可以到example目录中查看

### 注册实例

```js

// main.js等全局引入
import AxiosCaps from 'axios-caps'

// 接口全局配置
const config = {
  host: {
    main: 'localhost: 3030/',
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

// yml文件传入api配置 可以通过传入path与type定义接口配置
// 注：该方式在vite项目中引入需要通过preload或者其他方式进行处理
new AxiosCaps(config, { path: '../example/example_apis.yml', type: 'yml'})

// 通过对象传入api配置
new AxiosCaps(config, { type: 'object', config: { user: { login: {path: 'user/login', type: 'post'} } } })

```

### 使用

#### vue3中

```js

import { getInstance } from 'axios-caps'
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {
    const axios_instance = getInstance()

    axios_instance.fetch('user.login',  // key
      {
        username: 'admin',
        password: 'admin'
      }, // params
      { token: 'admin' } // headers
    ).then((response) => {
      if (response.code >= 10000) {
        console.log('success response')
      } else if (response.code > 0) {
        console.log('error response', response.message)
      }
    })
  }
})

```

## 全局配置

见types/index.d.ts文件中GlobalSetting配置

## 接口配置

见types/index.d.ts文件中ApiSetting配置

## API

### instance.fetch(key, params, headers)

请求接口方法

**key**
接口配置文件（example_apis.yml）中，对应路径的接口配置，如user.login对应

```yml
user:
  login:
    path: user/login
    type: post
```

详细参数见types/index.d.ts文件中ApiSetting配置

**params**
请求参数，get请求中会写到url中

**headers**
请求头，会与全局配置中headers进行合并

### instance.get_api(key)

获取api配置

**key**
接口配置文件（example_apis.yml）中，对应路径的接口配置，如user.login对应

## TypeScript

包含TypeScript定义，可以通过```import { AxiosCapsDeclare } from 'axios-caps'```引入类型定义

## MIT
