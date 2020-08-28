import { Expect, Setup, Test, TestFixture } from 'alsatian';
import { Context, context } from './context';
import { Subscribable, Unsubscribable } from "./types";
import { SubscriptionPool } from "./subscriptionPool";

class TestObj<T> implements Unsubscribable, Subscribable<T> {
  public unsubScribed = false;
  public destroyed = false;

  public onDestroy() {
    this.destroyed = true;
  }

  unsubscribe(): void {
    this.unsubScribed = true;
  }

  subscribe(observer?: any): Unsubscribable;
  subscribe(next?: (value: T) => void, error?: (error: any) => void, complete?: () => void): Unsubscribable;
  subscribe(observer?: any, error?: (error: any) => void, complete?: () => void): Unsubscribable {
    return this;
  }
}

@TestFixture()
export class ContextSpec {

  private testObj: TestObj<void>;
  private sub: SubscriptionPool;

  @Setup
  public setup(): void {
    this.testObj = new TestObj();
    this.sub = context.extend(this.testObj);
  }

  @Test()
  public testObserve(): void {
    this.sub.observe(this.testObj).subscribe();
    this.testObj.onDestroy();
    Expect(this.testObj.unsubScribed).toBe(true);
    Expect(this.testObj.destroyed).toBe(true);
  }

  @Test()
  public testSubscribe(): void {
    this.sub.subscribe(this.testObj);
    this.testObj.onDestroy();
    Expect(this.testObj.unsubScribed).toBe(true);
    Expect(this.testObj.destroyed).toBe(true);
  }

  @Test()
  public testAdd(): void {
    this.sub.add(this.testObj.subscribe());
    this.testObj.onDestroy();
    Expect(this.testObj.unsubScribed).toBe(true);
    Expect(this.testObj.destroyed).toBe(true);
  }

  @Test()
  public testContextExtensionError(): void {
   const ctx = new Context();

    Expect(()=> ctx.subscribe(this.testObj)).toThrowError(Error, Context.ExtensionError);
  }

  @Test()
  public testContextInstance(): void {
    const ctx = new Context();
    const testObj = new TestObj();
    ctx.extend(testObj);
    ctx.subscribe(testObj);
    testObj.onDestroy();
    Expect(testObj.unsubScribed).toBe(true);
    Expect(testObj.destroyed).toBe(true);
  }
}
