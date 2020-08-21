import { Subscribable } from "./types";
import { context } from "./context";

export function observe<T>(component: any): (observable: Subscribable<T>) => Subscribable<T> {
  const pool = context.extend(component);

  return pool.observe.bind(pool);
}
