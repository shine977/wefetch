import utils from '../utils'
function InterceptorManager() {
    this.handles = []
}

InterceptorManager.prototype.use = function (fulfilled, rejected) {
    this.handles.push({ fulfilled: fulfilled, rejected: rejected })
};


InterceptorManager.prototype.eject = function (id) {
    if (this.handles[id]) {
        this.handles[id] = null
    }
};
InterceptorManager.prototype.forEach = function (fn) {
    // console.log(this.handles);
    utils.forEach(this.handles, function (h) {
        h && fn(h)
    })
};

export default InterceptorManager;