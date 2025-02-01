/* eslint-disable max-lines-per-function */
import {Storage, StorageEvent} from "@cedx/webstorage";
import {assert} from "chai";

/**
 * Tests the features of the {@link Storage} class.
 */
describe("Storage", () => {
	// eslint-disable-next-line @typescript-eslint/unbound-method
	const {deepEqual, equal, include, isEmpty, lengthOf, notInclude, sameMembers, sameOrderedMembers} = assert;
	beforeEach(() => sessionStorage.clear());

	describe("keys", () => {
		it("should return an empty array for an empty storage", () =>
			isEmpty(Storage.session().keys));

		it("should return the list of keys for a non-empty storage", () => {
			sessionStorage.setItem("foo", "bar");
			sessionStorage.setItem("prefix:baz", "qux");
			sameOrderedMembers(Array.from(Storage.session().keys), ["foo", "prefix:baz"]);
		});

		it("should handle the key prefix", () => {
			sessionStorage.setItem("foo", "bar");
			sessionStorage.setItem("prefix:baz", "qux");
			sameMembers(Array.from(Storage.session({keyPrefix: "prefix:"}).keys), ["baz"]);
		});
	});

	describe("length", () => {
		it("should return zero for an empty storage", () =>
			lengthOf(Storage.session(), 0));

		it("should return the number of entries for a non-empty storage", () => {
			sessionStorage.setItem("foo", "bar");
			sessionStorage.setItem("prefix:baz", "qux");
			lengthOf(Storage.session(), 2);
		});

		it("should handle the key prefix", () => {
			sessionStorage.setItem("foo", "bar");
			sessionStorage.setItem("prefix:baz", "qux");
			lengthOf(Storage.session({keyPrefix: "prefix:"}), 1);
		});
	});

	describe("[Symbol.iterator]()", () => {
		it("should end iteration immediately if the storage is empty", () => {
			const iterator = Storage.session()[Symbol.iterator]();
			assert.isTrue(iterator.next().done);
		});

		it("should iterate over the values if the storage is not empty", () => {
			const iterator = Storage.session()[Symbol.iterator]();
			sessionStorage.setItem("foo", "bar");
			sessionStorage.setItem("prefix:baz", "qux");

			let next = iterator.next();
			assert.isFalse(next.done);
			sameOrderedMembers(next.value, ["foo", "bar"]);
			next = iterator.next();
			assert.isFalse(next.done);
			sameOrderedMembers(next.value, ["prefix:baz", "qux"]);
			assert.isTrue(iterator.next().done);
		});

		it("should handle the key prefix", () => {
			const iterator = Storage.session({keyPrefix: "prefix:"})[Symbol.iterator]();
			sessionStorage.setItem("foo", "bar");
			sessionStorage.setItem("prefix:baz", "qux");

			const next = iterator.next();
			assert.isFalse(next.done);
			sameOrderedMembers(next.value, ["baz", "qux"]);
			assert.isTrue(iterator.next().done);
		});
	});

	describe("clear()", () => {
		it("should remove all storage entries", () => {
			sessionStorage.setItem("foo", "bar");
			sessionStorage.setItem("prefix:baz", "qux");

			Storage.session().clear();
			lengthOf(sessionStorage, 0);
		});

		it("should handle the key prefix", () => {
			sessionStorage.setItem("foo", "bar");
			sessionStorage.setItem("prefix:baz", "qux");

			Storage.session({keyPrefix: "prefix:"}).clear();
			lengthOf(sessionStorage, 1);
		});
	});

	describe("delete()", () => {
		it("should properly remove the storage entries", () => {
			sessionStorage.setItem("foo", "bar");
			sessionStorage.setItem("prefix:baz", "qux");

			Storage.session().delete("foo");
			lengthOf(sessionStorage, 1);
			assert.isNull(sessionStorage.getItem("foo"));
		});

		it("should handle the key prefix", () => {
			sessionStorage.setItem("foo", "bar");
			sessionStorage.setItem("prefix:baz", "qux");

			Storage.session({keyPrefix: "prefix:"}).delete("baz");
			lengthOf(sessionStorage, 1);
			assert.isNull(sessionStorage.getItem("prefix:baz"));
		});
	});

	describe("get()", () => {
		it("should properly get the storage entries", () => {
			const service = Storage.session();
			assert.isNull(service.get("foo"));

			sessionStorage.setItem("foo", "bar");
			equal(service.get("foo"), "bar");

			sessionStorage.setItem("foo", "123");
			equal(service.get("foo"), "123");

			sessionStorage.removeItem("foo");
			assert.isNull(service.get("foo"));
		});

		it("should handle the key prefix", () => {
			const service = Storage.session({keyPrefix: "prefix:"});
			assert.isNull(service.get("baz"));

			sessionStorage.setItem("prefix:baz", "qux");
			equal(service.get("baz"), "qux");

			sessionStorage.setItem("prefix:baz", "456");
			equal(service.get("baz"), "456");

			sessionStorage.removeItem("prefix:baz");
			assert.isNull(service.get("baz"));
		});
	});

	describe("getObject()", () => {
		it("should properly get the deserialized storage entries", () => {
			const service = Storage.session();
			assert.isNull(service.getObject("foo"));

			sessionStorage.setItem("foo", '"bar"');
			equal(service.getObject("foo"), "bar");

			sessionStorage.setItem("foo", "123");
			equal(service.getObject("foo"), 123);

			sessionStorage.setItem("foo", '{"key": "value"}');
			deepEqual(service.getObject("foo"), {key: "value"});

			sessionStorage.setItem("foo", "{bar[123]}");
			assert.isNull(service.getObject("foo"));

			sessionStorage.removeItem("foo");
			assert.isNull(service.getObject("foo"));
		});

		it("should handle the key prefix", () => {
			const service = Storage.session({keyPrefix: "prefix:"});
			assert.isNull(service.getObject("baz"));

			sessionStorage.setItem("prefix:baz", '"qux"');
			equal(service.getObject("baz"), "qux");

			sessionStorage.setItem("prefix:baz", "456");
			equal(service.getObject("baz"), 456);

			sessionStorage.setItem("prefix:baz", '{"key": "value"}');
			deepEqual(service.getObject("baz"), {key: "value"});

			sessionStorage.setItem("prefix:baz", "{qux[456]}");
			assert.isNull(service.getObject("baz"));

			sessionStorage.removeItem("prefix:baz");
			assert.isNull(service.getObject("baz"));
		});
	});

	describe("has()", () => {
		it("should return `false` if the specified key is not contained", () =>
			assert.isFalse(Storage.session().has("foo")));

		it("should return `true` if the specified key is contained", () => {
			sessionStorage.setItem("foo", "bar");
			sessionStorage.setItem("prefix:baz", "qux");

			const service = Storage.session();
			assert.isFalse(service.has("foo:bar"));
			assert.isTrue(service.has("foo"));
			assert.isTrue(service.has("prefix:baz"));
		});

		it("should handle the key prefix", () => {
			sessionStorage.setItem("foo", "bar");
			sessionStorage.setItem("prefix:baz", "qux");

			const service = Storage.session({keyPrefix: "prefix:"});
			assert.isFalse(service.has("foo"));
			assert.isTrue(service.has("baz"));
		});
	});

	describe("onChange()", () => {
		it("should trigger an event when a cookie is added", done => {
			const listener = (/** @type {StorageEvent} */ event) => {
				equal(event.key, "foo");
				assert.isNull(event.oldValue);
				equal(event.newValue, "bar");
			};

			const service = Storage.session();
			service.onChange(listener);
			service.set("foo", "bar").removeEventListener(StorageEvent.type, /** @type {EventListener} */ (listener));
			done();
		});

		it("should trigger an event when a cookie is updated", done => {
			sessionStorage.setItem("foo", "bar");
			const listener = (/** @type {StorageEvent} */ event) => {
				equal(event.key, "foo");
				equal(event.oldValue, "bar");
				equal(event.newValue, "baz");
			};

			const service = Storage.session();
			service.onChange(listener);
			service.set("foo", "baz").removeEventListener(StorageEvent.type, /** @type {EventListener} */ (listener));
			done();
		});

		it("should trigger an event when a cookie is removed", done => {
			sessionStorage.setItem("foo", "bar");
			const listener = (/** @type {StorageEvent} */ event) => {
				equal(event.key, "foo");
				equal(event.oldValue, "bar");
				assert.isNull(event.newValue);
			};

			const service = Storage.session();
			service.onChange(listener);
			service.delete("foo");
			service.removeEventListener(StorageEvent.type, /** @type {EventListener} */ (listener));
			done();
		});

		it("should handle the key prefix", done => {
			const listener = (/** @type {StorageEvent} */ event) => {
				equal(event.key, "baz");
				assert.isNull(event.oldValue);
				equal(event.newValue, "qux");
			};

			const service = Storage.local({keyPrefix: "prefix:"});
			service.onChange(listener);
			service.set("baz", "qux").removeEventListener(StorageEvent.type, /** @type {EventListener} */ (listener));
			done();
		});
	});

	describe("set()", () => {
		it("should properly set the storage entries", () => {
			const service = Storage.session();
			assert.isNull(sessionStorage.getItem("foo"));

			service.set("foo", "bar");
			equal(sessionStorage.getItem("foo"), "bar");

			service.set("foo", "123");
			equal(sessionStorage.getItem("foo"), "123");
		});

		it("should handle the key prefix", () => {
			const service = Storage.session({keyPrefix: "prefix:"});
			assert.isNull(sessionStorage.getItem("prefix:baz"));

			service.set("baz", "qux");
			equal(sessionStorage.getItem("prefix:baz"), "qux");

			service.set("baz", "456");
			equal(sessionStorage.getItem("prefix:baz"), "456");
		});
	});

	describe("setObject()", () => {
		it("should properly serialize and set the storage entries", () => {
			const service = Storage.session();
			assert.isNull(sessionStorage.getItem("foo"));

			service.setObject("foo", "bar");
			equal(sessionStorage.getItem("foo"), '"bar"');

			service.setObject("foo", 123);
			equal(sessionStorage.getItem("foo"), "123");

			service.setObject("foo", {key: "value"});
			equal(sessionStorage.getItem("foo"), '{"key":"value"}');
		});

		it("should handle the key prefix", () => {
			const service = Storage.session({keyPrefix: "prefix:"});
			assert.isNull(sessionStorage.getItem("prefix:baz"));

			service.setObject("baz", "qux");
			equal(sessionStorage.getItem("prefix:baz"), '"qux"');

			service.setObject("baz", 456);
			equal(sessionStorage.getItem("prefix:baz"), "456");

			service.setObject("baz", {key: "value"});
			equal(sessionStorage.getItem("prefix:baz"), '{"key":"value"}');
		});
	});

	describe("toJSON()", () => {
		it("should return an empty array for an empty storage", () => {
			equal(JSON.stringify(Storage.session()), "[]");
		});

		it("should return a non-empty array for a non-empty storage", () => {
			sessionStorage.setItem("foo", "bar");
			sessionStorage.setItem("prefix:baz", "qux");

			const json = JSON.stringify(Storage.session());
			include(json, '["foo","bar"]');
			include(json, '["prefix:baz","qux"]');
		});

		it("should handle the key prefix", () => {
			sessionStorage.setItem("foo", "bar");
			sessionStorage.setItem("prefix:baz", "qux");

			const json = JSON.stringify(Storage.session({keyPrefix: "prefix:"}));
			notInclude(json, '["foo","bar"]');
			include(json, '["baz","qux"]');
		});
	});
});
