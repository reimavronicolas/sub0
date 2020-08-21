import { SubscriptionPool} from './subscriptionPool';
import { Strategy, Subscribable, Unsubscribable } from './types';
import { SubscriptionPools } from "./subscriptionPools";
import { strategy, setStrategy } from "./strategy";
import { Subservable } from "./subservable";

export class Context<T> implements Subscribable<T> {
  private pool: SubscriptionPool;

  constructor(private component?: any) {
    if (this.component) {
      this.extend();
    }
  }

  public setInstance(component: any) {
    this.component = component;

    this.extend();
  }

  private extend() {
    this.pool = context.extend(this.component);
  }

  subscribe(observer?: any): Unsubscribable;
  subscribe(next?: (value: T) => void, error?: (error: any) => void, complete?: () => void): Unsubscribable;
  subscribe(observer?: any, error?: (error: any) => void, complete?: () => void): Unsubscribable  {
    return;
  }
}

export namespace context {
  let pools: SubscriptionPools;

  export function useStrategy(fn: Strategy) {
    setStrategy(strategy);
  }

  export function extend<T>(component: any): SubscriptionPool {
    if (!pools) pools = new SubscriptionPools();

    const pool = pools.getOrAdd(strategy(component).onDestroy.target, () => new SubscriptionPool());

    proxy(component, ((original: () => void) => {
      pool.unsubscribeAll();
      original?.apply(component);
      reset(component, original);
    }));

    return pool;
  }

/*  export function observe<T>(component: any): (observable: Subscribable<T>) => Subscribable<T> {
    const pool = context.extend(component);

    return pool.observe.bind(pool);
  }*/

  export function init<T>(): <T>(observable?: Subscribable<T>) => Context<T> {
    const ctx = new Context();
    return observe.bind(ctx);
  }

  export function observe<T>(this: Context<T>, observable?: Subscribable<T>): Context<T> {
    if (observable) {
      const subscribable = this['pool'].observe(observable);
      this.subscribe = subscribable.subscribe.bind(subscribable);
    }

    return this;
  }

/*
  function init() {
    if (typeof window !== 'undefined' && window['ng']) {
      import('@angular/core')
        .then((module) => {
          if (strategy) return;

          if (module.VERSION?.full) {
            const currentVersion = SemVer.version(module.VERSION.full);
            if (currentVersion.gteq('9.0.0') && currentVersion.lteq('10.0.4')) {
              useStrategy(angularIvyEagerLifecycleHooksStrategy);
            }
          }
        })
        .finally(() => {
          if (!strategy) {
            useStrategy(angularDefaultStrategy);
          }
        })
    } else {
      if (!strategy) {
        useStrategy(defaultStrategy);
      }
    }
  }*/

  function proxy<T>(target: any, fn: (original: () => void) => void): void {
    const onDestroy = strategy(target).onDestroy;
    const original = onDestroy.target[onDestroy.fnName];
    onDestroy.target[onDestroy.fnName] = () => fn(original);
  }

  function reset(target: any, fn: () => void) {
    const onDestroy = strategy(target).onDestroy;
    onDestroy.target[onDestroy.fnName] = fn;
  }

  // init();


  /*function getStrategy(callback: (strategy: Strategy) => void) {
    if (strategy) {
      callback(strategy);
      return;
    }

    if (typeof window !== 'undefined' && window['ng']) {
      import('@angular/core')
        .then((module) => {
          if (strategy) return;

          if (module.VERSION?.full) {
            const currentVersion = SemVer.version(module.VERSION.full);
            if (currentVersion.gteq('9.0.0') && currentVersion.lteq('10.0.4')) {
              strategy = angularIvyEagerLifecycleHooksStrategy;
            }
          }
        })
        .finally(() => {
          if (!strategy) {
            useStrategy(angularDefaultStrategy);
          }

          callback(strategy);
        })
    } else {
      if (!strategy) {
        useStrategy(defaultStrategy);
        callback(strategy);
      }
    }
  }*/
}
