简体中文 | [English](https://github.com/jonnyshao/wefetch/blob/master/README-en.md)

# wefetch
[![install size](https://packagephobia.now.sh/badge?p=wefetch)](https://packagephobia.now.sh/result?p=wefetch)
[![npm version](https://badgen.net/npm/v/wefetch?color=green)](https://www.npmjs.com/package/wefetch)
[![gzip](https://badgen.net/badgesize/gzip/https://unpkg.com/wefetch@1.3.2/dist/wefetch.min.js)](https://unpkg.com/wefetch@1.3.2/dist/wefetch.min.js)
[![downloads](https://badgen.net/npm/dm/wefetch)](https://www.npmtrends.com/wefetch)

基于Promise，链式编程。支持微信、支付宝、钉钉、头条、百度小程序
## 支持的小程序平台

![WeChat](https://github.com/jonnyshao/wefetch/blob/master/assets/wechat.png) | ![AliPay](https://github.com/jonnyshao/wefetch/blob/master/assets/alipay.png) | ![DingDing](https://github.com/jonnyshao/wefetch/blob/master/assets/dingding.png) | ![Baidu](https://github.com/jonnyshao/wefetch/blob/master/assets/baidu.png) | ![Toutiao](https://github.com/jonnyshao/wefetch/blob/master/assets/tt.png) |
--- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ |

## 功能&&特点

- 微信小程序 [wx.request](https://developers.weixin.qq.com/miniprogram/en/dev/api/network-request.html#wxrequestobject) API 
- 微信小程序 [wx.downloadFile](https://developers.weixin.qq.com/miniprogram/en/dev/api/network-file.html#wxdownloadfileobject) API 
- 微信小程序 [wx.uploadFile](https://developers.weixin.qq.com/miniprogram/en/dev/api/network-file.html#wxuploadfileobject) API 
- 支付宝小程序 [my.request](https://docs.alipay.com/mini/api/network#a-nameco0fvaamyhttprequest) API 
- 支付宝小程序 [my.uploadFile](https://docs.alipay.com/mini/api/network#a-namey24rltamyuploadfile) API 
- 支付宝小程序 [my.downloadFile](https://docs.alipay.com/mini/api/network#a-nameal4taaamydownloadfile) API 
- 头条小程序 [tt.request](https://developer.toutiao.com/docs/api/request.html) API 
- 头条小程序 [tt.downloadFile](https://developer.toutiao.com/docs/api/downloadFile.html) API 
- 头条小程序 [tt.uploadFile](https://developer.toutiao.com/docs/api/uploadFile.html) API 
- 百度小程序 [swan.request](https://smartprogram.baidu.com/docs/develop/api/net_request/#request/) API 
- 百度小程序 [swan.uploadFile](https://smartprogram.baidu.com/docs/develop/api/net_uploadfile/#uploadFile/) API 
- 百度小程序 [swan.downloadFile](https://smartprogram.baidu.com/docs/develop/api/net_uploadfile/#downloadFile/) API
- 支持 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) API
- 请求、响应拦截管理
- 支持小程序[RequestTask](https://developers.weixin.qq.com/miniprogram/dev/api/wx.request.html) 对象同步管理

## 安装

```js
npm i wefetch
```
## wefetch 封装示例(仅供参考)
```js
const wf = require('wefetch');

class Request {
    // init
    constructor() {
        // 请求队列
        this.queue = {};
        // 配置请求域名
        this.baseUrl = 'http://your-domain.com';
        // 仅支付宝小程序支持
        this.timeout = 3000;
        // 创建 wefetch 实例
        this.instance = wf.create();
    }
    // 参数合并
    merge(options) {
        return { ...options, baseUrl: this.baseUrl }
    }
    // 请求失败可设置再次请求
    // times 为尝试的次数 request为请求方法(必须返回一个Promise对象) timout 可选 默认1秒
    retry(times,request,timeout){
      this.instance.retry(times,request,timeout)
    },
    // 取消请求 或使用 wf.abort(event,callback)
    abort(event,callback){
      this.instance.abort(event,callback)
    },
    // 获取上传或下载进度 或使用wf.onProcess(event,handle)
    onProcess(event,cb){
      this.instance.onProcess(event,cb)
    }
    // 设置拦截器
    interceptor(instance, url) {
        instance.before.use(req => {
            req.header.Authorization = 'type in your token';
            if (Object.keys(this.queue).length === 0) {
                wx.showLoading({
                    title: 'Loading',
                    mask: true
                })
            }
            this.queue[url] = url;
            return req;
        });
        instance.after.use(res => {
            delete this.queue[url]
            if (Object.keys(this.queue).length === 0) {
                wx.hideLoading()
            }
            return res;
        })
    }
    // 执行 wefetch 实例
    request(options) {
        this.interceptor(this.instance, options.url)
        return this.instance(this.merge(options));
    }
}

module.exports = new Request;
```
## 示例

发送一个 `GET` 请求
```js
const wf = require('wefetch')
wx.showLoading({
  title: '加载中...',
  mask: true
})
wf.get('http://you-domain/api').then(res => {
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
     data: {
       title: 'get Test', 
            content: 'get'
     },
     header: { Authorization: 'xxx' } 
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
wf.post('/post',{data: { title: 'post test', content: 'post' }})
.then(res => {
    console.log(res)
}).catch(err => {
    console.log(err)
})
```

发送多个 `并发` 请求
```js
const getUserInfo = prams => wf.get('/user/1', params)
const getUserPermissions = params => wf.get('/user/1/permission', params)
wf.all([getUserInfo(), getUserPermissions()])
.then(res => {
    // 所有请求完成后，将返回一个数组集合的Response
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
       url: '/upload',
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
> async/await 是ECMAScript 2017规范中的，截止目前(2019.03)微信小程序还未支持, 在我们使用之前需要引入一个Facebook `regeneratorRuntime`的库 ,为了方便使用，已经单独抽离出来

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
    wf.get('/get',{config: {eventType: 'get'}})
    
    //  取消请求
    wf.on('get', t => {
        t.abort()
    })
    // 处理多个请求
    wf.get('/user/info',{ config: {eventType:'user'}},)
    wf.get('/user/permission',{ config: {eventType: 'user'}},)
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
        config: { eventType: 'upload'}
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
});
// or like this:
chooseImage().then(res => {
    wf.upload({
        url: 'http://your-domain/upload',
        filePath: res.tempFilePaths[0],
        name: 'file',
        config: {eventType: 'upload'}
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
API | 参数 | 类型 | 描述 | 支持的小程序 |
:-: | :-: | :-: | :-: | :-:
request | url/config | String/Object | 所有请求方法的基础方法 | 所有| 
before.use | [resolveCallback,rejectCallback] | [Function,Function] | wefetch中间件,HTTP请求拦截，可以统一配置Authorization... | 所有| 
after.use | [resolveCallback,rejectCallback] | [Function,Function] | wefetch中间件,HTTP响应拦截 ,可以统一处理数据格式...| 所有| 
get | [url,config]| [String,Object] | HTTP 请求 GET | 所有|
post | [url,config]| [String,Object] | HTTP 请求 POST | 所有|
head | [url,config]| [String,Object] | HTTP 请求 HEAD | 微信|
connect | [url,config]| [String,Object] | HTTP 请求 CONNECT | 微信|
put | [url,config]| [String,Object] | HTTP 请求 PUT | 微信|
delete | [url,config]| [String,Object] | HTTP 请求 DELETE | 微信|
trace | [url,config]| [String,Object] | HTTP 请求 TRACE | 微信|
download | [url,config]/config| [String,Object]/Object | HTTP 请求 GET 小程序下载 | 所有|
upload | [url,config]/config| [String,Object] /Object| HTTP 请求 POST 小程序上传 | 所有|
on | [eventType,callback]| [String,Function] | 获取小程序RequestTask对象 | 所有|
abort | [eventType,callback]| [String,Function] | 终断当前请求 | 所有|
onProcess | [eventType,callback]| [String,Function] | 获取当前上传或下载时Process | 所有|
retry | [times,request,timeout]| [Number,Function,Number] | times为次数，request必须返回Promise对象，timeout为间隔时间，默认为1秒 | 所有|
finally | callback| Function | 当前请求完成后执行的方法| 所有|
all | [request,request,...]| Array | 并发请求,请求全部完成后返回| 所有|

> 默认 `Content-type` 是 各个平台小程序的默认值

> 如果需要对`wf.request`进行封装，`上传` 需要配置 `method:upload`, `下载` 需要配置 `method:download`

> 钉钉小程序 设置`Content-Type`为 `application/json` 时，需要对 data JSON.stringify()处理一下

[钉钉官方文档说明](https://open-doc.dingtalk.com/microapp/dev/httprequest)

创建一个实例
> 您可以创建实例，并自定义实例的配置
```js
const instance = wf.create({
    baseUrl: 'http://your-domain.com/api'
    //....
})
```
实例中的方法

API | 参数 | 类型 | 描述 | 支持的小程序 |
:-: | :-: | :-: | :-: | :-:
request | url/config | String/Object | 所有请求方法的基础方法 | 所有| 
before.use | [resolveCallback,rejectCallback] | [Function,Function] | 不同的实例都可以拥有自己的拦截器| 所有| 
after.use | [resolveCallback,rejectCallback] | [Function,Function] | 不同的实例都可以拥有自己的拦截器 | 所有| 
get | [url,config]| [String,Object] | HTTP 请求 GET | 所有|
post | [url,config]| [String,Object] | HTTP 请求 POST | 所有|
head | [url,config]| [String,Object] | HTTP 请求 HEAD | 微信|
connect | [url,config]| [String,Object] | HTTP 请求 CONNECT | 微信|
put | [url,config]| [String,Object] | HTTP 请求 PUT | 微信|
delete | [url,config]| [String,Object] | HTTP 请求 DELETE | 微信|
trace | [url,config]| [String,Object] | HTTP 请求 TRACE | 微信|
download | [url,config]/config| [String,Object]/Object | HTTP 请求 GET 小程序下载 | 所有|
upload | [url,config]/config| [String,Object] /Object| HTTP 请求 POST 小程序上传 | 所有|
on | [eventType,callback]| [String,Function] | 获取小程序RequestTask对象 | 所有|
abort | [eventType,callback]| [String,Function] | 终断当前请求 | 所有|
onProcess | [eventType,callback]| [String,Function] | 获取当前上传或下载时Process | 所有|
retry | [times,request,timeout]| [Number,Function,Number] | 同上 | 所有|
finally | callback| Function | 当前请求完成后执行的方法| 所有|
all | [request,request,...]| Array | 并发请求,请求全部完成后返回| 所有|


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
    * 如果您的项目请求路径、上传路径、下载路径都不一样的情况下，可以单独对`uploadUrl` and `downloadUrl`进行全局设置
    * */
    uploadUrl:'http://your-domain.com/upload',
    
    downloadUrl: 'http://your-domain.com/download',
    
    // 仅支付宝小程序支持
    timeout: 0,
    // 后台需要的参数 
    data: {},
    // 在wefetch中，可以注册一个自定义事件，用来同步管理小程序的requestTask对象，`eventType` 是注册事件时自定义的事件名称
    config:{ 
      eventType: ''
    }
    // 默认的 `Content-Type`
    header: {}
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
> 不同的实例都可以拥有自己的拦截器
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

## promise化小程序的api
```js
const chooseImage = wf.promisify(wx.chooseImage)
// using in wechat Mini Program
chooseImage().then(res => {
    // Do something ...
    console.log(res)
})
```
