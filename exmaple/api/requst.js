const wf = require('./wf.js');

class Request {
    constructor() {
        this.queue = {};
        this.baseUrl = 'http://localhost:3000';
        this.timeout = 3000;
        this.instance = wf.create();
    }
    merge(options) {
        return { ...options, baseUrl: this.baseUrl }

    }
    setInterceptor(instance, url) {
        instance.before.use(req => {
            req.header.Authorization = 'type in your token';
            if (Object.keys(this.queue).length === 0) {
                const type = req.config.eventType
                if (type) {
                    wf.onProcess(type, res => {
                        wx.showLoading({
                            title: `下载进度:${res.progress}%`,
                            mask: true
                        })
                    })
                } else {
                    wx.showLoading({
                        title: 'Loading',
                        mask: true
                    })
                }
                
            }
            this.queue[url] = url;
            return req;
        });
        instance.after.use(res => {
            delete this.queue[url]
            if (Object.keys(this.queue).length === 0) {
                wx.hideLoading()
            }
            console.log('instance res', res)
            return res;
        })
    }
    request(options) {
        this.setInterceptor(this.instance, options.url)
        return this.instance(this.merge(options));
    }
}

module.exports = new Request;
