import { MiniProgramApi } from './types'

export const promisify = (api: MiniProgramApi) => {
  return (options: Record<string, any>) => {
    let _task
    const promise = new Promise((resolve, reject) => {
      _task = api({
        success: resolve,
        fail: reject,
        ...options
      })
    })
    return promise
  }
}
