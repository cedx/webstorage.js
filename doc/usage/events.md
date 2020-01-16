path: blob/master
source: src/simple_change.ts

# Events
The [`WebStorage`](api.md) class is an [`EventTarget`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget): every time one or several values are changed (added, removed or updated) through this class, a [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) is triggered.

!!! tip
    If you target browsers that do not support the `EventTarget` constructor, you will need a dedicated polyfill. We recommend using the [`@ungap/event-target`](https://www.npmjs.com/package/@ungap/event-target) package.   

You can subscribe to these `changes` events using the `addEventListener()` method:

```js
import {LocalStorage, WebStorage} from '@cedx/webstorage';

function main() {
  const storage = new LocalStorage;
  storage.addEventListener(WebStorage.eventChanges, event => {
    const changes = event.detail;
    for (const [key, value] of changes.entries()) console.log(`${key}: ${value}`);
  });
}
```

The changes are expressed as a [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
of [`SimpleChange`](https://github.com/cedx/webstorage.js/blob/master/src/simple_change.ts) instances, where an `undefined` property indicates an absence of value:

```js
import {LocalStorage, WebStorage} from '@cedx/webstorage';

function main() {
  const storage = new LocalStorage;
  storage.addEventListener(WebStorage.eventChanges, event => {
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

The values contained in the `currentValue` and `previousValue` properties of the `SimpleChange` instances are the raw storage values. If you use the `WebStorage#setObject()` method to store a value, you will get the serialized string value, not the original value passed to the method:

```js
storage.setObject('foo', {bar: 'baz'});
// Prints: {key: "foo", current: "{\"bar\": \"baz\"}", previous: undefined}
```

!!! info
    [Storage events](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event) are partially supported: except when the [`Storage#clear()`](https://developer.mozilla.org/en-US/docs/Web/API/Storage/clear) method is called, whenever the Web storage is changed in the context of another document, a `changes` event is triggered.
