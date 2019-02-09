
import InterceptorManager from './interceptorManager'
import promisify from "./promisify";
import request from "./request";
import './addMethods'
function WeFetch(instanceConfig) {
    this.defaults = instanceConfig;
    this.before = new InterceptorManager();
    this.after = new InterceptorManager();
}
WeFetch.prototype.promisify = promisify;
WeFetch.prototype.request = request;

export default WeFetch;