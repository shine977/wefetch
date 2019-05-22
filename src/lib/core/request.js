import utils from "../utils";
import dispatchRequest from "./dispatchRequest";
import platform from "./platform";
function request (config) {
    if (typeof config === 'string') {
      config = arguments[1] || {};
      config.url = arguments[0]
    }
    config = utils.mergeConfig(this.defaults, config);
    if (config.url.indexOf('http') === -1) {
      if (config.downloadUrl && config.method === 'download') {
        config.url = config.downloadUrl + config.url
      } else if (config.uploadUrl && config.method === 'upload') {
        config.url = config.uploadUrl + config.url
      } else { //(config.baseUrl)
        config.url = config.baseUrl + config.url
      }
    }
    // 阿里系的header是复数
    if (platform.platform === 'my' ) {
      if (config.method !== 'download' && config.method !== 'upload') {
        config.headers = Object.assign({}, config.header);
        delete config.header
      }
    }
    var chain = [dispatchRequest, undefined];
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
