import { SubscriptionPool } from './subscriptionPool';
import { Strategy, Subscribable } from './types';
import { angularDefaultStrategy } from './strategies';
import { VERSION } from '@angular/core';

export namespace context {

  let strategy: Strategy = angularDefaultStrategy;

  export function useStrategy(fn: Strategy) {
    strategy = fn;
  }

  export function extend<T>(component: any): SubscriptionPool {

    if (typeof window !== 'undefined' && window['ng']) {
      import('@angular/core').then(module => console.log(module.VERSION.full));
    }

    console.log(VERSION.full);

    let pool = new SubscriptionPool();

    proxy(component, ((original: () => void) => {
      pool.unsubscribeAll();
      pool = undefined;
      original?.apply(component);
      proxy(component, () => original?.apply(component));
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
}
