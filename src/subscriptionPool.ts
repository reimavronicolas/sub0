import { Subscribable, Unsubscribable } from "./types";
import { Subservable } from "./subservable";

export class SubscriptionPool {
  private subscriptions: Unsubscribable[] = [];

  public subscribe<T>(observable: Subscribable<T>,
                      next?: (value: T) => void,
                      error?: (error: any) => void,
                      complete?: () => void): Unsubscribable {
    const subscription = observable.subscribe(next, error, complete);
    this.subscriptions.push(subscription);

    return subscription;
  }

  public observe<T>(observable: Subscribable<T>): Subscribable<T> {
    const sub = new Subservable(observable);
    this.subscriptions.push(sub);

    return sub;
  }

  public add(subscription: Unsubscribable) {
    this.subscriptions.push(subscription);
  }

  public getSubscriptions(): Unsubscribable[] {
    return [...this.subscriptions];
  }

  public unsubscribe(subscription: Unsubscribable) {
    const index = this.subscriptions.findIndex(_ => _ === subscription);
    if (index === -1) {
      throw Error('The subscription could not be found.');
    }

    const removedSubscription = this.subscriptions.splice(index, 1)[0];
    removedSubscription.unsubscribe();
  }

  public unsubscribeAll(): void {
    console.log('unsubscribeAll()!', this.subscriptions.length);
    this.subscriptions.forEach(_ => _.unsubscribe());
    this.subscriptions = [];
  }
}
