export const formatTime = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}

const formatNumber = (n: number) => {
  const s = n.toString()
  return s[1] ? s : '0' + s
}


type Platform = typeof wx | typeof my | typeof swan

export function getWechat(): WechatPlatform {
  return wx as WechatPlatform
  
}
export function getAali(): AliPlatform {
  return my as AliPlatform
  
}
export function getBaidu(): BaiduPlatform {
  return swan as BaiduPlatform
  
}

export function getPlatform(target: any): target is Boolean {
  return typeof target !== 'undefined'
}

type PlatformMatching<T,U> = T extends U ? T: never




type WechatPlatform = PlatformMatching<typeof wx,typeof wx>
type BaiduPlatform = PlatformMatching<typeof swan,typeof swan>
type AliPlatform = PlatformMatching<typeof my,typeof my>

type CurrentPlatform<T> = {
  [K in keyof T]:T extends T ? T :never
}
export function adaptor():WechatPlatform | BaiduPlatform | AliPlatform{
  if (typeof wx !== 'undefined') {
    return wx as WechatPlatform 
  } else if (typeof my !== 'undefined') {
    return my as AliPlatform
  } else if (typeof swan !== 'undefined') {
    return swan as BaiduPlatform
  }
  throw new Error('The current miniProgram not supported,pls use register method instead!')
}

const p = adaptor()


