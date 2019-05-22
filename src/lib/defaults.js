
import platform from './core/platform'
export var defaults = {
    createRequest: platform.getRequest(),
    header: {},
    config: {},
    method: 'get',
    timeout: 0
};
