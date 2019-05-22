var tostring = Object.prototype.toString;
import bind from './core/bind'
var utils = {
    type: (function () {
        var type = {};
        var typeAry = ['String', 'Object', 'Number', 'Array', 'Undefined', 'Function', 'Null', 'Date'];
        for (var i = 0, len = typeAry.length; i < len; i++) {
            (function (name) {
                type['is' + name] = function (obj) {
                    return tostring.call(obj) === '[object' +' '+ name + ']';
                }
            })(typeAry[i])
        }
        return type;
    })(),
    forEach: function (obj, fn) {
        if (!obj) {
            return;
        }
        if (typeof obj !== 'object') {
            obj = [obj]
        }
        if (this.type.isArray(obj)) {
            for (var i = 0, l = obj.length; i < l; i++) {
                fn.call(null, obj[i], i, obj)
            }
        } else {
            for (var k in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, k)) {
                    fn.call(null, obj[k], k, obj)
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
            this.forEach(arguments[i], assignValue)
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
                    result[key] = val
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
                c[prop] = target[prop]
            }
        });
        ['header','headers'].forEach(function (prop) {
            if (utils.type.isObject(target[prop])){
                c[prop] = utils.deepMerge(source[prop],target[prop])
            } else if(target[prop]){
                c[prop] = target[prop]
            } else if(utils.type.isObject(source[prop])){
                c[prop] = utils.deepMerge(source[prop])
            } else if (source[prop]){
                c[prop] = source[prop]
            }
        });
        ['baseUrl','timeout','eventType','createRequest'].forEach(function (prop) {
            if (target[prop] !== undefined){
                c[prop] = target[prop]
            } else if (source[prop] !== undefined){
                c[prop] = source[prop]
            }
        });
      return c
    },
    extends: function (extendObj, copyObj, thisArg) {
        this.forEach(copyObj, function (val, key) {
            if (thisArg && typeof val === 'function') {
                extendObj[key] = bind(val, thisArg)
            } else {
                extendObj[key] = val;
            }
        });
        return extendObj;
    }
}

export default utils;
