English | [简体中文](https://github.com/jonnyshao/wefetch)
# wefetch

[![install size](https://packagephobia.now.sh/badge?p=wefetch)](https://packagephobia.now.sh/result?p=wefetch)
[![npm version](https://badgen.net/npm/v/wefetch?color=green)](https://www.npmjs.com/package/wefetch)
[![gzip](https://badgen.net/badgesize/gzip/https://unpkg.com/wefetch@1.3.3/dist/wefetch.min.js)](https://unpkg.com/wefetch@1.2.5/dist/wefetch.min.js)
[![downloads](https://badgen.net/npm/dm/wefetch)](https://www.npmtrends.com/wefetch)

Promise based api for the Mini Program. Supports the `Wechat` 、`Alipay`、`Baidu`、 `DingDing`、`TouTiao`  Mini-program of platform.

## Mini Program Platform Support

![WeChat](https://github.com/jonnyshao/wefetch/blob/master/assets/wechat.png) | ![AliPay](https://github.com/jonnyshao/wefetch/blob/master/assets/alipay.png) | ![DingDing](https://github.com/jonnyshao/wefetch/blob/master/assets/dingding.png) | ![Baidu](https://github.com/jonnyshao/wefetch/blob/master/assets/baidu.png) | ![Toutiao](https://github.com/jonnyshao/wefetch/blob/master/assets/tt.png) |
--- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ |
## Feature

- Make [wx.request](https://developers.weixin.qq.com/miniprogram/en/dev/api/network-request.html#wxrequestobject) from the Wechat Mini Program
- Make [wx.downloadFile](https://developers.weixin.qq.com/miniprogram/en/dev/api/network-file.html#wxdownloadfileobject) from the Wechat Mini Program
- Make [wx.uploadFile](https://developers.weixin.qq.com/miniprogram/en/dev/api/network-file.html#wxuploadfileobject) from the Wechat Mini Program
- Make [my.request](https://docs.alipay.com/mini/api/network#a-nameco0fvaamyhttprequest) from the Alipay Mini Program
- Make [my.uploadFile](https://docs.alipay.com/mini/api/network#a-namey24rltamyuploadfile) from the Alipay Mini Program
- Make [my.downloadFile](https://docs.alipay.com/mini/api/network#a-nameal4taaamydownloadfile) from the Alipay Mini Program
- Make [tt.request](https://developer.toutiao.com/docs/api/request.html) from the TouTiao Mini Program 
- Make [tt.downloadFile](https://developer.toutiao.com/docs/api/downloadFile.html) from the TouTiao Mini Program 
- Make [tt.uploadFile](https://developer.toutiao.com/docs/api/uploadFile.html) from the TouTiao Mini Program 
- Make [swan.request](https://smartprogram.baidu.com/docs/develop/api/net_request/#request/) from the Baidu Mini Program
- Make [swan.uploadFile](https://smartprogram.baidu.com/docs/develop/api/net_uploadfile/#uploadFile/) from the Baidu Mini Program
- Make [swan.downloadFile](https://smartprogram.baidu.com/docs/develop/api/net_uploadfile/#downloadFile/) from the Baidu Mini Program
- Supports the [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) API
- Intercept request and response
- Supports the Mini Program [RequestTask](https://developers.weixin.qq.com/miniprogram/dev/api/wx.request.html) object of config

## installing

```js
npm i wefetch
```
## Sample code of Project
```js
const wf = require('wefetch');

class Request {
    constructor() {
        // queue
        this.queue = {};
        // config your domain
        this.baseUrl = 'http://your-domain.com';
        // support of alipay mini program  only
        this.timeout = 3000;
        // create wefetch instance
        this.instance = wf.create();
    }
    // params merge
    merge(options) {
        return { ...options, baseUrl: this.baseUrl }
    }
    // Retries a function that returns a promise, leveraging the power of the retry module to the promise 
    // times && request required
    retry(times,request,timeout){
      this.instance.retry(times,request,timeout)
    },
    // cancel current request
    abort(event,callback){
      this.instance.abort(event,callback)
    },
    // get `upload` or `download` processUpdate
    onProcess(event,cb){
      this.instance.onProcess(event,cb)
    }
    // set interceptors
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
    // execute instance
    request(options) {
        this.interceptor(this.instance, options.url)
        return this.instance(this.merge(options));
    }
}

module.exports = new Request;
```
## Example

Performing a `GET` request
```js
const wf = require('wefetch')
wx.showLoading({
  title: 'loading',
  mask: true
})
wf.get(url).then(res => {
// ....
}).catch(err => {
// ...
})
// request completed
.finally(() => {
    wx.hideLoading()
})
    
 wf.get('/get', 
 { 
     data: {
       title: 'get Test', 
      content: 'get' 
     },
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
Performing a `POST` request
```js
wf.post('/post',{ data:{ title: 'post test', content: 'post' }})
.then(res => {
    console.log(res)
}).catch(err => {
    console.log(err)
})
```

Performing multiple `concurrent` requests
```js
const getUserInfo = prams => wf.get('/user/1', params)
const getUserPermissions = params => wf.get('/user/1/permission', params)
wf.all([getUserInfo(), getUserPermissions()])
.then(res => {
    // both requests are complete, the res as a Array back
})
```

Performing a `upload` request
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

Performing a `download` request
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
## To use async/await 
> async/await is part of ECMAScript 2017 and is not supported in Mini Program, before we can use it, we need introduce a `regeneratorRuntime` 

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
## Get the `requestTask` Object
Sample code of get request:
```js
    wf.get('/get',{ config: {eventType: 'get'}})
    
    //  abort the request
    wf.on('get', t => {
        t.abort()
    })
    // Batch Processing the requestTask Object
    wf.get('/user/info',{ config: {eventType:'user'}})
    wf.get('/user/permission',{ config: {eventType:'user'}})
    wf.on('user', t => {
        // this current event handle will be execute the two times
        t.abort()
    })
```
Sample code of upload request:

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
        config: {
          eventType: 'upload'
        }
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
####  wf.get(url, {,data,config}) 
####  wf.post(url, {,data,config}) 
####  wf.head(url, {,data,config})
####  wf.put(url, {,data,config})
####  wf.get(url, {,data,config})
####  wf.trace(url, {,data,config})
####  wf.delete(url, {,data,config})
####  wf.upload(url, {,data,config}) or wf.upload(config)
####  wf.download(url, {,data,config}) or wf.download(config)
Creating an instance
You can create a new instance of wefetch with a custom config
```js
const instance = wf.create({
    baseUrl: 'http://your-domain.com/api'
    //....
})
```
Instance methods
####  wf.request(config)
####  wf.get(url, {,data,config}) 
####  wf.post(url, {,data,config}) 
####  wf.head(url, {,data,config})
####  wf.put(url, {,data,config})
####  wf.get(url, {,data,config})
####  wf.trace(url, {,data,config})
####  wf.delete(url, {,data,config})
####  wf.upload(url, {,data,config}) or wf.upload(config)
####  wf.download(url, {,data,config}) or wf.download(config)

## Config Params
```js
{
    // `url` is the server URL that will be used for the request
    url: '/user',
    
    // `baseURL` will be prepended to `url`
    baseUrl:'http://your-domain.com/api',
    
    // default method `get`
    method: 'get', 
    
    // `uploadUrl` and `downloadUrl` will be prepended to `url`。 if your project have a different request path, you can like this to set it:
    uploadUrl:'http://your-domain.com/upload',
    
    downloadUrl: 'http://your-domain.com/download',
    
    // support `alipay` platform only
    timeout: 0,
    // send to back-end
    data:{
      
    },
    // if your want to the Mini Program to return a requestTask Object, you can custom the `eventType`
    // like this wf.on('your eventType', t => {...})
    config:{
      eventType: ''
    }
    // default `Content-Type`
    header: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
}
```
## Config Defaults

**Global wefetch defaults**
```js
wf.defaults.baseUrl = 'http://your-domain.com/api';
wf.defaults.uploadUrl = 'http://your-domain.com/upload';
wf.defaults.downloadUrl = 'http://your-domain.com/download';
```
**Custom instance defaults**
```js
const instance = wf.create()
instance.defaults.baseUrl = 'http://your-domain.com/api';
instance.defaults.uploadUrl = 'http://your-domain.com/upload';
instance.defaults.downloadUrl = 'http://your-domain.com/download';
```
## Interceptors
```js
// add a request interceptor
wf.before.use(request => {
    // Do something before request is sent
    return request;
}, error => {
    // Do something with request error
    return Promise.reject(error);
})

// add a response interceptor
wf.after.use(response => {
    // Do something with response data
    return response;
}, error => {
    // Do something with response error
    return Promise.reject(error)
})
```

## Promisify for Mini Program API
```js
const chooseImage = wf.promisify(wx.chooseImage)
// using in wechat Mini Program
chooseImage().then(res => {
    // Do something ...
    console.log(res)
})
```
