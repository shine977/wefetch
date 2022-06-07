import Wefetch from './core/Wefetch'

export const isPlainObject = (target: any): target is object => {
  return Object.prototype.toString.call(target) === '[object Object]'
}

export const isArray = (target: any): target is [] => {
  return Array.isArray(target)
}

export const isString = (target: any): target is string => typeof target === 'string'

export const isFunction = (target: any): target is Function => typeof target === 'function'

type PickProperty<T> = {
  [K in keyof T]: T[K]
}

type PropertyKey = PickProperty<Wefetch>
export function extendsObj(...args: Wefetch[]) {
  for (let i = 1; i < args.length; i++) {
    let otherObj = args[i]
    Object.keys(otherObj).forEach(key => {
      // @ts-ignore
      args[0][key] = otherObj[key]
    })
  }
}
