export class Observable<T> {
  constructor(subscribe?: (this: Observable<T>) => void) {
    if (subscribe) {
      this._subscribe = subscribe
    }
  }
  static create() {}
  protected _subscribe() {}
}
