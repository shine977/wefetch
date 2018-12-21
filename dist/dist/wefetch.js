(function (root, definition) {
  if (typeof define === 'function' && define.amd) {
    define(definition)
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = definition()
  } else {
    root['wefetch'] = definition()
  }
})(this, function () {
  var tostring = Object.prototype.toString;
  var utils = {
    type: (function () {
      var type = {};
      var typeAry = ['String', 'Object', 'Number', 'Array', 'Undefined', 'Function', 'Null', 'Date'];
      for (var i = 0, len = typeAry.length; i < len; i++) {
        (function (name) {
          type['is' + name] = function (obj) {
            return tostring.call(obj) === '[object' + name + ']';
          }
        })(typeAry[i])
      }
      return type;
    })(),
    forEach(obj, fn) {
      if (obj === null && typeof obj === 'undefined') {
        return;
      }
      if (typeof obj !== 'object') {
        obj = [obj]
      }
      if (Array.isArray(obj)) {
        for (let i = 0, l = obj.length; i < l; i++) {
          fn.call(null, obj[i], i, obj)
        }
      } else {
        for (let k in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, k)) {
            fn.call(null, obj[k], k, obj)
          }
        }
      }
    },
    merge() {
      var result = {};
      function assignValue(val, key) {
        if (typeof result[key] === 'object' && typeof val === 'object') {
          result[key] = utils.merge(result[key], val)
        } else {
          result[key] = val
        }
      }
      for (var i = 0, l = arguments.length; i < l; i++) {
        this.forEach(arguments[i], assignValue)
      }
      return result;
    },
    bind(fn, thisArg) {
      return function WechatFetch() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i]
        }
        return fn.apply(thisArg, args)
      }
    },
    extends(extendObj, copyObj, thisArg) {
      this.forEach(copyObj, function (val, key) {
        if (thisArg && val === 'function') {
          extendObj[key] = utils.bind(val, thisArg)
        } else {
          extendObj[key] = val;
        }
      });
      return extendObj;
    }
  }
  var promisify = (api) => {
    return (options, ...params) => new Promise((resolve, reject) => {
      api({ ...options, success: resolve, fail: reject }, ...params)
    })
  }

  var defaults = {
    createRequest: promisify(wx.request),
    baseUrl: '',
    formData: false
  }

  Promise.prototype.finally = function (cb) {
    var p = this.constructor;
    console.log(this)
    return this.then(function (value) {
      p.resolve(cb()).then(function () {
        return value
      })
    }, function (reason) {
      p.resolve(cb()).then(function () {
        throw reason
      })
    })
  }

  function InterceptorManager() {
    this.handles = []
  }
  InterceptorManager.prototype.use = function (fulfilled, rejectd) {
    this.handles.push({ fulfilled, rejectd })
  }


  InterceptorManager.prototype.eject = function (id) {
    if (this.handles[id]) {
      this.handles[id] = null
    }
  }
  InterceptorManager.prototype.forEach = function (fn) {
    utils.forEach(this.handles, function (h) {
      h && fn(h)
    })
  }
  function WechatFetch(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    }
  }
  WechatFetch.prototype.before = new InterceptorManager();
  WechatFetch.prototype.after = new InterceptorManager();
  WechatFetch.prototype.request = function (config) {
    console.log(config)
    config = utils.merge(defaults, config)
    let chain = [dispatchRequest, undefined]
    let promise = Promise.resolve(config)
    this.before.forEach(function (interceptor) {
      chain.unshift(interceptor.fulfilled, interceptor.rejectd)
    })
    this.after.forEach(function (interceptor) {
      chain.push(interceptor.fulfilled, interceptor.rejectd)
    })
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift())
    }
    return promise;
  }
  utils.forEach(['options', 'get', 'head', 'post', 'put', 'delete', 'trace', 'connect'], function (method) {
    WechatFetch.prototype[method] = function (url, params, config) {
      return this.request(utils.merge(config || {}, {
        url: url,
        data: params,
        config: config
      }))
    }
  })

  function dispatchRequest(config) {
    if (config.baseUrl) {
      config.url = config.baseUrl + '/' + config.url
    }
    return config.createRequest(config).then(function (response) {
      return response
    }, function (reason) {
      if (reason) {
        return reason
      }
    })
  }

  var createInstance = (defaultConfig) => {
    let context = new WechatFetch(defaultConfig)
    let instance = utils.bind(WechatFetch.prototype.request, context);
    utils.extends(instance, WechatFetch.prototype, context)
    utils.extends(instance, context)
    return instance;
  }

  var wefetch = createInstance(defaults)
  return wefetch;
})
