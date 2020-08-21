import { Strategy } from "./types";
import { SemVer } from "./semVer";
import { angularDefaultStrategy, angularIvyEagerLifecycleHooksStrategy, defaultStrategy } from "./strategies";

export let strategy: Strategy;

function init() {
  console.log('initStrategy()');

  if (typeof window !== 'undefined' && window['ng']) {
    import('@angular/core')
      .then((module) => {
        if (strategy) return;

        if (module.VERSION?.full) {
          const currentVersion = SemVer.version(module.VERSION.full);
          if (currentVersion.gteq('9.0.0') && currentVersion.lteq('10.0.4')) {
            setStrategy(angularIvyEagerLifecycleHooksStrategy);
          }
        }
      })
      .finally(() => {
        if (!strategy) {
          setStrategy(angularDefaultStrategy);
        }
      })
  } else {
    if (!strategy) {
      setStrategy(defaultStrategy);
    }
  }
}

export function setStrategy(fn: Strategy) {
  strategy = fn;
}

init();
