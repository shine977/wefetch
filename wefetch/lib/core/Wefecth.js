import e from './Events'
import InterceptorManager from './interceptorManager'
import promisify from "./promisify";
import request from "./request";
import './addMethods'
function WeFetch(instanceConfig) {
    this.defaults = instanceConfig;
    this.before = new InterceptorManager();
    this.after = new InterceptorManager();
    this.events = {};
    this.on = function (event, cb) {
        if (event in this.events) {
            console.error('You cannot register the same eventType multiple times');
            return;
        }
        e.on(event, cb);
        this.events[event] = cb
    }
}

WeFetch.prototype.promisify = promisify;
WeFetch.prototype.request = request;


export default WeFetch;