import { WefetchRequestConfig } from './wefetch.config'

export interface WefetchResponse<T = any> {
  data: any
  status: number
  statusText: string
  config: WefetchRequestConfig
  request: any
  headers: Object
}

export interface WefetchPromise<T = any> extends Promise<WefetchResponse> {}

export interface WefetchError extends Error {
  isWefetchError?: boolean
  config: WefetchRequestConfig
  code?: string | null
  request?: any
  response: WefetchResponse
}
type Callback = (config: WefetchRequestConfig) => {}

export interface Wefetch {
  config: WefetchRequestConfig
  before(resolved: Callback, rejected: Callback): void
  after(resolved: Callback, rejected: Callback): void
  request(url: string | WefetchRequestConfig, config?: WefetchRequestConfig): WefetchPromise
  get(url: string | WefetchRequestConfig, config?: WefetchRequestConfig): WefetchPromise
  delete(url: string | WefetchRequestConfig, config?: WefetchRequestConfig): WefetchPromise
  head(url: string | WefetchRequestConfig, config?: WefetchRequestConfig): WefetchPromise
  post(url: string | WefetchRequestConfig, config?: WefetchRequestConfig): WefetchPromise
  put(url: string | WefetchRequestConfig, config?: WefetchRequestConfig): WefetchPromise
  put(url: string | WefetchRequestConfig, config?: WefetchRequestConfig): WefetchPromise
}

export interface InterceptorManagement<T> {}
export interface ResolvedHandle<T> {
  use(resolved: ResolvedHandle<T>, rejected: RejectedHandle): T | Promise<T>
}

export interface RejectedHandle {
  (error: any): any
}

// export interface WefetchEvents{
//   namespaceCache: object
//   listen(key: string, fn: Callback):void
//   remove(key: string, )
// }
