/*  
    Promise based wx.request api for  Mini Program
    @Github https://github.com/jonnyshao/wechat-fetch
    wefetch beta v1.3.3 |(c) 2018-2019 By Jonny Shao
*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.wefetch = factory());
}(this, (function () { 'use strict';

    function Events() {
        this.listeners = {};
    }

    Events.prototype.on = function (type, cb) {
        if (!(type in this.listeners)) {
            this.listeners[type] = [];
        }
        this.listeners[type].push(cb);
    };

    Events.prototype.emit = function (type, task) {
        var listener = this.listeners[type];
        if (listener) {
            listener.forEach(function (h) {
                h(task);
            });
        }
    };

    var e = new Events();

    function promisify (api) {
        return  function (options) {
            options = options || {};
            options.config = options.config || {};
            for (var len = arguments.length, params = Array(len > 1 ? len - 1 : 0), key = 1; key < len; key++) {
                params[key - 1] = arguments[key];
            }
            return new Promise(function (resolve, reject) {
                options.config.eventType ? e.emit(options.config.eventType, api.apply(undefined, [Object.assign({}, options, {success: resolve, fail: reject})].concat(params)))
                    : api.apply(undefined, [Object.assign({}, options, {success: resolve, fail: reject})].concat(params));
            })
        };
    }

    function Platform() {
      this.platform = null;
      this.api = null;
    }
    Platform.prototype.getRequest = function () {
      if (typeof wx !== 'undefined') {
        this.platform = 'wx';
        this.api = wx;
        return promisify(wx.request)
      } else if (typeof my !== 'undefined') {
        this.platform = 'my';
        this.api = my;
        return my.request ? promisify(my.request) : promisify(my.httpRequest)
      } else if (typeof tt !== 'undefined') {
        this.api = tt;
        this.platform = 'tt';
        return promisify(tt.request)
      } else if (typeof swan !== 'undefined') {
        this.api = swan;
        this.platform = 'swan';
        return promisify(swan.request)
      }
    };
    Platform.prototype.getUpload = function () {
      return promisify(this.api.uploadFile);
    };
    Platform.prototype.getDownload = function () {
      return promisify(this.api.downloadFile);
    };
    var platform = new Platform();

    var defaults = {
        createRequest: platform.getRequest(),
        header: {},
        config: {},
        method: 'get',
        timeout: 0
    };

    function bind(fn, context) {
        return function wf (){
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
        normalizeHeaderName: function (header) {
          for (var key in header) {
            if (/Content-Type/ig.test(key)){
              header['Content-Type'] = header[key];
              delete header[key];
            }
          }
        },
        forEach: function (obj, fn) {
            if (!obj) {
                return;
            }
            if (typeof obj !== 'object') {
                obj = [obj];
            }
            if (this.type.isArray(obj)) {
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
        deepMerge: function() {
            var result = {};
                function assignValue(val, key) {
                    if (typeof result[key] === 'object' && typeof val === 'object') {
                        result[key] = utils.deepMerge(result[key], val);
                    } else if (typeof val === 'object'){
                        result[key] = utils.deepMerge({},val);
                    } else {
                        result[key] = val;
                    }
                }
                for (var i = 0, l = arguments.length; i < l; i++) {
                    this.forEach(arguments[i], assignValue);
                }
                return result;
        },
        mergeConfig: function(source,target){
          var c = {}; target = target || {};
            ['url','method', 'data','config'].forEach(function (prop) {
                if (target[prop]){
                    c[prop] = target[prop];
                }
            });
            ['header','headers'].forEach(function (prop) {
                if (utils.type.isObject(target[prop])){
                    c[prop] = utils.deepMerge(source[prop],target[prop]);
                } else if(target[prop]){
                    c[prop] = target[prop];
                } else if(utils.type.isObject(source[prop])){
                    c[prop] = utils.deepMerge(source[prop]);
                } else if (source[prop]){
                    c[prop] = source[prop];
                }
            });
            ['baseUrl','timeout','eventType','createRequest'].forEach(function (prop) {
                if (target[prop] !== undefined){
                    c[prop] = target[prop];
                } else if (source[prop] !== undefined){
                    c[prop] = source[prop];
                }
            });
          return c
        },
        extends: function (extendObj, copyObj, thisArg) {
            this.forEach(copyObj, function (val, key) {
                if (thisArg && typeof val === 'function') {
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

    function dispatchRequest(config) {
      utils.normalizeHeaderName(config.header || config.headers);
      if (config.method === 'download') {
          config.method = 'get';
          config.createRequest = platform.getDownload();
        }
        if (config.method === 'upload'){
          config.method = 'post';
          config.createRequest = platform.getUpload();
        }
        var request = config.createRequest;
        return request(config).then(function (response) {
            return response;
        }, function (reason) {
            return Promise.reject(reason)
        })
    }

    function request (config) {
        if (typeof config === 'string') {
          config = arguments[1] || {};
          config.url = arguments[0];
        }
        config = utils.mergeConfig(this.defaults, config);
        if (config.url.indexOf('http') === -1) {
          if (config.downloadUrl && config.method === 'download') {
            config.url = config.downloadUrl + config.url;
          } else if (config.uploadUrl && config.method === 'upload') {
            config.url = config.uploadUrl + config.url;
          } else { //(config.baseUrl)
            config.url = config.baseUrl + config.url;
          }
        }
        // 阿里系的header是复数
        if (platform.platform === 'my' ) {
          if (config.method !== 'download' && config.method !== 'upload') {
            config.headers = Object.assign({}, config.header);
            delete config.header;
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
        return promise;
    }

    ['options', 'get', 'head', 'post', 'put', 'delete', 'trace', 'connect'].forEach(function (method) {
        WeFetch.prototype[method] = function (url, config) {
            return this.request(utils.merge(config || {}, {
                url: url,
                method: method
            }))
        };
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

    function WeFetch(instanceConfig) {
      this.defaults = instanceConfig;
      this.before = new InterceptorManager();
      this.after = new InterceptorManager();
    }

    WeFetch.prototype.on = function (event, cb) {
      e.on(event, cb);
    };
    WeFetch.prototype.abort = function (event, cb) {
      this.on(event, function (t) {
        t.abort();
        cb && cb();
      });
    };
    WeFetch.prototype.onProcess = function (event, cb) {
      this.on(event, function (t) {
        t.onProgressUpdate(cb);
      });
    };
    WeFetch.prototype.promisify = promisify;
    WeFetch.prototype.request = request;

    function retry(times,request,timeout) {
      timeout = timeout || 1000;
      if (!times && times !== 0 || !request)throw new Error('request and times params is required');
      if (typeof request !== 'function') throw new Error('request must be a function, but got a\n'+ typeof request);
      var p = request();
      if (times > 1) {
        times --;
        return new Promise(function(resolve, reject) {
          p.then(resolve).catch(function () {
            setTimeout(function() {
              resolve(retry(times, request, timeout));
            }, timeout);
          });
        })
      }
      return p;
    }

    Promise.prototype.finally = Promise.prototype.finally || function (cb) {
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

    function createInstance(defaultConfig) {
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
    wf.retry = retry;
    wf.create = function (instanceConfig) {
        return createInstance(utils.merge(defaults, instanceConfig))
    };

    return wf;

})));
