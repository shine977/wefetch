function promisify (api) {
    return  function (options) {
        for (var len = arguments.length, params = Array(len > 1 ? len - 1 : 0), key = 1; key < len; key++) {
            params[key - 1] = arguments[key];
        }
        return new Promise(function (resolve, reject) {
            var t = api.apply(undefined, [Object.assign({}, options, { success: resolve, fail: reject })].concat(params));
            if (t) {
                Promise.prototype.task = t;
            }
        });
    };

};

export default promisify;