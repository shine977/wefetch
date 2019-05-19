const wf = require('./requst.js')
export const get = (data,config) => {
    return wf.request({
        url: '/get',
        data,config
    })
}
export const post = (data,config) => {
    return wf.request({
        url: '/post',
        method:'post',
        data, config
    })
}
export const postJson = (data,config) => {
    return wf.request({
        url: '/postJson',
        method: 'postJson',
        data, config
    })
}
export const head = (data,config) => {
    return wf.request({
        url: '/head',
        method: 'head',
        data, config
    })
}
export const download = (data,config) => {
    return wf.request({
        url:'https://github.com/jonnyshao/wefetch/archive/v1.2.4.zip',
        method: 'download',
        data,
        config,
    })
}
