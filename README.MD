# wefetch

@(weChat-fetch)

**wefetch** 基于promise,对微信小程序wx.request对象进行了重新设计,支持CommonJS,AMD规范

###install 
> npm i wefetch -S

### usage fro wechat
> const wefetch = require('wefetch')

```javascript
wefetch.defaults.baseUrl = 'youdomain'
wefetch.get(url, params, config)
```


### reqeust method

```javascript
wefetch.get(url, params, config)
wefetch.post(url, params, config)
wefetch.head(url, params, config)
wefetch.put(url, params, config)
wefetch.get(url, params, config)
wefetch.trace(url, params, config)
wefetch.delete(url, params, config)
wefetch.request(config)
```
### create Instance
```javascript
const wf = wefetch(config)
```

### request Interceptors
```javascript
wefetch.before.use(function (request) {
	// do somthing
	 return request; // required
})
```
### reponse Interceptors
```javascript
wefetch.after.use(function (response) {
	// do something

	return response; // required
})
```
**defaults params** 
``` javascript
defaults {
	baseUrl:'', // 初始化为空
	headers:{} // 采用小程序的默认值
	createRequest: wx.request, //对象
	formData: false // 是否开户fromData格式
}
```
### Thanks
[axios](https://github.com/axios/axios)