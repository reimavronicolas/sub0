import { SubscriptionPool} from './subscriptionPool';
import { Strategy, Subscribable } from './types';
import { angularDefaultStrategy, angularIvyEagerLifecycleHooksStrategy, defaultStrategy } from './strategies';
import { SemVer } from "./semVer";
import { SubscriptionPools } from "./subscriptionPools";

export namespace context {
  let strategy: Strategy;
  let pools: SubscriptionPools;

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

  function init() {
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
        })
    } else {
      if (!strategy) {
        useStrategy(defaultStrategy);
      }
    }
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

  init();
}
