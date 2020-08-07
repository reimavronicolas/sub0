import { SubscriptionPool } from './subscriptionPool';
import { Strategy } from "./types";
import { angularDefaultStrategy } from "./strategies";

export namespace context {

  let strategy: Strategy = angularDefaultStrategy;

  export function useStrategy(fn: Strategy) {
    strategy = fn;
  }

  export function extend<T>(component: any): SubscriptionPool {
    let pool = new SubscriptionPool();

    proxy(component, ((original: () => void) => {
      pool.unsubscribeAll();
      pool = undefined;
      original?.apply(component);
      proxy(component, () => original?.apply(component));
    }));

    return pool;
  }

  function proxy<T>(target: any, fn: (original: () => void) => void): void {
    const onDestroy = strategy(target).onDestroy;
    const original = onDestroy.target[onDestroy.fnName];
    onDestroy.target[onDestroy.fnName] = () => fn(original);
  }
}
