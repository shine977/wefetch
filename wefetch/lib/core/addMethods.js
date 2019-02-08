import utils from "../utils";
import WeFetch from "./Wefecth";

utils.forEach(['options', 'get', 'head', 'post', 'put', 'delete', 'trace', 'connect', 'postJson'], function (method) {
    WeFetch.prototype[method] = function (url, params, config) {
        return this.request(utils.merge(config || {}, {
            url: url,
            data: params,
            config: config
        }))
    }
});
WeFetch.prototype.download = function (url, params, config) {
    var temp = {};
    var args = arguments[0];
    // temp.header['Content-Type'] = 'image/jpeg'; error
    temp.header = {
        'Content-Type' : 'image/jpeg'
    };
    temp._is_download_request = true;
    temp.createRequest = this.promisify(wx.downloadFile);
    if (utils.type.isObject(args)) {
        config = utils.merge(temp, args);
        temp = null;
        return this.request(utils.merge(config, {
            url: args.url? args.url: '',
            filePath: args.filePath,
            config: config
        }))
    } else if (!args) {
        config = utils.merge(temp);
        temp = null;
        return this.request(utils.merge(config,{url: ''}))
    }
    config = utils.merge(temp, config || {});
    temp = null;
    return this.request(utils.merge(config,{
        url: url,
        filePath: params ? params.filePath : undefined,
        config: config
    }))
};

WeFetch.prototype.upload = function (url, params, config) {
    params = params ? params : {};
    var temp = {
        header: {
            'Content-Type': 'multipart/form-data'
        }
    };
    temp._is_upload_request = true;
    temp.createRequest = this.promisify(wx.uploadFile);
    // upload({}) support
    if (utils.type.isObject(url)) {
        config = utils.merge(temp, url);
        temp = null;
        return this.request(utils.merge(config, {
            url: url.url? url.url : '',
            method: 'post',
            filePath:url.filePath,
            name: url.name,
            formData: url.formData,
            config: config
        }))
    }
    config = utils.merge(temp, config || {});
    temp = null;
    return this.request(utils.merge(config, {
        url: url,
        method: 'post',
        filePath:params.filePath,
        name: params.name,
        formData: params.formData,
        config: config,
    }))
};