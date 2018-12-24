# wefetch

**wefetch** Promise based wx.request api for weChat Mini Program.

### install 
```javascript
npm i wefetch -S
```

### usage for wechat

```javascript
const wf = require('wefetch')
```
[example](https://github.com/jonnyshao/wechat-fetch/tree/master/exmaple)
### Demo
```javascript
wf.defaults.baseUrl = 'http://localhost:3000'
wf.get(url, params, config)
```


### reqeust method

```javascript
wf.get(url, params, config)
wf.post(url, params, config) // application/x-www-form-urlencoded;charset=utf-8
wf.head(url, params, config)
wf.put(url, params, config)
wf.get(url, params, config)
wf.trace(url, params, config)
wf.delete(url, params, config)
wf.postJson(url, params, config) //application/json;charset=utf-8
```
### create Instance
```javascript
const wf = wefetch(config)
```

### request Interceptors
```javascript
wf.before.use(function (request) {
	// do somthing
	 return request; // required
})
```
### reponse Interceptors
```javascript
wf.after.use(function (response) {
	// do something

	return response; // required
})
```
**defaults params** 
``` javascript
defaults {
	baseUrl:'', // init empty
	headers:{} // init empty
	createRequest: wx.request //the wechat mini program api
}
```
### compelete

```javascript
wf.get(url, config, params).then(res => {
    //....
}).catch(err => {
    // ...
}).finally(() => {
    // compelete
})

```
