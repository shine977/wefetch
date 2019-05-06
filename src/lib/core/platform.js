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
    try {
        if (wx.request) {
            return promisify(wx.request)
        }
    } catch (e) {
        try {
            if (my.httpRequest) {
                return promisify(my.httpRequest)
            }
        }catch (e) {
            if (swan.request) {
                return promisify(swan.request)
            }
        }
    }  
}

export function getUpload () {
    try{
        if (wx.uploadFile) {
            return generatorUpload(wx.uploadFile, 'wx')
        }
    }catch(e){
        try{
            if (my.uploadFile) {
                return generatorUpload(my.uploadFile, 'my')
            }
        }catch(e){
            if (swan.uploadFile) {
                return generatorUpload(swan.uploadFile, 'swan')
            }
        }
    }
    
}

export function getDownload () {
    try{
        if (wx.downloadFile) {
            return generatorDownload(wx.downloadFile,'wx')
        }
    }catch(e){
        try{
            if (my.downloadFile) {
                return generatorDownload(my.downloadFile, 'my')
            }
        }catch(e){
            if (swan.downloadFile) {
                return generatorDownload(swan.downloadFile, 'swan')
            }
        }
    }

    
    
}