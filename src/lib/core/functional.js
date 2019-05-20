import platform from'./platform'
import promisify from "./promisify";
export function retry(times,request,timeout) {
  timeout = timeout || 1000;
  if (!times && times !== 0 || !request)throw new Error('request and times params is required');
  if (typeof request !== 'function') throw new Error('request must be a function, but got a\n'+ typeof request)
  if (!timeout) timeout = 0;
  var p = request();
  if (times > 1) {
    times --;
    return new Promise(function(resolve, reject) {
      p.then(resolve).catch(function () {
        setTimeout(function() {
          resolve(retry(times, request, timeout))
        }, timeout);
      })
    })
  }
  return p;
}
export function getUserInfo(type) {
  var p = platform.getPlatform();
  var get_setting = promisify(p.getSetting);
  var get_user_info = promisify(p.getUserInfo);
  if (type){
    return get_setting().then(function (res) {
      if (res.authSetting['scope.userInfo']) {
        return get_user_info()
      }
    })
  }
  return get_user_info()
}
