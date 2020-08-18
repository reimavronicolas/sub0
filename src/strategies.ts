import { Strategy } from './types';

export const defaultStrategy: Strategy = (fn) => {
  return {
    onDestroy: {
      fnName: 'onDestroy',
      target: fn.constructor.prototype,
    }
  }
}

export const angularDefaultStrategy: Strategy = (component) => {
  return {
    onDestroy: {
      fnName: 'ngOnDestroy',
      target: component.constructor.prototype,
    },
  };
};

export const angularIvyEagerLifecycleHooksStrategy: Strategy = (component) => {
  // noinspection JSNonASCIINames
  return {
    onDestroy: {
      fnName: 'onDestroy',
      target: component.constructor.ɵcmp,
    },
  };
};

