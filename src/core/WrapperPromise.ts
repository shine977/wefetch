type IAnyObject = Record<string, any>

interface OnHeadersReceivedCallbackResult {
  /** 开发者服务器返回的 HTTP Response Header */
  header: IAnyObject
}
/** HTTP Response Header 事件的回调函数 */
type OnHeadersReceivedCallback = (result: OnHeadersReceivedCallbackResult) => void

type OffHeadersReceivedCallback = (result: OnHeadersReceivedCallbackResult) => void
export interface RequestTask {
  /** [RequestTask.abort()](https://developers.weixin.qq.com/miniprogram/dev/api/network/request/RequestTask.abort.html)
   *
   * 中断请求任务
   *
   * 最低基础库： `1.4.0` */
  abort(): void
  /** [RequestTask.offHeadersReceived(function callback)](https://developers.weixin.qq.com/miniprogram/dev/api/network/request/RequestTask.offHeadersReceived.html)
   *
   * 取消监听 HTTP Response Header 事件
   *
   * 最低基础库： `2.1.0` */
  offHeadersReceived(
    /** HTTP Response Header 事件的回调函数 */
    callback?: OffHeadersReceivedCallback
  ): void
  /** [RequestTask.onHeadersReceived(function callback)](https://developers.weixin.qq.com/miniprogram/dev/api/network/request/RequestTask.onHeadersReceived.html)
   *
   * 监听 HTTP Response Header 事件。会比请求完成事件更早
   *
   * 最低基础库： `2.1.0` */
  onHeadersReceived(
    /** HTTP Response Header 事件的回调函数 */
    callback: OnHeadersReceivedCallback
  ): void
}
export class WrapperPromise<T> extends Promise<T> {
  _task!: RequestTask
  get task(): RequestTask {
    return this._task
  }
  set task(task) {
    this._task = task
  }
  cancel() {
    this._task.abort()
  }
}
