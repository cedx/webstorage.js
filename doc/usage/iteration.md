# Iteration
The [`LocalStorage`](api.md) and [`SessionStorage`](api.md) classes are iterable: you can go through all key/value pairs contained using a `for...of` loop.
Each entry is an array with two elements (i.e. the key and the value):

```js
import {LocalStorage} from "@cedx/webstorage";

function main() {
	const storage = new LocalStorage;
	storage.set("foo", "bar");
	storage.set("anotherKey", "anotherValue");

	for (const entry of storage) {
		console.log(entry);
		// Round 1: ["foo", "bar"]
		// Round 2: ["anotherKey", "anotherValue"]
	}
}
```
