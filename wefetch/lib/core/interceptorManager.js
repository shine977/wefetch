function InterceptorManager() {
    this.handles = []
}

InterceptorManager.prototype.use = function (fulfilled, rejected) {
    this.handles.push({ fulfilled: fulfilled, rejected: rejected });
    return this.handles.length - 1;
};


InterceptorManager.prototype.eject = function (id) {
    if (this.handles[id]) {
        this.handles[id] = null
    }

};
InterceptorManager.prototype.forEach = function (fn) {
    this.handles.forEach(function (h) {
        h && fn(h)
    })
};

export default InterceptorManager;