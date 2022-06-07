import { isFunction, isString } from '../utils'

import { promisify } from './promisify'
import { RequestTask, WrapperPromise } from './WrapperPromise'
import { Interceptor } from './Interceptors'

import {
  WechatRequestOption,
  AlipayRequestOption,
  DefaultsOptionType,
  MethodRequestOption
} from '../request-option'

// 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT'

export default class Wefetch {
  #defaults: DefaultsOptionType | WechatRequestOption | AlipayRequestOption
  #task!: RequestTask
  before: Interceptor = new Interceptor()
  after: Interceptor = new Interceptor()
  constructor(option: DefaultsOptionType | WechatRequestOption | AlipayRequestOption) {
    this.#defaults = option
    console.log('constructor>>', this.#defaults)
  }
  private dispatchRequest(option: WechatRequestOption | AlipayRequestOption) {
    try {
      const promise = this.#defaults.adaptor(option)
      this.#task = promise._task
      return promise.then(response => response, WrapperPromise.reject)
    } catch (error) {
      console.log(error)
    }
  }
  register(api: any) {
    if (!isFunction(api)) {
      throw new Error(`expect a function, but go a $${api}:${typeof api}`)
    }
    this.#defaults.adaptor = promisify(api)
  }
  cancel() {
    this.#task.abort()
  }
  get task() {
    return this.#task
  }
  request<T>(url: string, option: WechatRequestOption | AlipayRequestOption): WrapperPromise<T>
  request<T>(option: WechatRequestOption | AlipayRequestOption): WrapperPromise<T>
  request(option: any): any {
    if (isString(option)) {
      option = arguments[1] || {}
      option.url = arguments[0]
    }
    const chian: any[] = [this.dispatchRequest, undefined]
    let promise = WrapperPromise.resolve(option)
    this.before.forEach(interceptor => {
      chian.unshift(interceptor.fulfilled, interceptor.rejected)
    })
    this.after.forEach(interceptor => {
      chian.push(interceptor.fulfilled, interceptor.rejected)
    })
    while (chian.length) {
      promise = promise.then(chian.shift(), chian.shift())
    }
    return promise
  }

  get<T>(url: string, option: MethodRequestOption): WrapperPromise<T>
  get<T>(option: WechatRequestOption | AlipayRequestOption): WrapperPromise<T>
  get(option: any): any {
    debugger
    if (isString(option)) {
      option = { url: option }
    }
    return this.request({ ...option, method: 'GET' })
  }
  head<T>(url: string, option: MethodRequestOption): WrapperPromise<T>
  head<T>(option: WechatRequestOption | AlipayRequestOption): WrapperPromise<T>
  head(option: any): any {
    if (isString(option)) {
      option = { url: option }
    }
    return this.request({ ...option, method: 'HEAD' })
  }
  post<T>(url: string, option: MethodRequestOption): WrapperPromise<T>
  post<T>(option: WechatRequestOption | AlipayRequestOption): WrapperPromise<T>
  post(option: any): any {
    if (isString(option)) {
      option = { url: option }
    }
    return this.request({ ...option, method: 'POST' })
  }
  delete<T>(url: string, option: MethodRequestOption): WrapperPromise<T>
  delete<T>(option: WechatRequestOption | AlipayRequestOption): WrapperPromise<T>
  delete(option: any): any {
    if (isString(option)) {
      option = { url: option }
    }
    return this.request({ ...option, method: 'DELETE' })
  }
  put<T>(url: string, option: MethodRequestOption): WrapperPromise<T>
  put<T>(option: WechatRequestOption | AlipayRequestOption): WrapperPromise<T>
  put(option: any): any {
    if (isString(option)) {
      option = { url: option }
    }
    return this.request({ ...option, method: 'PUT' })
  }

  trace<T>(url: string, option: MethodRequestOption): WrapperPromise<T>
  trace<T>(option: WechatRequestOption | AlipayRequestOption): WrapperPromise<T>
  trace(option: any): any {
    if (isString(option)) {
      option = { url: option }
    }
    return this.request({ ...option, method: 'TRACE' })
  }
  connect<T>(url: string, option: MethodRequestOption): WrapperPromise<T>
  connect<T>(option: WechatRequestOption | AlipayRequestOption): WrapperPromise<T>
  connect(option: any): any {
    if (isString(option)) {
      option = { url: option }
    }
    return this.request({ ...option, method: 'CONNECT' })
  }
}
