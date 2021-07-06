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

export class TaskPromise<T> extends Promise<T> {
  public _task!: any
  constructor(
    executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void
  ) {
    super(executor)
  }
  public task<T>(this: TaskPromise<T>, cb: (task: any) => void): TaskPromise<T> | PromiseLike<T> {
    try {
      cb(this._task)
    } catch (error) {
      return Promise.reject(error)
    }
    return this
  }
}
