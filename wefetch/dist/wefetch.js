/*  
    Promise based wx.request api for  Mini Program
    @Github https://github.com/jonnyshao/wechat-fetch
    wefetch beta v1.0.9 |(c) 2018 By Jonny Shao
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
                var t = api.apply(undefined, [Object.assign({}, options, { success: resolve, fail: reject })].concat(params));
                if (t) {
                    Promise.prototype.task = t;
                }
            });
        };

    }

    var getPlatform = function () {
        if (wx.request) {
            return promisify(wx.request)
        }
        if (my.httpRequest) {
            return promisify(my.httpRequest)
        }
    };

    var DEFAULT_CONTENT_TYPE = 'application/x-www-form-urlencoded;charset=utf-8';
    var JSON_CONTENT_TYPE = 'application/json;charset=utf-8';
    var defaults = {
        createRequest: getPlatform(),
        baseUrl: '', // request url
        // json: false,
        method: 'get',
        // downloadUrl: '', // download url
        // uploadUrl: '', // upload url
        header: {
            'Content-Type': DEFAULT_CONTENT_TYPE
        }
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
                    extendObj[key] = utils.bind(val, thisArg);
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
    };


    InterceptorManager.prototype.eject = function (id) {
        if (this.handles[id]) {
            this.handles[id] = null;
        }
    };
    InterceptorManager.prototype.forEach = function (fn) {
        // console.log(this.handles);
        utils.forEach(this.handles, function (h) {
            h && fn(h);
        });
    };

    function dispatchRequest(config) {
        var request = config.createRequest;
        return request(config).then(function (response) {
            return response
        }, function (reason) {
            if (reason) {
                return reason
            }
        })
    }

    function request (config) {
        if (config.url === undefined || config.url === null) {
            console.error('the request url is undefined');
            return
        }
        config = utils.merge(defaults, this.defaults, config,{method: 'get'});
        if (config.method === 'postJson') {
            config.method = 'post';
            config.header['Content-Type'] = JSON_CONTENT_TYPE;
        }
        if (config.url.indexOf('http') === -1) {
            if (config.downloadUrl && config._is_download_request) {
                config.url = config.downloadUrl + config.url;
            } else if (config.uploadUrl && config._is_upload_request) {
                config.url = config.uploadUrl + config.url;
            } else { //(config.baseUrl)
                config.url = config.baseUrl + config.url;
            }
        }

        var chain = [dispatchRequest, undefined];
        var promise = Promise.resolve(config);
        this.before.forEach(function (interceptor) {
            chain.unshift(interceptor.fulfilled, interceptor.rejectd);
        });
        this.after.forEach(function (interceptor) {
            chain.push(interceptor.fulfilled, interceptor.rejectd);
        });
        while (chain.length) {
            promise = promise.then(chain.shift(), chain.shift());
        }
        return promise;
    }

    utils.forEach(['options', 'get', 'head', 'post', 'put', 'delete', 'trace', 'connect', 'postJson'], function (method) {
        WeFetch.prototype[method] = function (url, params, config) {
            return this.request(utils.merge(config || {}, {
                url: url,
                data: params,
                config: config
            }))
        };
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

    function WeFetch(instanceConfig) {
        this.defaults = instanceConfig;
    }
    WeFetch.prototype.promisify = promisify;
    WeFetch.prototype.before = new InterceptorManager();
    WeFetch.prototype.after = new InterceptorManager();

    WeFetch.prototype.request = request;

    Promise.prototype.finally = function (cb) {
        var p = this.constructor;
        return this.then(function (value) {
            p.resolve(cb(value)).then(function () {
                return value
            });
        }, function (reason) {
            p.resolve(cb(value)).then(function () {
                throw reason
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

    wf.create = function (instanceConfig) {
        return createInstance(utils.merge(defaults, instanceConfig))
    };

    return wf;

}));
