import check from './checkStatus'
import utils from "../utils";
import {defaults, JSON_CONTENT_TYPE} from "../defaults";

import dispatchRequest from "./dispatchRequest";
function request (config) {
    if (config.url === undefined || config.url === null) {
        console.error('the request url is undefined');
        return
    }
    config = utils.merge(defaults, this.defaults, {method: 'get'}, config);
    if (config.method === 'postJson') {
        config.method = 'post';
        config.header['Content-Type'] = JSON_CONTENT_TYPE;
    }
    if (config.url.indexOf('http') === -1) {
        if (config.downloadUrl && check.is_down) {
            config.url = config.downloadUrl + config.url
        } else if (config.uploadUrl && check.is_up) {
            config.url = config.uploadUrl + config.url
        } else { //(config.baseUrl)
            config.url = config.baseUrl + config.url
        }
    }

    var chain = [dispatchRequest, undefined];
    var promise = Promise.resolve(config);
    this.before.forEach(function (interceptor) {
        chain.unshift(interceptor.fulfilled, interceptor.rejectd)
    });
    this.after.forEach(function (interceptor) {
        chain.push(interceptor.fulfilled, interceptor.rejectd)
    });
    while (chain.length) {
        promise = promise.then(chain.shift(), chain.shift())
    }
    check.is_up = null;
    check.is_down = null;
    return promise;
};

export default request