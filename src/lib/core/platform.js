import promisify from './promisify'

function Platform() {
  this.platform = null;
  this.api = null;
}
Platform.prototype.getRequest = function () {
  if (typeof wx !== 'undefined') {
    this.platform = 'wx';
    this.api = wx
    return promisify(wx.request)
  } else if (typeof my !== 'undefined') {
    this.platform = 'my';
    this.api = my
    return my.request ? promisify(my.request) : promisify(my.httpRequest)
  } else if (typeof tt !== 'undefined') {
    this.api = tt;
    this.platform = 'tt';
    return promisify(tt.request)
  } else if (typeof swan !== 'undefined') {
    this.api = swan
    this.platform = 'swan';
    return promisify(swan.request)
  }
};
Platform.prototype.getUpload = function () {
  return promisify(this.api.uploadFile);
};
Platform.prototype.getDownload = function () {
  return promisify(this.api.downloadFile);
};
export default new Platform();
