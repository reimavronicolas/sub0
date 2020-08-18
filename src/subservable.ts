import { Subscribable, Unsubscribable } from './types';

export class Subservable<T> implements Subscribable<T>, Unsubscribable {
  constructor(private observable: Subscribable<T>) {
  }

  private subscription: Unsubscribable;

  subscribe(observer?: any): Unsubscribable;
  subscribe(next?: (value: T) => void, error?: (error: any) => void, complete?: () => void): Unsubscribable;

  subscribe(observerOrNext?: any | ((value: T) => void),
            error?: (error: any) => void,
            complete?: () => void): Unsubscribable {

    if ((observerOrNext as ((value: T) => void))?.length) {
      this.subscription = this.observable.subscribe(observerOrNext as ((value: T) => void), error, complete);
    } else {
      this.subscription = this.observable.subscribe(observerOrNext);
    }

    return this.subscription;
  }

  unsubscribe(): void {
    this.subscription?.unsubscribe();
  }
}
