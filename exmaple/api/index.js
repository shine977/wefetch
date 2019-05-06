const wf = require('./requst.js');
export const get = (data) => {
    return wf.request({
        url: '/get',
        config:{
            get:'get'
        }
    })
}
export const post = (data) => {
    return wf.request({
        url: '/post',
        method:'post',
        data
    })
}
export const postJson = (data) => {
    return wf.request({
        url: '/postJson',
        method: 'postJson',
        data
    })
}
export const head = (data) => {
    return wf.request({
        url: '/head',
        method: 'head',
        data
    })
}
export const download = (data) => {
    return wf.request({
        url: 'https://github.com/jonnyshao/wefetch/blob/master/assets/platform_wechat.jpeg',
        method: 'download'
    })
}