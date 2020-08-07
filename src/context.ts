import { OnDestroy} from "./interfaces";
import { SubscriptionPool } from "./subscriptionPool";

export namespace context {
    export function extend(component: OnDestroy): SubscriptionPool {
        let pool = new SubscriptionPool();

        proxy(component, ((original: () => void) => {
            pool.unsubscribeAll();
            pool = undefined;
            original.apply(component);
            proxy(component, () => original.apply(component));
        }));

        return pool;
    }

    // Using private API until the corresponding Angular issues are resolved.
    // Issues:  https://github.com/angular/angular/issues/31495, https://github.com/angular/angular/issues/30497
    // PR:      https://github.com/angular/angular/pull/35464
    function proxy<T>(target: OnDestroy, fn: (original: () => void) => void) {
        if (target.constructor.ɵcmp) {
            const original = target.constructor.ɵcmp.onDestroy;
            target.constructor.ɵcmp.onDestroy = () => fn(original);

            return;
        }

        const original = target.constructor.prototype.ngOnDestroy;
        target.constructor.prototype.ngOnDestroy = () => fn(original);

        return;
    }
}
