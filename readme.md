# sub0

A simple library to automatically unsubscribe from RxJS "like" observables. The "like" meaning that there is no
dependency on RxJS. Anything with a subscribe/unsubscribe interface will also work.

## Installation

```bash
npm install subsink --save
```

## Usage

### Configuration

By default sub0 is configured to extend the Angular `ngOnDestroy` lifecyle hook in order to unsubscribe from all 
subscriptions. 

You can also create your own _"strategy"_ and specify a custom `destroy` function to extend:

```ts
context.useStrategy((component) => {
  return {
    onDestroy: {
      fnName: 'myOwnDestroy',
      target: component.constructor.prototype,
    },
  };
});
```

#### Angular 9+

With Angular 9 versions and above (in AOT mode), sub0 has to be configured manually to use the
`angularIvyEagerLifecycleHooksStrategy` which will use the Angular private API. Without this it will not work.
This is due the fact that Angular currently reads lifecycle hooks eagerly, making it impossible to extend/add lifcycle
hooks dynamically.

```ts
context.useStrategy(angularIvyEagerLifecycleHooksStrategy);
```

### Subscription syntax

There are 3 ways to register a subscription. Each one is identical 

```ts
import { context } from 'sub0';
...

export class HelloWorldComponent implements OnInit {
  private sub = context.extend(this);

  constructor(private store: Store<AppState>) {}

  public ngOnInit() {
    // 1. Using observe()
    this.sub.observe(this.store.select(selectHelloWorld)).subscribe(value => console.log(value));
   
    // 2. Using add()
    this.sub.add(this.store.select(selectHelloWorld)).subscribe(value => console.log(value));

    // 3. Using subscribe()
    this.sub.subscribe(this.store.select(selectHelloWorld), value => console.log(value));

  }
}
```
