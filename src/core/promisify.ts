import { WechatRequestOption, AlipayRequestOption } from '../request-option'
import { WrapperPromise, RequestTask } from './WrapperPromise'

interface ApiParams {
  success(response: any): void
  fail(error: object): void
  [props: string]: any
}
export function promisify<R>(api: (options: ApiParams) => R extends RequestTask ? R : never) {
  return function <T>(options: WechatRequestOption | AlipayRequestOption): WrapperPromise<T> {
    const promise = new WrapperPromise<T>((resolve, reject) => {
      promise.task = api({
        success: resolve,
        fail: reject,
        ...options
      })
    })
    return promise
  }
}
