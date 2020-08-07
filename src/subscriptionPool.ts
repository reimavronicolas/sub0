import { Subscribable, Unsubscribable } from "./interfaces";
import { Observable } from "./observable";

export class SubscriptionPool {
    private _subscriptions: Unsubscribable[] = [];

    public subscribe<T>(observable: Subscribable<T>,
                        next?: (value: T) => void,
                        error?: (error: any) => void,
                        complete?: () => void): Unsubscribable {
        const subscription = observable.subscribe(next, error, complete);
        this._subscriptions.push(subscription);

        return subscription;
    }

    public zero<T>(observable: Subscribable<T>): Observable<T> {
        const o = new Observable<T>(observable);
        this._subscriptions.push(o);

        return o;
    }

    public add(subscription: Unsubscribable) {
        this._subscriptions.push(subscription);
    }

    public getSubscriptions(): Unsubscribable[] {
        return [...this._subscriptions];
    }

    public unsubscribe(subscription: Unsubscribable) {
        const index = this._subscriptions.findIndex(_ => _ === subscription);
        if (index === -1) {
            throw Error('The subscription could not be found.')
        }

        const removedSubscription = this._subscriptions.splice(index, 1)[0];
        removedSubscription.unsubscribe();
    }

    public unsubscribeAll(): void {
        console.log('unsubscribeAll()!');
        this._subscriptions.forEach(_ => _.unsubscribe());
        this._subscriptions = [];
    }
}
