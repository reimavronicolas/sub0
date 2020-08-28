import { SubscriptionPool } from './subscriptionPool';
import { Strategy, Subscribable, Unsubscribable } from './types';
import { SubscriptionPools } from './subscriptionPools';
import { SemVer } from './semVer';
import { angularDefaultStrategy, angularIvyEagerLifecycleHooksStrategy, defaultStrategy } from './strategies';
import { Wait } from './wait';

export class Context {
  public static ExtensionError = 'Component has not been extended yet.';

  private pool: SubscriptionPool;

  constructor(component?: any) {
    if (component) {
      this.extend(component);
    }
  }

  public get extend(): (component: any) => void {
    return (component => this.pool = context.extend(component)).bind(this);
  }

  public get observe(): <T>(observable: Subscribable<T>) => Subscribable<T> {
    return (<T>(observable: Subscribable<T>) => {
      if (!this.pool) {
        throw Error(Context.ExtensionError);
      }

      return this.pool.observe(observable);
    }).bind(this);
  }

  public get subscribe(): <T>(observable: Subscribable<T>,
                              next?: (value: T) => void,
                              error?: (error: any) => void,
                              complete?: () => void) => Unsubscribable {
    return (<T>(observable, next, error, complete) => {
      if (!this.pool) {
        throw Error(Context.ExtensionError);
      }

      return this.pool.subscribe(observable, next, error, complete);
    }).bind(this);
  }

  public get add(): (subscription: Unsubscribable) => void {
    return (subscription => {
      if (!this.pool) {
        throw Error(Context.ExtensionError);
      }

      return this.pool.add(subscription);
    }).bind(this);
  }
}

export namespace context {
  let pools: SubscriptionPools;
  let strategy: Strategy;

  export function useStrategy(fn: Strategy) {
    strategy = fn;
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

  export function observe<T>(component: any): (observable: Subscribable<T>) => Subscribable<T> {
    const pool = extend(component);

    return pool.observe.bind(pool);
  }

  function proxy<T>(target: any, fn: (original: () => void) => void): void {
    const onDestroy = strategy(target).onDestroy;
    const original = onDestroy.target[onDestroy.fnName];
    onDestroy.target[onDestroy.fnName] = () => fn(original);
  }

  function reset(target: any, fn: () => void) {
    const onDestroy = strategy(target).onDestroy;
    onDestroy.target[onDestroy.fnName] = fn;
  }

  function init() {

    useStrategy(defaultStrategy);

    const wait = new Wait(200);

    wait.until(
      () => typeof window !== 'undefined' && window['ng'],
      () => {
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
      });
  }

  init();
}
