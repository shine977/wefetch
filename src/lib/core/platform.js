import promisify from './promisify'

function Platform() {
    this.platform = null;
}
Platform.prototype.getRequest = function () {
    try {
        if (wx.request) {
            this.platform = 'wechat';
            return promisify(wx.request)
        }
    } catch (e) {
        try {
            if (my.httpRequest) {
                this.platform = 'ali';
                return promisify(my.httpRequest)
            }
        }catch (e) {
            if (swan.request) {
                this.platform = 'swan';
                return promisify(swan.request)
            }
        }
    }
}
Platform.prototype.getUpload = function () {
    if (this.platform === 'wechat')return promisify(wx.uploadFile);
    if (this.platform === 'ali')return promisify(my.uploadFile);
    if (this.platform === 'swan')return promisify(swan.uploadFile);
}
Platform.prototype.getDownload = function () {
    if (this.platform === 'wechat')return promisify(wx.downloadFile)
    if (this.platform === 'ali')return promisify(my.downloadFile)
    if (this.platform === 'swan')return promisify(swan.downloadFile)
}
export default new Platform();
