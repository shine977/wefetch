import utils from "../utils";
import {JSON_CONTENT_TYPE} from "../defaults";

import dispatchRequest from "./dispatchRequest";
function request (config) {
    if (typeof config === 'string') {
      config = arguments[1] || {};
      config.url = arguments[0]
    }
    config = utils.mergeConfig(this.defaults, config);
    if (config.method === 'postJson') {
        config.method = 'post';
        config.header['Content-Type'] = JSON_CONTENT_TYPE;
    }
    if (config.url.indexOf('http') === -1) {
      if (config.downloadUrl && config.method === 'download') {
        config.url = config.downloadUrl + config.url
      } else if (config.uploadUrl && config.method === 'upload') {
        config.url = config.uploadUrl + config.url
      } else { //(config.baseUrl)
        config.url = config.baseUrl + config.url
      }
    }
    var chain = [dispatchRequest, undefined];
    config.config = config.config || {};
    var promise = Promise.resolve(config);
    this.before.forEach(function (interceptor) {
        chain.unshift(interceptor.fulfilled, interceptor.rejected)
    });
    this.after.forEach(function (interceptor) {
        chain.push(interceptor.fulfilled, interceptor.rejected)
    });
    while (chain.length) {
        promise = promise.then(chain.shift(), chain.shift())
    }
    return promise;
}

export default request
