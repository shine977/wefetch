import promisify from './promisify'

function Platform() {
    this.platform = null;
}
Platform.prototype.getRequest = function () {
    try {
        if (wx.request) {
            this.platform = 'wx';
            return promisify(wx.request)
        }
    } catch (e) {
        try {
            if (my.request) {
              this.platform = 'my';
              return promisify(my.request)
            } else if (my.httpRequest){
              this.platform = 'my';
              return promisify(my.httpRequest)
            }
        }catch (e) {
            try{
              if (tt.request) {
                this.platform = 'tt';
                return promisify(tt.request)
              }
            }catch (e) {
              if (swan.request) {
                this.platform = 'swan';
                return promisify(swan.request)
              }
            }
        }
    }
};
Platform.prototype.getUpload = function () {
  return promisify(this.getPlatform().uploadFile);
};
Platform.prototype.getDownload = function () {
  return promisify(this.getPlatform().downloadFile);
};
Platform.prototype.getPlatform = function () {
  if (this.platform === 'wx')return wx;
  if (this.platform === 'my')return my;
  if (this.platform === 'swan')return swan;
  if (this.platform === 'tt')return tt;
};
export default new Platform();
