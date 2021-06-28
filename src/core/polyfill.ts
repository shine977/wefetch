type callBack = (value: any) => void

Promise.prototype.finally =
  Promise.prototype.finally ||
  function(this: Promise<any>, cb: callBack) {
    const ctor = this.constructor as PromiseConstructor
    return this.then(
      value => {
        ctor.resolve(cb(value)).then(() => value)
      },
      reason => {
        ctor.resolve(cb(reason)).then(() => Promise.reject(reason))
      }
    )
  }
