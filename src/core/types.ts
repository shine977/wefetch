export interface MiniProgramApi {
  (params: ApiParams): any
}

export interface ApiParams {
  success(response: any): void
  fail(error: object): void
  [propName: string]: any
}
