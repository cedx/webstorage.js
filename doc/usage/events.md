---
path: src/branch/master
source: src/simple_change.ts
---

# Events
The [`WebStorage`](api.md) class is an [`EventTarget`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget): every time one or several values are changed (added, removed or updated) through this class, a [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) is triggered.

!!! tip
    If you target browsers that do not support the `EventTarget` constructor, you will need a dedicated polyfill. We recommend using the [`@ungap/event-target`](https://www.npmjs.com/package/@ungap/event-target) package.   

You can subscribe to these `changes` events using the `addEventListener()` method:

```js
import {LocalStorage} from '@cedx/webstorage';

function main() {
  const storage = new LocalStorage;
  storage.addEventListener(LocalStorage.eventChanges, event => {
    const changes = event.detail;
    for (const [key, value] of changes.entries()) console.log(`${key}: ${value}`);
  });
}
```

The changes are expressed as a [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
of [`SimpleChange`](https://git.belin.io/cedx/webstorage.js/src/branch/master/src/simple_change.ts) instances, where an `undefined` property indicates an absence of value:

```js
import {LocalStorage} from '@cedx/webstorage';

function main() {
  const storage = new LocalStorage;
  storage.addEventListener(LocalStorage.eventChanges, event => {
    const changes = event.detail;
    for (const [key, change] of changes.entries()) console.log({
      key,
      current: change.currentValue,
      previous: change.previousValue
    });
  });

  storage.set('foo', 'bar');
  // Prints: {key: "foo", current: "bar", previous: undefined}

  storage.set('foo', 'baz');
  // Prints: {key: "foo", current: "baz", previous: "bar"}

  storage.remove('foo');
  // Prints: {key: "foo", current: undefined, previous: "baz"}
}
```

The values contained in the `currentValue` and `previousValue` properties of the `SimpleChange` instances are the raw storage values. If you use the `WebStorage.setObject()` method to store a value, you will get the serialized string value, not the original value passed to the method:

```js
storage.setObject('foo', {bar: 'baz'});
// Prints: {key: "foo", current: "{\"bar\": \"baz\"}", previous: undefined}
```

## Changes in the context of another document
The `WebStorage` parent class supports the global [storage events](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event).

When a change is made to the storage area within the context of another document (i.e. in another tab or `<iframe>`), a `changes` event can be triggered to notify the modification.

The class constructors have an optional `listenToStorageEvents` parameter that allows to enable the subscription to the global storage events:

```js
import {LocalStorage} from '@cedx/webstorage';

function main() {
  // Enable the subscription to the global events of the local storage.
  const storage = new LocalStorage({listenToStorageEvents: true});

  storage.addEventListener(LocalStorage.eventChanges, event => {
    // Also occurs when the local storage is changed in another document.
  });

  // Later, cancel the subscription to the storage events.
  storage.destroy();
}
```

!!! important
    When you enable the subscription to the global [storage events](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event), you must take care to call the `destroy()` method when you have finished with the service in order to avoid a memory leak.
