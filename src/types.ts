export declare interface Subscribable<T> {
  subscribe(observer?: any): Unsubscribable;

  subscribe(next?: (value: T) => void, error?: (error: any) => void, complete?: () => void): Unsubscribable;
}

export declare interface Unsubscribable {
  unsubscribe(): void;
}

export declare type Strategy = (component: any) => {
  onDestroy: {
    fnName: string, target: any
  }
};
