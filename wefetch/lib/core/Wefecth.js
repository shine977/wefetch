
import InterceptorManager from './interceptorManager'
import promisify from "./promisify";
import request from "./request";
import './addMethods'
function WeFetch(instanceConfig) {
    this.defaults = instanceConfig;
}
WeFetch.prototype.promisify = promisify;
WeFetch.prototype.before = new InterceptorManager();
WeFetch.prototype.after = new InterceptorManager();

WeFetch.prototype.request = request;

export default WeFetch;