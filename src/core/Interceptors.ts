import { WechatRequestOption, AlipayRequestOption, DefaultsOptionType } from '../request-option'

export type InterceptorType = {
  fulfilled: (
    request: Exclude<DefaultsOptionType, 'adaptor'> & WechatRequestOption & AlipayRequestOption
  ) => Exclude<DefaultsOptionType, 'adaptor'> & WechatRequestOption & AlipayRequestOption
  rejected: (reqeust: WechatRequestOption | AlipayRequestOption) => any
}
export class Interceptor {
  handles: any[] = []
  use(fulfilled: InterceptorType['fulfilled'], rejected: InterceptorType['rejected']) {
    this.handles.push({ fulfilled, rejected })
    return this.handles.length - 1
  }
  eject(id: number) {
    if (this.handles[id]) {
      this.handles[id] = null
    }
  }
  forEach(
    fn: (interceptor: {
      fulfilled: InterceptorType['fulfilled']
      rejected: InterceptorType['rejected']
    }) => any
  ) {
    this.handles.forEach(interceptor => interceptor && fn(interceptor))
  }
}
