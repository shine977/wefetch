import platform from "./platform";
import utils from "../utils";
function dispatchRequest(config) {
  utils.normalizeHeaderName(config.header || config.headers);
  if (config.method === 'download') {
      config.method = 'get';
      config.createRequest = platform.getDownload()
    }
    if (config.method === 'upload'){
      config.method = 'post';
      config.createRequest = platform.getUpload()
    }
    var request = config.createRequest;
    return request(config).then(function (response) {
        return response;
    }, function (reason) {
        return Promise.reject(reason)
    })
}

export default dispatchRequest;
