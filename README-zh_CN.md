[English](https://github.com/jonnyshao/wechat-fetch) | 简体中文

wx.request对象
-----
对微信小程序wx.request对象进行了扩展，基于promise设计。支持微信小程序、微信小游戏。
[小程序wx.request文档](https://developers.weixin.qq.com/miniprogram/dev/api/wx.request.html)

功能特色
-----
```
  使用简单，基于promise链式调用
  请求拦截、响应拦截
  API丰富，适用于复杂项目
```
### 安装
```
  npm i wefetch -S
```
### 在小程序中引用(npm 构建)
```
  const wf = require('wefetch')
```
### 下载到本地
```
  git clone https://github.com/jonnyshao/wechat-fetch.git
  cd server
  npm i 
  npm start 

  使用开发者工具打开Mini-Program目录
```
[小程序开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
### 使用示例
```
  // 一个简单的GET请求
  wf.get(url).then(res => {
    // ....
  })

  // 配置项目统一请求域名
  wf.defaults.baseUrl = 'youdomain'
  
  // 配置项目统一请求拦截
  wf.before.use(function (request) {
    // 业务逻辑....
    return request;
  })

  // 配置项目统一响就拦截
  wf.after.use(function (response) {
    // 业务逻辑...
    return response;
  })

  // post请求，这里的post请求Content-Type不再是小程序默认的application/json，而是// application/x-www-form-urlencoded;charset=utf-8，如果需要JSON格式，请使用wf.postJson()
  wf.post(url, {data: data}, {header: {token: xxx},responseType: 'arraybuffer', dataType: xx}).then(res =>{
    // ...
  }).catch((err => {
    // ...
  }))
  
  // 停止当前请求
  var p = wf.get(url).then(res => {

  })
  // 调用abort方法
  p.task.abort()
  [小程序RequestTask文档](https://developers.weixin.qq.com/miniprogram/dev/api/RequestTask.html?search-key=request)
  
  // 请求完成事件
  wf.get(url).then(() => {

  }).catch(err => {

  }).finally(() => {
    // 请求完成...
  })
```
### API
```
  wf.get(url, params, config)
  wf.post(url, params, config) // application/x-www-form-urlencoded;charset=utf-8
  wf.head(url, params, config)
  wf.put(url, params, config)
  wf.get(url, params, config)
  wf.trace(url, params, config)
  wf.delete(url, params, config)
  wf.postJson(url, params, config) //application/json;charset=utf-8
```

### defaults 默认参数
```
  defaults: {
    baseUrl: '',
    createRequest: wx.request 
    header: {}，
    data: {},
    dataType: 'json',  //微信默认值
    responseType: 'text' //微信默认值
  }
```

### 致开发者
```
  欢迎提交各种需求或BUG反馈![猛戳这里](https://github.com/jonnyshao/wechat-fetch/issues)
```