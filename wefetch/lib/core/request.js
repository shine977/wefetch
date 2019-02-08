import utils from "../utils";
import {defaults} from "../defaults";
import dispatchRequest from "./dispatchRequest";
import {JSON_CONTENT_TYPE} from "../defaults";
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
            config.url = config.downloadUrl + config.url
        } else if (config.uploadUrl && config._is_upload_request) {
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
    return promise;
};

export default request