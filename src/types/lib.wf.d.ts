declare namespace Wefetch {
  type Method = 'get' | 'delete' | 'head' | 'options' | 'post' | 'put' | 'patch'

  interface RquestConfig {
    /** 全局或实例公共前缀，作业前缀和url合并 */
    baseUrl?: String
    /** 请求路径 */
    url: String
    downloadUrl?: String
    uploadUrl?: String
    /** 请求方法 */
    method?: Method
  }
  interface WechatMiniProgramRequestConfig extends RquestConfig {
    /**设置请求的 header，header 中不能设置 Referer。
content-type 默认为 application/json */
    header?: Object
    /** 请求的参数 */
    data?: String | Object | ArrayBuffer
    /** 返回的数据格式 */
    dataType?: String
    /** 响应的数据类型 */
    responseType?: String
    /** 开启 http2 */
    enableHttp2?: Boolean
    /** 开启 quic */
    enableQuic?: Boolean
    /** 开启 cache */
    enableCache?: Boolean
  }
  interface ByteDanceMiniProgramRequestConfig extends RquestConfig {
    /**设置请求的 header,content-type 默认为 application/json */
    header?: Object
    /**请求参数 object/array/arraybuffer*/
    data?: Object | ArrayBuffer | Array<any>
    /** 返回的数据格式 */
    dataType?: String
    /** 响应的数据类型 */
    responseType?: String
  }
  interface AlipayMiniProgramRequestConfig extends RquestConfig {
    /**设置请求的 HTTP 头对象，默认 {'content-type': 'application/json'}，该对象里面的 key 和 value 必须是 String 类型。 */
    headers?: object
    /**详见 data 参数说明（ArrayBuffer 在支付宝客户端 10.1.95 或更高版本支持） */
    data?: Object | ArrayBuffer
    /** 超时时间，单位 ms，默认 30000。 */
    timeout?: Number
    /** 期望返回的数据格式，默认 JSON，支持 JSON、text、base64、arraybuffer（10.1.70 版本开始支持）。 */
    dataType?: String
  }
  interface DingtalkMiniProgramRequestConfig extends RquestConfig {
    /**设置请求的 HTTP 头对象，默认 {'content-type': 'application/json'}，该对象里面的 key 和 value 必须是 String 类型。 */
    headers?: Object
    /**详见 data 参数说明（ArrayBuffer 在支付宝客户端 10.1.95 或更高版本支持） */
    data?: Object | ArrayBuffer
    /** 超时时间，单位 ms，默认 30000。 */
    timeout?: Number
    /** 期望返回的数据格式，默认 JSON，支持 JSON、text、base64、arraybuffer（10.1.70 版本开始支持）。 */
    dataType?: String
  }
  interface BaiduMiniProgramRequestConfig extends RquestConfig {
    /**设置请求的 header：header 中不能设置 Referer */
    header?: Object
    /**请求的参数 */
    data?: Object | String
    /**	有效值：string、json、jsonp 。如果设为 json ，会尝试对返回的数据做一次 JSON.parse */
    dataType?: String
    /**设置响应的数据类型，有效值：text、arraybuffer 最低支持版本:1.11.20*/
    responseType?: String
    /**是否开启云加速 */
    cloudCache?: Object | Boolean
  }
  interface WefetchResponse {
    data: String | Object | ArrayBuffer | Array<any>
    status: Number
    statusText: String
    config:
      | WechatMiniProgramRequestConfig
      | ByteDanceMiniProgramRequestConfig
      | DingtalkMiniProgramRequestConfig
      | AlipayMiniProgramRequestConfig
      | BaiduMiniProgramRequestConfig
    request: any
    headers: Object
  }

  interface Config {
    validateStatus(): boolean
  }

  interface WefetchPromise<T = any> extends Promise<WefetchResponse> {}
}
