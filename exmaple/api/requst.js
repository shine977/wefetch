const wf = require('wefetch');

class Request {
    constructor() {
        this.queue = {};
        this.baseUrl = 'http://localhost:3000';
        this.timeout = 3000;
    }
    merge(options) {
        return { ...options, baseUrl: this.baseUrl }

    }
    setInterceptor(instance, url) {
        instance.before.use(req => {
            req.header.Authorization = 'type in your token';
            if (Object.keys(this.queue).length === 0) {
                wx.showLoading({
                    title: 'Loading',
                    mask: true
                })
            }
            this.queue[url] = url;
            return req;
        });
        instance.after.use(res => {
            delete this.queue[url]
            if (Object.keys(this.queue).length === 0) {
                wx.hideLoading()
            }
            return res;
        })
    }
    request(options) {
        const instance = wf.create();
        this.setInterceptor(instance, options.url)
        return instance(this.merge(options));
    }
}

module.exports = new Request;
