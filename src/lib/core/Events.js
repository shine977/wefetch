function Events() {
    this.listeners = {};
}

Events.prototype.on = function (type, cb) {
    if (!(type in this.listeners)) {
        this.listeners[type] = [];
    }
    this.listeners[type].push(cb)
};

Events.prototype.emit = function (type, task) {
    var listener = this.listeners[type];
    if (listener) {
        listener.forEach(function (h) {
            h(task)
        })
    }
};

export default new Events();