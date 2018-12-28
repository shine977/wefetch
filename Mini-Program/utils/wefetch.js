/*  
 * Promise based wx.request api for weChat Mini Program
 * @Github https://github.com/jonnyshao/wechat-fetch
 * wefetch beta v1.05 |(c) 2018 By Jonny Shao
 */

(function (root, definition) {
  if (typeof define === 'function' && define.amd) {
    define(definition)
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = definition()
  } else {
    throw new Error('only supported in MiniProgramcan usage')
  }
})(this, function () {
  var tostring = Object.prototype.toString;
  var requestMethods = ['options', 'get', 'head', 'post', 'put', 'delete', 'trace', 'connect', 'postJson'];
  function bind(fn, context) {
    return function wf() {
      var args = new Array(arguments.length)
      for (var i = 0, l = args.length; i < l; i++) {
        args[i] = arguments[i]
      }
      return fn.apply(context, args)
    }
  }
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
    extends(extendObj, copyObj, context) {
      this.forEach(copyObj, function (val, key) {
        if (context && val === 'function') {
          extendObj[key] = bind(val, context)
        } else {
          extendObj[key] = val;
        }
      });
      return extendObj;
    }
  }
  function createRequest (config) {
    return new Promise(function (resolve, reject) {
      	var t =  wx.request({
			url: config.url,
			header: config.header,
			data: config.data || {},
			method: config.method || 'GET',
			dataType: config.type || 'json',
			responseType: config.responseType || 'text',
			success: resolve,
			fail: reject
		})
		if (t) {
			Promise.prototype.task = t
		}
    })
  }
  var defaults = {
    createRequest: createRequest,
    baseUrl: '',
    header: {}
  }
  Promise.prototype.finally = function (cb) {
    var p = this.constructor;
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
  }
  WechatFetch.prototype.before = new InterceptorManager();
  WechatFetch.prototype.after = new InterceptorManager();
  WechatFetch.prototype.request = function (config) {
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
  utils.forEach(requestMethods, function (method) {
    WechatFetch.prototype[method] = function (url, params, config) {
    	return this.request(utils.merge(config || {}, {
			url: url,
			data: params,
			config: config,
			method: method
		}))
    }
  })
  
  function dispatchRequest(config) {
    if (config.method === 'post') {
      config.header['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
    }
    if (config.method === 'postJson') {
      config.method = 'post'
      config.header['Content-Type'] = 'application/json;charset=utf-8'
    }
    var request = config.createRequest;
    if (config.baseUrl) {
      config.url = config.baseUrl + config.url
    }
    return request(config).then(function (response) {
      return response
    }, function (reason) {
      if (reason) {
        return reason
      }
    })
  }

  var createInstance = (defaultConfig) => {
    let context = new WechatFetch(defaultConfig)
    let instance = bind(WechatFetch.prototype.request, context);
    utils.extends(instance, WechatFetch.prototype, context)
    utils.extends(instance, context)
    return instance;
  }

  var wf = createInstance(defaults)
  return wf;
})
