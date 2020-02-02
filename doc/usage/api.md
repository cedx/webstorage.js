path: blob/master
source: src/storage.ts

# Programming interface
This package provides two services dedicated to the Web Storage: the `LocalStorage` and `SessionStorage` classes.

```js
import {LocalStorage} from '@cedx/webstorage';

function main() {
  const storage = new LocalStorage;

  storage.set('foo', 'bar');
  console.log(storage.get('foo')); // "bar"

  storage.setObject('foo', {baz: 'qux'});
  console.log(storage.getObject('foo')); // {baz: "qux"}
}
```

Each class extends from the `WebStorage` abstract class that has the following API:

## **#keys**: string[]
Returns the keys of the the associated storage:

```js
import {LocalStorage} from '@cedx/webstorage';

function main() {
  const storage = new LocalStorage;
  console.log(storage.keys); // []
    
  storage.set('foo', 'bar');
  console.log(storage.keys); // ["foo"]
}
```

## **#length**: number
Returns the number of entries in the associated storage:

```js
import {LocalStorage} from '@cedx/webstorage';

function main() {
  const storage = new LocalStorage;
  console.log(storage.length); // 0
    
  storage.set('foo', 'bar');
  console.log(storage.length); // 1
}
```

## **#clear**(): void
Removes all entries from the associated storage:

```js
import {LocalStorage} from '@cedx/webstorage';

function main() {
  const storage = new LocalStorage;

  storage.set('foo', 'bar');
  console.log(storage.length); // 1
    
  storage.clear();
  console.log(storage.length); // 0
}
```

## **#destroy**(): void
When a service is instantiated, it automatically listens for
the [storage events](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event).
When you have done using the service instance, it's preferable to call the `destroy()` method to cancel the subscription to these events.

```js
import {LocalStorage} from '@cedx/webstorage';

function main() {
  // Work with the service...
  const storage = new LocalStorage;

  // Later, cancel the subscription to the storage events.
  storage.destroy();
}
```

## **#get**(key: string, defaultValue?: string): string|undefined
Returns the value associated to the specified key:

```js
import {LocalStorage} from '@cedx/webstorage';

function main() {
  const storage = new LocalStorage;
  console.log(storage.get('foo')); // undefined
  console.log(storage.get('foo', 'qux')); // "qux"

  storage.set('foo', 'bar');
  console.log(storage.get('foo')); // "bar"
}
```

Returns `undefined` or the given default value if the key is not found.

## **#getObject**(key: string, defaultValue?: any): any
Deserializes and returns the value associated to the specified key:

```js
import {LocalStorage} from '@cedx/webstorage';

function main() {
  const storage = new LocalStorage;
  console.log(storage.getObject('foo')); // undefined
  console.log(storage.getObject('foo', 'qux')); // "qux"
  
  storage.setObject('foo', {bar: 'baz'});
  console.log(storage.getObject('foo')); // {bar: "baz"}
}
```

!!! info
    The value is deserialized using the [`JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) method.

Returns `undefined` or the given default value if the key is not found.

## **#has**(key: string): boolean
Returns a boolean value indicating whether the associated storage contains the specified key:

```js
import {LocalStorage} from '@cedx/webstorage';

function main() {
  const storage = new LocalStorage;
  console.log(storage.has('foo')); // false
    
  storage.set('foo', 'bar');
  console.log(storage.has('foo')); // true
}
```

## **#putIfAbsent**(key: string, ifAbsent: () => string): string
Looks up the value of the specified key, or add a new value if it isn't there.

Returns the value associated to the key, if there is one. Otherwise calls `ifAbsent` to get a new value, associates the key to that value, and then returns the new value:

```js
import {LocalStorage} from '@cedx/webstorage';

function main() {
  const storage = new LocalStorage;
  console.log(storage.has('foo')); // false

  let value = storage.putIfAbsent('foo', () => 'bar');
  console.log(storage.has('foo')); // true
  console.log(value); // "bar"

  value = storage.putIfAbsent('foo', () => 'qux');
  console.log(value); // "bar"
}
```

## **#putObjectIfAbsent**(key: string, ifAbsent: () => any): any
Looks up the value of the specified key, or add a new value if it isn't there.

Returns the deserialized value associated to the key, if there is one. Otherwise calls `ifAbsent` to get a new value, serializes and associates the key to that value, and then returns the new value:

```js
import {LocalStorage} from '@cedx/webstorage';

function main() {
  const storage = new LocalStorage;
  console.log(storage.has('foo')); // false

  let value = storage.putObjectIfAbsent('foo', () => 123);
  console.log(storage.has('foo')); // true
  console.log(value); // 123

  value = storage.putObjectIfAbsent('foo', () => 456);
  console.log(value); // 123
}
```

!!! info
    The value is serialized using the [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) method, and deserialized using the [`JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) method.

## **#remove**(key: string): string|undefined
Removes the value associated to the specified key:

```js
import {LocalStorage} from '@cedx/webstorage';

function main() {
  const storage = new LocalStorage;

  storage.set('foo', 'bar');
  console.log(storage.has('foo')); // true
    
  console.log(storage.remove('foo')); // "bar"
  console.log(storage.has('foo')); // false
}
```

Returns the value associated with the specified key before it was removed.

## **#set**(key: string, value: string): this
Associates a given value to the specified key:

```js
import {LocalStorage} from '@cedx/webstorage';

function main() {
  const storage = new LocalStorage;
  console.log(storage.get('foo')); // undefined
    
  storage.set('foo', 'bar');
  console.log(storage.get('foo')); // "bar"
}
```

## **#setObject**(key: string, value: any): this
Serializes and associates a given value to the specified key:

```js
import {LocalStorage} from '@cedx/webstorage';
  
function main() {
  const storage = new LocalStorage;
  console.log(storage.getObject('foo')); // undefined
    
  storage.setObject('foo', {bar: 'baz'});
  console.log(storage.getObject('foo')); // {bar: "baz"}
}
```

!!! info
    The value is serialized using the [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) method.
