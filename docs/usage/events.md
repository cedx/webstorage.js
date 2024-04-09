# Events
The [`Storage`](api.md) class is an [`EventTarget`](https://developer.mozilla.org/docs/Web/API/EventTarget): every time one or several values are changed (added, removed or updated) through this class, a [`StorageEvent`](https://github.com/cedx/webstorage.js/blob/main/src/storage_event.js) is triggered.

You can subscribe to these `change` events using the `onChange()` method:

```js
import {Storage} from "@cedx/webstorage";

function main() {
  const storage = Storage.local();
  storage.onChange(event => {
    const changes = event.detail;
    for (const [key, value] of changes.entries()) console.log(`${key}: ${value}`);
  });
}
```

The changes are expressed as a [`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)
of [`SimpleChange`](https://github.com/cedx/webstorage.js/blob/main/src/simple_change.ts) instances, where an `undefined` property indicates an absence of value:

```js
import {Storage} from "@cedx/webstorage";

function main() {
  const storage = Storage.local();
  storage.onChange(event => {
    const changes = event.detail;
    for (const [key, change] of changes.entries()) console.log({
      key,
      current: change.currentValue,
      previous: change.previousValue
    });
  });

  storage.set("foo", "bar");
  // Prints: {key: "foo", current: "bar", previous: undefined}

  storage.set("foo", "baz");
  // Prints: {key: "foo", current: "baz", previous: "bar"}

  storage.delete("foo");
  // Prints: {key: "foo", current: undefined, previous: "baz"}
}
```

The values contained in the `currentValue` and `previousValue` properties of the `SimpleChange` instances are the raw storage values. If you use the `Storage.setObject()` method to store a value, you will get the serialized string value, not the original value passed to the method:

```js
storage.setObject("foo", {bar: "baz"});
// Prints: {key: "foo", current: "{\"bar\": \"baz\"}", previous: undefined}
```

## Changes in the context of another document
The `Storage` class supports the global [storage events](https://developer.mozilla.org/docs/Web/API/Window/storage_event).

When a change is made to the storage area within the context of another document (i.e. in another tab or `<iframe>`), a `change` event can be triggered to notify the modification.

The class constructors have an optional `listenToGlobalEvents` parameter that allows to enable the subscription to the global storage events:

```js
import {Storage} from "@cedx/webstorage";

function main() {
  // Enable the subscription to the global events of the local storage.
  const storage = Storage.local({listenToGlobalEvents: true});

  storage.onChange(event => {
    // Also occurs when the local storage is changed in another document.
  });

  // Later, cancel the subscription to the global storage events.
  storage.destroy();
}
```

!!! warning
    When you enable the subscription to the global [storage events](https://developer.mozilla.org/docs/Web/API/Window/storage_event),
    you must take care to call the `destroy()` method when you have finished with the service in order to avoid a memory leak.
