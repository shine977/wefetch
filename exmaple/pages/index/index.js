const { get, post, postJson, head, download} = require('../../api/index.js')
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
  getRequest(){
      get({title: 'this is a get request'}).then(() =>{
          console.log('get request')
      })
  },
  postRequest(){
      post({ title: 'this is a post request' }).then(() =>{
          console.log('post request')
      })
  },
  postJsonRequest() {
      postJson({ title: 'this is a postJson Request'}).then(() => {
          console.log('postJson request')
      })
  },
  headRequest() {
      head({title: 'this is a head Request'}).then(() => {
          console.log('head Request')
      })
  },
  downlaodRequest() {
      download().then((res) => {
          console.log('download request')
          console.log(res)
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
