import utils from "../utils";
import WeFetch from "./Wefetch";
['options', 'get', 'head', 'post', 'put', 'delete', 'trace', 'connect'].forEach(function (method) {
    WeFetch.prototype[method] = function (url, config) {
        return this.request(utils.merge(config || {}, {
            url: url,
            method: method
        }))
    }
});
WeFetch.prototype.download = function (url, config) {
    // wf.download({}) support
    if (utils.type.isObject(url)) {
        return this.request(utils.merge(url,{ method: 'download' }))
    }
    // default
    return this.request(utils.merge(config || {},{
        url: url,
        method: 'download'
    }))
};

WeFetch.prototype.upload = function (url, config) {
    // upload({}) support
    if (utils.type.isObject(url)) {
        return this.request(url,{ method: 'upload' })
    }
    return this.request(utils.merge(config || {}, {
        url: url,
        method: 'upload'
    }))
};
