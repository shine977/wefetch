import { TaskPromise } from './polyfill'
import { MiniProgramApi } from './types'

export const promisify = (api: MiniProgramApi) => {
  return (options: Record<string, any>) => {
    const promise = new TaskPromise((resolve, reject) => {
      promise._task = api({
        success: resolve,
        fail: reject,
        ...options
      })
    })
    return promise
  }
}
