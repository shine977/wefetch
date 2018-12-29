English | [简体中文](https://github.com/jonnyshao/wechat-fetch/blob/master/README-zh_CN.md)

wx.request Object
-----
Promise based wx.request api for weChat Mini Program.supported Wechat Mini Program and Mini game.

Feature
-----
```
  easy to use, Promise based wx.request api for designed
  supported Reqeust && Response InterceptorsManagement
```
### donwload
```
  git clone https://github.com/jonnyshao/wechat-fetch.git
  cd server
  npm i 
  npm start 
  open the Mini-Program directory in devtools 
```
[devtools](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

### install (npm build)
```javascript
npm i wefetch -S
```

### usage for wechat Mini Program

```javascript
const wf = require('wefetch')
```

### exmaple
```javascript
// get for request 
  wf.get(url).then(res => {
    // ....
  })

  // you project domain 
  wf.defaults.baseUrl = 'youdomain'
  
  // interceptor request
  wf.before.use(function (request) {
    // do something ...
    return request;
  })

  // interceptor response
  wf.after.use(function (response) {
    // do something ...
    return response;
  })

	// post for reuqest, the default header 'Content-Type' dose't is application/json,if you need JSON format,use the wf.postJson function,please
  wf.post(url, {data: data}, {header: {token: xxx},responseType: 'arraybuffer', dataType: xx}).then(res =>{
    // ...
  }).catch((err => {
    // ...
  }))
  
  // abort the current request, return one Promise request.
  var p = wf.get(url).then(res => {

  })
  // execute abort
  p.task.abort()
  // complete
  wf.get(url).then(() => {

  }).catch(err => {

  }).finally(() => {
    // request complete...
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
### abort Request

```javascript
var p = wf.get(url)
p.task.abort()
```
[RequestTaks](https://developers.weixin.qq.com/miniprogram/dev/api/RequestTask.html)

```
### defaults params
```
  defaults: {
    baseUrl: '',
    createRequest: wx.request 
    header: {}，
    data: {},
    dataType: 'json',  // wechat default params
    responseType: 'text' // wechat default params
  }
```
