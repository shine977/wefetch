import e from './Events'
import InterceptorManager from './interceptorManager'
import promisify from "./promisify";
import request from "./request";
import './addMethods'

function WeFetch(instanceConfig) {
  this.defaults = instanceConfig;
  this.before = new InterceptorManager();
  this.after = new InterceptorManager();
}

WeFetch.prototype.on = function (event, cb) {
  e.on(event, cb);
};
WeFetch.prototype.abort = function (event, cb) {
  this.on(event, function (t) {
    t.abort();
    cb && cb()
  })
};
WeFetch.prototype.onProcess = function (event, cb) {
  this.on(event, function (t) {
    t.onProgressUpdate(cb)
  })
};
WeFetch.prototype.promisify = promisify;
WeFetch.prototype.request = request;
export default WeFetch;
