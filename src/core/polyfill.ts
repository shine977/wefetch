type CallBack = (value: any) => void

Promise.prototype.finally =
  Promise.prototype.finally ||
  function(this: Promise<any>, cb: CallBack) {
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
