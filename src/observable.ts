import { Subscribable, Unsubscribable } from "./interfaces";

export class Observable<T> implements Subscribable<T>, Unsubscribable {
    private subscription: Unsubscribable;

    constructor(private subscribable: Subscribable<T>) {
    }

    subscribe(next?: (value: T) => void, error?: (error: any) => void, complete?: () => void): Unsubscribable {
        this.subscription = this.subscribable.subscribe(next, error, complete);

        return this.subscription;
    }

    unsubscribe(): void {
        this.subscription?.unsubscribe();
    }

}
