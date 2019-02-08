
import getPlatform from './platform/index'

var DEFAULT_CONTENT_TYPE = 'application/x-www-form-urlencoded;charset=utf-8';
export var JSON_CONTENT_TYPE = 'application/json;charset=utf-8';
export var defaults = {
    createRequest: getPlatform(),
    baseUrl: '', // request url
    method: 'get',
    header: {
        'Content-Type': DEFAULT_CONTENT_TYPE
    }
};
