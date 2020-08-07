export declare interface OnDestroy {
    ngOnDestroy(): void;
    constructor: any;
}

export declare interface Unsubscribable {
    unsubscribe(): void;
}

export interface Subscribable<T> {
    subscribe(next?: (value: T) => void, error?: (error: any) => void, complete?: () => void): Unsubscribable;
}
