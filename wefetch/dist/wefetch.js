/*  
    Promise based wx.request api for  Mini Program
    @Github https://github.com/jonnyshao/wechat-fetch
    wefetch beta v1.1.4 |(c) 2018-2019 By Jonny Shao
*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.wefetch = factory());
}(this, function () { 'use strict';

    function promisify (api) {
        return  function (options) {
            for (var len = arguments.length, params = Array(len > 1 ? len - 1 : 0), key = 1; key < len; key++) {
                params[key - 1] = arguments[key];
            }
            return new Promise(function (resolve, reject) {
                Promise.prototype.task = api.apply(undefined, [Object.assign({}, options, {
                    success: resolve,
                    fail: reject
                })].concat(params));
            });
        };

    }

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
    function getRequest () {
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

    function getUpload () {
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

    function getDownload () {
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

    var DEFAULT_CONTENT_TYPE = 'application/x-www-form-urlencoded;charset=utf-8';
    var UPLOAD_CONTENT_TYPE = 'multipart/form-data';
    var DOWNLOAD_CONTENT_TYPE = 'image/jpeg';
    var JSON_CONTENT_TYPE = 'application/json;charset=utf-8';
    var defaults = {
        createRequest: getRequest(),
        header: {
            'Content-Type': DEFAULT_CONTENT_TYPE
        },
        timeout: 0
    };

    function bind(fn, context) {
        return function wf () {
            var args = new Array(arguments.length);
            for (var i = 0, l = args.length; i < l; i++) {
                args[i] = arguments[i];
            }
            return fn.apply(context, args)
        }
    }

    var tostring = Object.prototype.toString;
    var utils = {
        type: (function () {
            var type = {};
            var typeAry = ['String', 'Object', 'Number', 'Array', 'Undefined', 'Function', 'Null', 'Date'];
            for (var i = 0, len = typeAry.length; i < len; i++) {
                (function (name) {
                    type['is' + name] = function (obj) {
                        return tostring.call(obj) === '[object' +' '+ name + ']';
                    };
                })(typeAry[i]);
            }
            return type;
        })(),
        forEach: function (obj, fn) {
            if (!obj) {
                return;
            }
            if (typeof obj !== 'object') {
                obj = [obj];
            }
            if (Array.isArray(obj)) {
                for (var i = 0, l = obj.length; i < l; i++) {
                    fn.call(null, obj[i], i, obj);
                }
            } else {
                for (var k in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, k)) {
                        fn.call(null, obj[k], k, obj);
                    }
                }
            }
        },
        merge: function () {
            var result = {};
            function assignValue(val, key) {
                if (typeof result[key] === 'object' && typeof val === 'object') {
                    result[key] = utils.merge(result[key], val);
                } else {
                    result[key] = val;
                }
            }
            for (var i = 0, l = arguments.length; i < l; i++) {
                this.forEach(arguments[i], assignValue);
            }
            return result;
        },
        extends: function (extendObj, copyObj, thisArg) {
            this.forEach(copyObj, function (val, key) {
                if (thisArg && val === 'function') {
                    extendObj[key] = bind(val, thisArg);
                } else {
                    extendObj[key] = val;
                }
            });
            return extendObj;
        }
    };

    function InterceptorManager() {
        this.handles = [];
    }

    InterceptorManager.prototype.use = function (fulfilled, rejected) {
        this.handles.push({ fulfilled: fulfilled, rejected: rejected });
        return this.handles.length - 1;
    };


    InterceptorManager.prototype.eject = function (id) {
        if (this.handles[id]) {
            this.handles[id] = null;
        }

    };
    InterceptorManager.prototype.forEach = function (fn) {
        this.handles.forEach(function (h) {
            h && fn(h);
        });
    };

    var checkStatus = {
        is_up: null,
        is_down: null
    };

    function dispatchRequest(config) {
        var request = config.createRequest;
        return request(config).then(function (response) {
            return response;
        }, function (reason) {
            return Promise.reject(reason)
        })
    }

    function request (config) {
        if (config.url === undefined || config.url === null) {
            console.error('the request url is undefined');
            return
        }
        config = utils.merge(this.defaults, {method: 'get'}, config);
        if (config.method === 'postJson') {
            config.method = 'post';
            config.header['Content-Type'] = JSON_CONTENT_TYPE;
        }
        if (config.url.indexOf('http') === -1) {
            if (config.downloadUrl && checkStatus.is_down) {
                config.url = config.downloadUrl + config.url;
            } else if (config.uploadUrl && checkStatus.is_up) {
                config.url = config.uploadUrl + config.url;
            } else { //(config.baseUrl)
                config.url = config.baseUrl + config.url;
            }
        }

        var chain = [dispatchRequest, undefined];
        var promise = Promise.resolve(config);
        this.before.forEach(function (interceptor) {
            chain.unshift(interceptor.fulfilled, interceptor.rejected);
        });
        this.after.forEach(function (interceptor) {
            chain.push(interceptor.fulfilled, interceptor.rejected);
        });
        while (chain.length) {
            promise = promise.then(chain.shift(), chain.shift());
        }
        checkStatus.is_up = null;
        checkStatus.is_down = null;
        return promise;
    }

    ['options', 'get', 'head', 'post', 'put', 'delete', 'trace', 'connect', 'postJson'].forEach(function (method) {
        WeFetch.prototype[method] = function (url, params, config) {
            return this.request(utils.merge(config || {}, {
                url: url,
                data: params,
                method: method,
                config: config
            }))
        };
    });
    WeFetch.prototype.download = function (url, params, config) {
        // init
        checkStatus.is_down = true;
        params = params || {};
        config = config || {};
        var get_download = getDownload();
        config.createRequest = get_download.promisify;

        // check user is input header param
        if (config.header) {
            config.header['Content-Type'] = config.header['Content-Type'] || get_download.type;
        } else {
            config.header = {'Content-Type': get_download.type};
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
        checkStatus.is_up = true;
        params = params || {};
        config = config || {};
        var get_upload = getUpload();
        config.createRequest = get_upload.promisify;
        // check user is input header param
        if (config.header) {
            config.header['Content-Type'] = config.header['Content-Type'] || get_upload.type;
        } else {
            config.header = {'Content-Type': get_upload.type};
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

    function WeFetch(instanceConfig) {
        this.defaults = instanceConfig;
        this.before = new InterceptorManager();
        this.after = new InterceptorManager();
    }
    WeFetch.prototype.promisify = promisify;
    WeFetch.prototype.request = request;

    Promise.prototype.finally = function (cb) {
        var p = this.constructor;
        return this.then(function (value) {
            p.resolve(cb(value)).then(function () {
                return value
            });
        }, function (reason) {
            p.resolve(cb(value)).then(function () {
                return Promise.reject(reason)
            });
        })
    };

    function createInstance (defaultConfig){
        var context = new WeFetch(defaultConfig);
        var instance = bind(WeFetch.prototype.request, context);
        utils.extends(instance, WeFetch.prototype, context);
        utils.extends(instance, context);
        return instance;
    }

    var wf = createInstance(defaults);

    wf.all = function (promises) {
        return Promise.all(promises)
    };

    wf.create = function (instanceConfig) {
        return createInstance(utils.merge(defaults, instanceConfig))
    };

    return wf;

}));
