export type Method = 'get' | 'delete' | 'head' | 'options' | 'post' | 'put' | 'patch'

export interface WefetchRequestConfig {
  baseUrl: string
  url: string
  timeout: number
  downloadUrl: string
  uploadUrl: string
  event: string
  data: any
  headers: object
  method: Method
}
// export type WefetchRequestConfig =
type partial = Partial<WefetchRequestConfig>
