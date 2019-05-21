const { get, post, postJson, head, download} = require('../../api/index.js')
const wf = require('../../api/wf.js')

wf.defaults.baseUrl = 'http://localhost:3000'
wf.before.use(req => {
    console.log(req)
    return req
})
wf.after.use(res => {
    console.log(res)
    return res
})
wf.postJson('/postJson')
wf.get('/get', { data: { title: '标题' },header:{title: 'this is a title'},config:{eventType: 'user'} })
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // get 请求
  getRequest(){
    //   get({title: 'this is a get request'},{eventType:'get'}).then(() =>{
    //       console.log('get request')
    //   })
    wf.get('/get',{data:{title: 'title'},config:{eventTyep: 'get'},header: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAyLCJ1c2VybmFtZSI6IjEzOTE2NzM5OTM4IiwiY29tcGFueSI6MTEsImlhdCI6MTU1Nzg0MTUyOSwiZXhwIjoxNTU4NDQ2MzI5fQ.7JcYLazsriB6PXENOpuVQk-dki7cOIdErPPFYIX6y6U'
    }})
  },
  // post 请求
  postRequest(){
      post({ title: 'this is a post request' }).then(() =>{
          console.log('post request')
      })
  },
  // postJson 请求
  postJsonRequest() {
      return new Promise((resolve,reject) => {
          postJson({ title: 'this is a postJson Request' },{
                  eventType: 'postJson',
              }).then(res => {
              console.log('postJsonRequest')
            //   失败重新建立连接
              reject(res)
          })
          wf.on('postJson', t => {
              console.log(t)
          })
      })    
  },
  // head 请求
  headRequest() {
      head({title: 'this is a head Request'}).then(() => {
          console.log('head Request')
      })
  },
  // 下载
  downlaodRequest() {
      download({}, { eventType: 'download'}).then((res) => {
          console.log('download request')
          console.log(res)
      })
      
  },
  // retry 请求
  retryRequest(){
      wf.retry(3, this.postJsonRequest,2000).then(data => {
          console.log(data)
      }).catch(err => {
          console.log(err)
      })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
