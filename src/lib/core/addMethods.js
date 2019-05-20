import utils from "../utils";
import WeFetch from "./Wefetch";
import {UPLOAD_CONTENT_TYPE, DOWNLOAD_CONTENT_TYPE} from '../defaults'
import platform from "./platform";
import promisify from "./promisify";
['options', 'get', 'head', 'post', 'put', 'delete', 'trace', 'connect', 'postJson'].forEach(function (method) {
    WeFetch.prototype[method] = function (url, config) {
        return this.request(utils.merge(config || {}, {
            url: url,
            method: method
        }))
    }
});
WeFetch.prototype.download = function (url, config) {
    // init
    config = config || {};
    // check user is input header param
    if (config.header) {
        config.header['Content-Type'] = config.header['Content-Type'] || DOWNLOAD_CONTENT_TYPE
    } else {
        config.header = {'Content-Type': DOWNLOAD_CONTENT_TYPE}
    }

    // wf.download({}) support
    if (utils.type.isObject(url)) {
        return this.request(utils.merge(config, url,{ method: 'download' }))
    }
    // default
    return this.request(utils.merge(config,{
        url: url,
        method: 'download'
    }))
};

WeFetch.prototype.upload = function (url, config) {
    // init
    config = config || {};
    // check user is input header param
    if (config.header) {
        config.header['Content-Type'] = config.header['Content-Type'] || UPLOAD_CONTENT_TYPE;
    } else {
        config.header = {'Content-Type': UPLOAD_CONTENT_TYPE}
    }

    // upload({}) support
    if (utils.type.isObject(url)) {
        return this.request(config, url,{ method: 'upload' })
    }
    return this.request(utils.merge(config, {
        url: url,
        method: 'upload'
    }))
};
WeFetch.prototype.login = function () {
  return promisify(platform.getPlatform().login)();
};
