import promisify from './promisify'
import {UPLOAD_CONTENT_TYPE, DOWNLOAD_CONTENT_TYPE} from '../defaults'

function generatorUpload (o, platform) {
    return {
        promisify: promisify(o),
        type: UPLOAD_CONTENT_TYPE,
        platform: platform
    }
}

function generatorDownload(o, platform) {
    return {
        promisify: promisify(o),
        type: DOWNLOAD_CONTENT_TYPE,
        platform: platform
    }
}
export function getRequest () {
    // wechat
    if (wx.request) {
        return promisify(wx.request)
    }
    // alipay
    if (my.httpRequest) {
        return promisify(my.httpRequest)
    }
    // baidu
    if (swan.request) {
        return promisify(swan.request)
    }
}

export function getUpload () {
    if (wx.uploadFile) {
        return generatorUpload(wx.uploadFile, 'wx')
    }
    if (my.uploadFile) {
        return generatorUpload(my.uploadFile, 'my')
    }
    if (swan.uploadFile) {
        return generatorUpload(swan.uploadFile, 'swan')
    }
}

export function getDownload () {
    if (wx.downloadFile) {
        return generatorDownload(wx.downloadFile,'wx')
    }
    if (my.downloadFile) {
        return generatorDownload(my.downloadFile, 'my')
    }

    if (swan.downloadFile) {
        return generatorDownload(swan.downloadFile, 'swan')
    }
}