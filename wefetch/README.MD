English | [简体中文](https://github.com/jonnyshao/wefetch/blob/master/README-zh_CN.md)

# wefetch

[![install size](https://packagephobia.now.sh/badge?p=wefetch)](https://packagephobia.now.sh/result?p=wefetch)

Promise based wx.request and my.request api for the Mini Program.

## Feature

- Make [wx.request](https://developers.weixin.qq.com/miniprogram/en/dev/api/network-request.html#wxrequestobject) from the Wechat Mini Program
- Make [wx.downloadFile](https://developers.weixin.qq.com/miniprogram/en/dev/api/network-file.html#wxdownloadfileobject) from the Wechat Mini Program
- Make [wx.uploadFile](https://developers.weixin.qq.com/miniprogram/en/dev/api/network-file.html#wxuploadfileobject) from the Wechat Mini Program
- Make [my.httpRequest](https://docs.alipay.com/mini/api/network#a-nameco0fvaamyhttprequest) from the Alipay Mini Program
- Make [my.uploadFile](https://docs.alipay.com/mini/api/network#a-namey24rltamyuploadfile) from the Alipay Mini Program
- Make [my.downloadFile](https://docs.alipay.com/mini/api/network#a-nameal4taaamydownloadfile) from the Alipay Mini Program
- Make [swan.request](https://smartprogram.baidu.com/docs/develop/api/net_request/#request/) from the Baidu Mini Program
- Make [swan.uploadFile](https://smartprogram.baidu.com/docs/develop/api/net_uploadfile/#uploadFile/) from the Baidu Mini Program
- Make [swan.downloadFile](https://smartprogram.baidu.com/docs/develop/api/net_uploadfile/#downloadFile/) from the Baidu Mini Program
- Supports the [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) API
- Intercept request and response

## installing

```js
npm i wefetch -S
```

## Example

Performing a `GET` request
```js
const wf = require('wefetch')
wf.get(url).then(res => {
// ....
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
Performing a `POST` request
```js
wf.post('/post',{title: 'post test', content: 'post'})
.then(res => {
    console.log(res)
}).catch(err => {
    console.log(err)
})
```
Performing a `POSTJSON` request
```js
// the request header `Content-Type` property is a 'application/json;charset=uft-8'

wf.postJson('/postJson')
.then( res => {
    console.log(res);
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
Creating an instance
You can create a new instance of wefetch with a custom config
```js
const instance = wf.create({
    baseUrl: 'http://your-domain.com/api'
    //....
})
```
Instance methods
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

## Request Config
```js
{
    // `url` is the server URL that will be used for the request
    url: '/user',
    
    // `baseURL` will be prepended to `url`
    baseUrl:'http://your-domain.com/api',
    
    // default method `get`
    method: 'get', 
    
    // `uploadUrl` and `downloadUrl`,will be prepended to `url`。 if your project have a different request path, you can like this to set it:
    uploadUrl:'http://your-domain.com/upload',
    
    downloadUrl: 'http://your-domain.com/download',
    
    // support `alipay` platform only
    timeout: 0,
    
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