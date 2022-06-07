import { promisify } from './promisify'
import { RequestTask } from './WrapperPromise'

export function adaptor() {
  // @ts-ignore
  if (typeof wx != 'undefined') {
    // @ts-ignore
    return promisify<RequestTask>(wx.request)

    // @ts-ignore
  } else if (typeof my != 'undefined') {
    // @ts-ignore
    return promisify<RequestTask>(my.request)

    // @ts-ignore
  } else if (typeof swan != 'undefined') {
    // @ts-ignore
    return promisify<RequestTask>(swan.request)
  }
  throw new Error('The current miniProgram is not supported,pls use register method instead!')
}
