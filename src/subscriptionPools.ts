import { SubscriptionPool } from "./subscriptionPool";

export class SubscriptionPools {
  private pools: { target: any, pool: SubscriptionPool }[];

  public getOrAdd(target: any, getSubscriptionPool: () => SubscriptionPool): SubscriptionPool {
    let p = this.pools?.find(p => p.target === target)?.pool;
    if (p) {
      return p;
    }

    p = getSubscriptionPool();

    if (!this.pools) this.pools = [];

    this.pools.push({
      pool: p,
      target: target,
    });

    return p;
  }

  public contains(target: any) {
    return this.pools?.some(p => p.target === target);
  }
}
