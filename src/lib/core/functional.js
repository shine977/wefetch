
export function retry(times,request,timeout) {
  timeout = timeout || 1000;
  if (!times && times !== 0 || !request)throw new Error('request and times params is required');
  if (typeof request !== 'function') throw new Error('request must be a function, but got a\n'+ typeof request);
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
