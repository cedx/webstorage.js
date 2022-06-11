/* eslint-disable curly, lines-around-comment */
import {Storage} from "@cedx/webstorage";

// Loop over all entries of the storage.
const localStorage = Storage.local()
	.set("foo", "bar")
	.set("bar", "baz")
	.set("baz", "qux");

for (const [key, value] of localStorage) {
	console.log(`${key} => ${value}`);
	// Round 1: "foo => bar"
	// Round 2: "bar => baz"
	// Round 3: "baz => qux"
}

localStorage.clear();

// Loop over entries of the storage that use the same key prefix.
localStorage
	.set("foo", "bar")
	.set("prefix:bar", "baz");

const prefixedLocalStorage = Storage.local({keyPrefix: "prefix:"})
	.set("baz", "qux");

for (const [key, value] of prefixedLocalStorage) {
	console.log(`${key} => ${value}`);
	// Round 1: "bar => baz"
	// Round 2: "baz => qux"
}
