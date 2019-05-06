import check from './checkStatus'
import utils from "../utils";
import WeFetch from "./Wefecth";
import {getUpload, getDownload} from "./platform";

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
    check.is_down = true;
    params = params || {};
    config = config || {};
    var get_download = getDownload();
    config.createRequest = get_download.promisify;

    // check user is input header param
    if (config.header) {
        config.header['Content-Type'] = config.header['Content-Type'] || get_download.type
    } else {
        config.header = {'Content-Type': get_download.type}
    }

    // wf.download({}) support
    if (utils.type.isObject(url)) {
        return this.request(utils.merge(config, url, {
            url: url.url? url.url: '',
            filePath: url.filePath
        }))
    }
    // default
    return this.request(utils.merge(config,{
        url: url,
        filePath: params ? params.filePath : undefined,
        config: config
    }))
};

WeFetch.prototype.upload = function (url, params, config) {
    // init
    check.is_up = true;
    params = params || {};
    config = config || {};
    var get_upload = getUpload();
    config.createRequest = get_upload.promisify;
    // check user is input header param
    if (config.header) {
        config.header['Content-Type'] = config.header['Content-Type'] || get_upload.type;
    } else {
        config.header = {'Content-Type': get_upload.type}
    }

    // upload({}) support

    if (utils.type.isObject(url)) {
        return this.request(utils.merge(config, url, {
            url: url.url? url.url : '',
            method: 'post',
            filePath: url.filePath,
            name: url.name,
            fileType: url.fileType, // fileType for alipay
            formData: url.formData
        }))
    }
    return this.request(utils.merge(config, {
        url: url,
        method: 'post',
        filePath:params.filePath,
        name: params.name,
        formData: params.formData,
        fileType: params.fileType,
        config: config,
    }))
};