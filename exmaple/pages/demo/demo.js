import wefetch from '../../dist/wefetch.min.js'
wefetch.defaults.baseUrl = 'http://localhost:3000'
console.dir(wefetch)
wefetch.before.use(function(request) {
  console.log('request-请求拦截')
  console.log(request)
  return request;
})
wefetch.after.use(function (response) {
  console.log('response-请求拦截')
  console.log(response)
  return response;
})
Page({

  /**
   * Page initial data
   */
  data: {

  },
  interceptor () {
    wefetch.get('/interceptor').then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {
    
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})