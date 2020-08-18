# sub0

A simple library to automatically unsubscribe from RxJS "like" observables. The "like" meaning that there is no
dependency on RxJS. Anything with a subscribe/unsubscribe interface will also work.

## Installation

```bash
npm install sub0 --save
```

## Usage

### Subscription syntax

There are 3 ways to register a subscription:

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

### Configuration

sub0 automatically detects whether you're running Angular or not. If Angular is detected it will use the `ngOnDestroy`
lifecyle hook in order to unsubscribe from subscriptions. Without the presence of Angular it defaults to looking for an
`onDestroy` function on Object.prototype.constructor.

You can also create your own _"strategy"_ and specify a custom `destroy` function which sub0 will use to unsubscribe:

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

#### [IMPORTANT] Angular 9 - 10.0.4

From Sub0 v0.3, it now automatically detects your Angular version and chooses the appropriate strategy. I.e. no additional
config needed. We recommend using v0.3 or higher.

Sub0 versions below 0.3 requires additional configuration to work with Angular versions 9 to 10.0.4.
With these versions, sub0 has to be configured manually to use the `angularIvyEagerLifecycleHooksStrategy` which makes
use of the Angular private API. Without this it will not work. This is due to a bug in Angular which reads lifecycle
hooks eagerly, making it impossible to extend/add lifcycle hooks dynamically.

Add this somewhere globally (e.g. app.module.ts):
```ts
context.useStrategy(angularIvyEagerLifecycleHooksStrategy);
```
