'use strict';
import {defaults} from './defaults'
import utils from './utils'
import WeFetch from './core/Wefecth'
import bind from './core/bind'

Promise.prototype.finally = function (cb) {
    var p = this.constructor;
    return this.then(function (value) {
        p.resolve(cb(value)).then(function () {
            return value
        })
    }, function (reason) {
        p.resolve(cb(value)).then(function () {
            return Promise.reject(reason)
        })
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

export default wf;