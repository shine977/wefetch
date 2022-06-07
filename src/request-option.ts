import { WrapperPromise } from './core/WrapperPromise'

export type DefaultsOptionType = Pick<
  WechatRequestOption,
  'method' | 'header' | 'timeout' | 'adaptor'
>
export type IAnyObject = {
  [x: string | number]: any
}
export interface WefetchRequestExtensionOption {
  baseUrl?: string
  downloadUrl?: string
  uploadUrl?: string
  adaptor: (options: WechatRequestOption | AlipayRequestOption) => WrapperPromise<any>
}

export interface WefetchRequestHeader {
  Authorization?: string
  Cookie?: string
  'Content-Type'?: string
  [props: string]: any
}

export interface WechatRequestOption<
  T extends string | IAnyObject | ArrayBuffer = string | IAnyObject | ArrayBuffer
> extends WefetchRequestExtensionOption {
  /** 开发者服务器接口地址 */
  url: string
  /** 接口调用结束的回调函数（调用成功、失败都会执行） */
  /** 请求的参数 */
  data?: T
  /** 返回的数据格式
   *
   * 可选值：
   * - 'json': 返回的数据为 JSON，返回后会对返回的数据进行一次 JSON.parse;
   * - '其他': 不对返回的内容进行 JSON.parse; */
  dataType?: 'json' | '其他'
  /** 开启 cache
   *
   * 最低基础库： `2.10.4` */
  enableCache?: boolean
  /** 开启 http2
   *
   * 最低基础库： `2.10.4` */
  enableHttp2?: boolean
  /** 开启 quic
   *
   * 最低基础库： `2.10.4` */
  enableQuic?: boolean
  /** 接口调用失败的回调函数 */

  /** 设置请求的 header，header 中不能设置 Referer。
   *
   * `content-type` 默认为 `application/json` */
  header?: WefetchRequestHeader
  /** HTTP 请求方法
   *
   * 可选值：
   * - 'OPTIONS': HTTP 请求 OPTIONS;
   * - 'GET': HTTP 请求 GET;
   * - 'HEAD': HTTP 请求 HEAD;
   * - 'POST': HTTP 请求 POST;
   * - 'PUT': HTTP 请求 PUT;
   * - 'DELETE': HTTP 请求 DELETE;
   * - 'TRACE': HTTP 请求 TRACE;
   * - 'CONNECT': HTTP 请求 CONNECT; */
  method?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT'
  /** 响应的数据类型
   *
   * 可选值：
   * - 'text': 响应的数据为文本;
   * - 'arraybuffer': 响应的数据为 ArrayBuffer;
   *
   * 最低基础库： `1.7.0` */
  responseType?: 'text' | 'arraybuffer'
  /** 接口调用成功的回调函数 */

  /** 超时时间，单位为毫秒
   *
   * 最低基础库： `2.10.0` */
  timeout?: number
}
export interface AlipayRequestOption<
  T extends string | IAnyObject | ArrayBuffer = string | IAnyObject | ArrayBuffer
> extends WefetchRequestExtensionOption {
  /**
   * @summary 目标服务器 URL
   * @description
   * - 目前只支持 HTTPS 协议的请求
   * - 目前只支持与 *域名白名单* 中的域名通讯
   *   - 开发过程中，可通过开发者工具 **详情 > 域名信息 > 忽略 httpRequest 域名合法性检查** 忽略该限制（模拟器、预览以及真机调试场景不会校验域名合法性）
   *   - 正式/体验版本必须在 **支付宝小程序管理中心 > 小程序详情 > 设置 > 开发设置 > 服务器域名白名单** 中配置
   *   - 域名添加或删除后仅对新版本生效，老版本仍使用修改前的域名配置
   */
  url: string
  /**
   * @summary 返回的数据格式
   * @default 'json'
   */
  dataType?: 'json' | 'text' | 'base64' | 'arraybuffer'
  /**
   * @summary HTTP 请求方法
   * @default 'GET'
   */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  /**
   * @summary 传给服务器的数据
   * @description
   * 传给服务器的数据最终会是 string 类型，如果 data 不是 string 类型，会被转换成 string 。转换规则如下：
   * - 若方法为 `GET`，会将数据转换成 querystring 形式： `encodeURIComponent(k)=encodeURIComponent(v)&encodeURIComponent(k)=encodeURIComponent(v)...`
   * - 若方法为 `POST` 且 `headers['content-type']` 为 `application/json` ，会对数据进行 JSON 序列化。
   * - 若方法为 `POST` 且 `headers['content-type']` 为 `application/x-www-form-urlencoded` ，会将数据转换成 querystring形式： `encodeURIComponent(k)=encodeURIComponent(v)&encodeURIComponent(k)=encodeURIComponent(v)...`
   */
  data?: T
  /**
   * @summary 设置请求的 HTTP 头对象
   * @description
   * - "content-type" 字段默认为 `application/json`
   * - `referer` 字段不可设置，其格式固定为 https://{appid}.hybrid.alipay-eco.com/{appid}/{version}/index.html#{page}，其中 {appid} 为小程序的 APPID，{version} 为小程序发布标识，{page} 为小程序当前页面。
   */
  headers?: WefetchRequestHeader
  /**
   * @summary 超时时间，单位 ms
   * @default 30000
   */
  timeout?: number
}
export type MethodRequestOption = Omit<WechatRequestOption, 'method' | 'url'>
