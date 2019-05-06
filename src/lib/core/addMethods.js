import utils from "../utils";
import WeFetch from "./Wefecth";
import {UPLOAD_CONTENT_TYPE, DOWNLOAD_CONTENT_TYPE} from '../defaults'
import platform from "./platform";

['options', 'get', 'head', 'post', 'put', 'delete', 'trace', 'connect', 'postJson'].forEach(function (method) {
    WeFetch.prototype[method] = function (url, params, config) {
        return this.request(utils.merge(config || {}, {
            url: url,
            data: params,
            method: method,
            config: config
        }))
    }
});
WeFetch.prototype.download = function (url, params, config) {
    // init
    params = params || {};
    config = config || {};
    config.createRequest = platform.getDownload();

    // check user is input header param
    if (config.header) {
        config.header['Content-Type'] = config.header['Content-Type'] || DOWNLOAD_CONTENT_TYPE
    } else {
        config.header = {'Content-Type': DOWNLOAD_CONTENT_TYPE}
    }

    // wf.download({}) support
    if (utils.type.isObject(url)) {
        return this.request(utils.merge(config, url, {
            url: url.url? url.url: '',
            filePath: url.filePath,
            method: 'download'
        }))
    }
    // default
    return this.request(utils.merge(config,{
        url: url,
        filePath: params ? params.filePath : undefined,
        config: config,
        method: 'download'
    }))
};

WeFetch.prototype.upload = function (url, params, config) {
    // init
    params = params || {};
    config = config || {};
    config.createRequest = platform.getUpload();
    // check user is input header param
    if (config.header) {
        config.header['Content-Type'] = config.header['Content-Type'] || UPLOAD_CONTENT_TYPE;
    } else {
        config.header = {'Content-Type': UPLOAD_CONTENT_TYPE}
    }

    // upload({}) support

    if (utils.type.isObject(url)) {
        return this.request(utils.merge(config, url, {
            url: url.url? url.url : '',
            method: 'upload',
            filePath: url.filePath,
            name: url.name,
            fileType: url.fileType, // fileType for alipay
            formData: url.formData
        }))
    }
    return this.request(utils.merge(config, {
        url: url,
        method: 'upload',
        filePath:params.filePath,
        name: params.name,
        formData: params.formData,
        fileType: params.fileType,
        config: config
    }))
};
