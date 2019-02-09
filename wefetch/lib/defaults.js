
import {getRequest} from './core/platform'
var DEFAULT_CONTENT_TYPE = 'application/x-www-form-urlencoded;charset=utf-8';
export var UPLOAD_CONTENT_TYPE = 'multipart/form-data';
export var DOWNLOAD_CONTENT_TYPE = 'image/jpeg';
export var JSON_CONTENT_TYPE = 'application/json;charset=utf-8';
export var defaults = {
    createRequest: getRequest(wx.request),
    header: {
        'Content-Type': DEFAULT_CONTENT_TYPE
    },
    timeout: 0
};
