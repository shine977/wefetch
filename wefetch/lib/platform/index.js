import promisify from '../core/promisify'
var getPlatform = function () {
    if (wx.request) {
        return promisify(wx.request)
    }
    if (my.httpRequest) {
        return promisify(my.httpRequest)
    }
};

export default getPlatform;