[English](https://github.com/jonnyshao/wefetch) | 简体中文

# wefetch
[![platform](https://badgen.net/badge/platform/微信,支付宝,百度?list=1&color=green)](https://github.com/jonnyshao/wefetch)
[![Package Quality](https://npm.packagequality.com/badge/wefetch.png)](https://packagequality.com/#?package=wefetch)
[![install size](https://packagephobia.now.sh/badge?p=wefetch)](https://packagephobia.now.sh/result?p=wefetch)
[![npm version](https://badgen.net/npm/v/wefetch?color=green)](https://www.npmjs.com/package/wefetch)
[![gzip](https://badgen.net/badgesize/gzip/https://unpkg.com/wefetch@1.2.1/dist/wefetch.min.js)](https://unpkg.com/wefetch@1.2.1/dist/wefetch.min.js)
[![downloads](https://badgen.net/npm/dm/wefetch)](https://www.npmtrends.com/wefetch)

基于Promise，链式编程。支持微信、支付宝、百度小程序

## 功能&&特色

- 微信小程序 [wx.request](https://developers.weixin.qq.com/miniprogram/en/dev/api/network-request.html#wxrequestobject) API 
- 微信小程序 [wx.downloadFile](https://developers.weixin.qq.com/miniprogram/en/dev/api/network-file.html#wxdownloadfileobject) API 
- 微信小程序 [wx.uploadFile](https://developers.weixin.qq.com/miniprogram/en/dev/api/network-file.html#wxuploadfileobject) API 
- 支付宝小程序 [my.httpRequest](https://docs.alipay.com/mini/api/network#a-nameco0fvaamyhttprequest) API 
- 支付宝小程序 [my.uploadFile](https://docs.alipay.com/mini/api/network#a-namey24rltamyuploadfile) API 
- 支付宝小程序 [my.downloadFile](https://docs.alipay.com/mini/api/network#a-nameal4taaamydownloadfile) API 
- 百度小程序 [swan.request](https://smartprogram.baidu.com/docs/develop/api/net_request/#request/) API 
- 百度小程序 [swan.uploadFile](https://smartprogram.baidu.com/docs/develop/api/net_uploadfile/#uploadFile/) API 
- 百度小程序 [swan.downloadFile](https://smartprogram.baidu.com/docs/develop/api/net_uploadfile/#downloadFile/) API
- 支持 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) API
- 请求响应与拦截管理
- 支持小程序[RequestTask](https://developers.weixin.qq.com/miniprogram/dev/api/wx.request.html) 对象同步管理

## 安装

```js
npm i wefetch
```

## 示例

发送一个 `GET` 请求
```js
const wf = require('wefetch')
wx.showLoading({
  title: '加载中...',
  mask: true
})
wf.get(url).then(res => {
// ....
}).catch(err => {
// ...
})
// 请求完成执行
.finally(() => {
    wx.hideLoading()
})
    
 wf.get('/get', 
 { 
     title: 'get Test', 
     content: 'get' 
 }, 
 { 
     header: { demo: 'demo' } 
 })
.then(res => {
    // handle success
    console.log(res)
}).catch(error => {
    // handle error
    console.log(error)
}).then( _ => {
   // always executed
})
```
发送一个 `POST` 请求
```js
wf.post('/post',{title: 'post test', content: 'post'})
.then(res => {
    console.log(res)
}).catch(err => {
    console.log(err)
})
```
发送一个 `POSTJSON` 请求
```js
// the request header `Content-Type` property is a 'application/json;charset=uft-8'

wf.postJson('/postJson')
.then( res => {
    console.log(res);
})
```

发送多个 `并发` 请求
```js
const getUserInfo = prams => wf.get('/user/1', params)
const getUserPermissions = params => wf.get('/user/1/permission', params)
wf.all([getUserInfo(), getUserPermissions()])
.then(res => {
    // both requests are complete, the res as a Array back
})
```

发送一个 `上传` 请求
```js

const chooseImage = wf.promisify(wx.chooseImage)
// using for wechat Mini Program
chooseImage().then(res => {
   wf.upload('/upload', {
           filePath: res.tempFilePaths[0],
           name:'file'
   })
   .then(res =>{
     console.log(res)
    })
 })
chooseImage().then(res => {
   wf.upload({
       filePath: res.tempFilePaths[0],
       name:'file'
   })
   .then(res =>{
     console.log(res)
    })
 })
```

发送一个 `下载` 请求
```js
wf.download('/download')
.then(res => {
    console.log(res)
})

wf.download({
    url:'/download'
})
.then(res => {
    console.log(res)
})
```
## 使用 async/await 
> async/await 是ECMAScript 2017部分，截止目前微信小程序还未支持, 在我们使用之前需要引入一个Facebook `regeneratorRuntime`的库 ,为了方便使用，已经单独抽离出来

[wehcat-regenerator-runtime](https://github.com/jonnyshao/wehcat-regenerator-runtime)
```js
const regeneratorRuntime = require('wehcat-regenerator-runtime');

// es6 write
async onload () {
    let res = await wf.get('/get')
    console.log(res)
    
    // do something....
}

// Es5 write
onload: async function () {
  let res = await wf.get('/get')
      console.log(res)
      
      // do something....
}
```
## 获取小程序`requestTask` 对象
`get` 请求代码示例:
```js
    wf.get('/get',{},{eventType: 'get'})
    
    //  取消请求
    wf.on('get', t => {
        t.abort()
    })
    // 处理多个请求
    wf.get('/user/info',{},{eventType:'user'})
    wf.get('/user/permission',{},{eventType: 'user'})
    wf.on('user', t => {
        // 当前注册的user事件函数会执行两次，依次类推
        t.abort()
    })
```
`上传` 请求代码示例:

```js
// promisify
const chooseImage = wf.promisify(wx.chooseImage)
  chooseImage().then(res => {
    wf.upload('http://your-domain/upload', {
        filePath: res.tempFilePaths[0],
        name: 'file',
    }, { eventType: 'upload'}).then(res => {
            console.log(res)
    });
    wf.on('upload', t => {
        t.onProgressUpdate((res) => {
            console.log('upload progress', res.progress)
            console.log('length of data already uploaded', res.totalBytesSent)
            console.log('total length of data expected to be uploaded', res.totalBytesExpectedToSend)
        })
    })
});
// or like this:
chooseImage().then(res => {
    wf.upload({
        url: 'http://your-domain/upload',
        filePath: res.tempFilePaths[0],
        name: 'file',
        eventType: 'upload'
    }).then(res => {
        console.log(res)
    });
    wf.on('upload', t => {
        t.onProgressUpdate((res) => {
            console.log('upload progress', res.progress)
            console.log('length of data already uploaded', res.totalBytesSent)
            console.log('total length of data expected to be uploaded', res.totalBytesExpectedToSend)
        })
    })
})
```
##  wefetch API
####  wf.request(config)
####  wf.get(url, params, config)
####  wf.post(url, params, config) 
####  wf.head(url, params, config)
####  wf.put(url, params, config)
####  wf.get(url, params, config)
####  wf.trace(url, params, config)
####  wf.delete(url, params, config)
####  wf.upload(url, params, config)
####  wf.download(url, params, config)
####  wf.postJson(url, params, config) //application/json;charset=utf-8

<strong>小程序的上传与下载是单独不同的的api，wx.request这个方法不适用这种操作，请单独调用wf.upload 或 wf.download</strong>

创建一个实例
> 您可以创建实例，并自定义实例的配置
```js
const instance = wf.create({
    baseUrl: 'http://your-domain.com/api'
    //....
})
```
实例中的方法
####  instance.request(config)
####  instance.get(url, params, config)
####  instance.post(url, params, config) 
####  instance.head(url, params, config)
####  instance.put(url, params, config)
####  instance.get(url, params, config)
####  instance.trace(url, params, config)
####  instance.delete(url, params, config)
####  instance.upload(url, params, config)
####  instance.download(url, params, config)
####  instance.postJson(url, params, config) //application/json;charset=utf-8

## 请求参数配置
```js
{
    // `url` 服务器请求路径
    url: '/user',
    
    // `baseURL` 与 `url` 会合并一个完整的 url, `baseURl` 将会在 `url` 前面
    baseUrl:'http://your-domain.com/api',
    
    // 默认请求 `get`
    method: 'get', 
    /*
    * 如果您的项目请求路径、上传路径、下载路径都不一样的情况下，可以单独对`uploadUrl` and `downloadUrl`进行设置
    * */
    uploadUrl:'http://your-domain.com/upload',
    
    downloadUrl: 'http://your-domain.com/download',
    
    // 仅支付宝小程序支持
    timeout: 0,
    
    // 在wefetch中，可以注册一个事件对象，用来同步管理小程序的reqeustTask对象，`eventType` 是注册事件时定义的事件类型
    eventType: ''
    // 默认的 `Content-Type`
    header: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
}
```
## 配置默认参数

**全局的 wefetch 默认参数**
```js
wf.defaults.baseUrl = 'http://your-domain.com/api';
wf.defaults.uploadUrl = 'http://your-domain.com/upload';
wf.defaults.downloadUrl = 'http://your-domain.com/download';
```
**自定义实例的参数**
```js
const instance = wf.create()
instance.defaults.baseUrl = 'http://your-domain.com/api';
instance.defaults.uploadUrl = 'http://your-domain.com/upload';
instance.defaults.downloadUrl = 'http://your-domain.com/download';
```
## 拦截器
> 拦截器在整个项目中只需注册一次，不同的实例都可以拥有自己的拦截器
```js
// 注册一个请求拦截器
wf.before.use(request => {
    // Do something before request is sent
    return request;
}, error => {
    // Do something with request error
    return Promise.reject(error);
})

// 注册一个响应拦截器
wf.after.use(response => {
    // Do something with response data
    return response;
}, error => {
    // Do something with response error
    return Promise.reject(error)
})
```

## 使用 wf.promisify提供的api promise化小程序的api
```js
const chooseImage = wf.promisify(wx.chooseImage)
// using in wechat Mini Program
chooseImage().then(res => {
    // Do something ...
    console.log(res)
})
```