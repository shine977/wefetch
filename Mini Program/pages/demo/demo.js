const wf = require('wefetch')
wf.defaults.baseUrl = 'http://localhost:3000'
const message = ({titel, content}) => {
  wx.showModal({
    title,
    content
  })
}
// interceptor for request of global
wf.before.use(function (request) {
  if (request.url.includes('interceptor/request')) {
    wx.showModal({
      title: 'interceptor',
      content: 'this request will be interceptored'
    })
  } else {
      return request;
  }
  
})
// interceptor for response for global
wf.after.use(function (response) {
   var {title,content} = response.data
   
   if (response.header.title) {
       title = response.header.title;
       content = response.header.content
   }
    wx.showModal({
        title: title,
        content: content,
    })
    return response;
})
Page({

  /**
   * Page initial data
   */
  data: {

  },
  interceptor_request() {
    wf.get('/interceptor/request').then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    }).finally(() => {
        console.log('interceptor request finally')
    })
  },
  interceptor_response() {
    wf.get('/interceptor/response').then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    }).finally(() => {
        console.log('interceptor response finally')
    })
  },
  head () {
      wf.head('/head',{title:'head Test', content: 'this is a head request'})
  },
  // get request
  get () {
    wf.get('/get',{title:'get Test', content:'this is a get request'})
  },
  // post request
  post () {
    wf.post('/post',{title:'post Test', content:'this is a post request'})
  },
  // postJson request
  postJson () {
    wf.postJson('/postJson',{title:'postJson Test', content:'this is a postJson request'})
  },
  // put request
  put () {
    wf.put('/put',{title:'put Test', content:'this is a put request'})
  },
  // delete request
  delete () {
    wf.delete('/delete',{title:'delete Test', content:'this is a delete request'})
  },
  // trace request
  trace () {
      wf.trace('/trace',{title:'Trace Test', content: 'this is a trace request'})
  },
  // connect request
  connect () {
      wf.connect('/connect', {title: 'Connect Test', content: 'this is a connect request'})
  },
  // options request 
  options () {
      wf.options('/options',{title: 'Options Test', content: 'this is a options request'})
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