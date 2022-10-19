/* eslint-disable max-lines-per-function */
import {expect} from "@esm-bundle/chai";
import {Storage, StorageEvent} from "../src/index.js";

/**
 * Tests the features of the {@link Storage} class.
 */
describe("Storage", () => {
	beforeEach(() => sessionStorage.clear());

	describe(".keys", () => {
		it("should return an empty array for an empty storage", () => {
			expect(Storage.session().keys).to.be.empty;
		});

		it("should return the list of keys for a non-empty storage", () => {
			sessionStorage.setItem("foo", "bar");
			sessionStorage.setItem("prefix:baz", "qux");
			expect(Storage.session().keys).to.have.ordered.members(["foo", "prefix:baz"]);
		});

		it("should handle the key prefix", () => {
			sessionStorage.setItem("foo", "bar");
			sessionStorage.setItem("prefix:baz", "qux");
			expect(Storage.session({keyPrefix: "prefix:"}).keys).to.have.members(["baz"]);
		});
	});

	describe(".length", () => {
		it("should return zero for an empty storage", () => {
			expect(Storage.session()).to.have.lengthOf(0);
		});

		it("should return the number of entries for a non-empty storage", () => {
			sessionStorage.setItem("foo", "bar");
			sessionStorage.setItem("prefix:baz", "qux");
			expect(Storage.session()).to.have.lengthOf(2);
		});

		it("should handle the key prefix", () => {
			sessionStorage.setItem("foo", "bar");
			sessionStorage.setItem("prefix:baz", "qux");
			expect(Storage.session({keyPrefix: "prefix:"})).to.have.lengthOf(1);
		});
	});

	describe(".[Symbol.iterator]()", () => {
		it("should end iteration immediately if the storage is empty", () => {
			const iterator = Storage.session()[Symbol.iterator]();
			expect(iterator.next().done).to.be.true;
		});

		it("should iterate over the values if the storage is not empty", () => {
			const iterator = Storage.session()[Symbol.iterator]();
			sessionStorage.setItem("foo", "bar");
			sessionStorage.setItem("prefix:baz", "qux");

			let next = iterator.next();
			expect(next.done).to.be.false;
			expect(next.value).to.have.ordered.members(["foo", "bar"]);
			next = iterator.next();
			expect(next.done).to.be.false;
			expect(next.value).to.have.ordered.members(["prefix:baz", "qux"]);
			expect(iterator.next().done).to.be.true;
		});

		it("should handle the key prefix", () => {
			const iterator = Storage.session({keyPrefix: "prefix:"})[Symbol.iterator]();
			sessionStorage.setItem("foo", "bar");
			sessionStorage.setItem("prefix:baz", "qux");

			const next = iterator.next();
			expect(next.done).to.be.false;
			expect(next.value).to.have.ordered.members(["baz", "qux"]);
			expect(iterator.next().done).to.be.true;
		});
	});

	describe(".clear()", () => {
		it("should remove all storage entries", () => {
			sessionStorage.setItem("foo", "bar");
			sessionStorage.setItem("prefix:baz", "qux");

			Storage.session().clear();
			expect(sessionStorage).to.have.lengthOf(0);
		});

		it("should handle the key prefix", () => {
			sessionStorage.setItem("foo", "bar");
			sessionStorage.setItem("prefix:baz", "qux");

			Storage.session({keyPrefix: "prefix:"}).clear();
			expect(sessionStorage).to.have.lengthOf(1);
		});
	});

	describe(".get()", () => {
		it("should properly get the storage entries", () => {
			const service = Storage.session();
			expect(service.get("foo")).to.be.null;

			sessionStorage.setItem("foo", "bar");
			expect(service.get("foo")).to.equal("bar");

			sessionStorage.setItem("foo", "123");
			expect(service.get("foo")).to.equal("123");

			sessionStorage.removeItem("foo");
			expect(service.get("foo")).to.be.null;
		});

		it("should handle the key prefix", () => {
			const service = Storage.session({keyPrefix: "prefix:"});
			expect(service.get("baz")).to.be.null;

			sessionStorage.setItem("prefix:baz", "qux");
			expect(service.get("baz")).to.equal("qux");

			sessionStorage.setItem("prefix:baz", "456");
			expect(service.get("baz")).to.equal("456");

			sessionStorage.removeItem("prefix:baz");
			expect(service.get("baz")).to.be.null;
		});
	});

	describe(".getObject()", () => {
		it("should properly get the deserialized storage entries", () => {
			const service = Storage.session();
			expect(service.getObject("foo")).to.be.null;

			sessionStorage.setItem("foo", '"bar"');
			expect(service.getObject("foo")).to.equal("bar");

			sessionStorage.setItem("foo", "123");
			expect(service.getObject("foo")).to.equal(123);

			sessionStorage.setItem("foo", '{"key": "value"}');
			expect(service.getObject("foo")).to.deep.equal({key: "value"});

			sessionStorage.setItem("foo", "{bar[123]}");
			expect(service.getObject("foo")).to.be.null;

			sessionStorage.removeItem("foo");
			expect(service.getObject("foo")).to.be.null;
		});

		it("should handle the key prefix", () => {
			const service = Storage.session({keyPrefix: "prefix:"});
			expect(service.getObject("baz")).to.be.null;

			sessionStorage.setItem("prefix:baz", '"qux"');
			expect(service.getObject("baz")).to.equal("qux");

			sessionStorage.setItem("prefix:baz", "456");
			expect(service.getObject("baz")).to.equal(456);

			sessionStorage.setItem("prefix:baz", '{"key": "value"}');
			expect(service.getObject("baz")).to.deep.equal({key: "value"});

			sessionStorage.setItem("prefix:baz", "{qux[456]}");
			expect(service.getObject("baz")).to.be.null;

			sessionStorage.removeItem("prefix:baz");
			expect(service.getObject("baz")).to.be.null;
		});
	});

	describe(".has()", () => {
		it("should return `false` if the specified key is not contained", () => {
			expect(Storage.session().has("foo")).to.be.false;
		});

		it("should return `true` if the specified key is contained", () => {
			sessionStorage.setItem("foo", "bar");
			sessionStorage.setItem("prefix:baz", "qux");

			const service = Storage.session();
			expect(service.has("foo:bar")).to.be.false;
			expect(service.has("foo")).to.be.true;
			expect(service.has("prefix:baz")).to.be.true;
		});

		it("should handle the key prefix", () => {
			sessionStorage.setItem("foo", "bar");
			sessionStorage.setItem("prefix:baz", "qux");

			const service = Storage.session({keyPrefix: "prefix:"});
			expect(service.has("foo")).to.be.false;
			expect(service.has("baz")).to.be.true;
		});
	});

	describe(".onChange()", () => {
		it("should trigger an event when a cookie is added", done => {
			const listener = (/** @type {StorageEvent} */ event) => {
				expect(event.key).to.equal("foo");
				expect(event.oldValue).to.be.null;
				expect(event.newValue).to.equal("bar");
			};

			const service = Storage.session();
			service.onChange(listener);
			service.set("foo", "bar").removeEventListener(StorageEvent.type, /** @type {EventListener} */ (listener));
			done();
		});

		it("should trigger an event when a cookie is updated", done => {
			sessionStorage.setItem("foo", "bar");
			const listener = (/** @type {StorageEvent} */ event) => {
				expect(event.key).to.equal("foo");
				expect(event.oldValue).to.equal("bar");
				expect(event.newValue).to.equal("baz");
			};

			const service = Storage.session();
			service.onChange(listener);
			service.set("foo", "baz").removeEventListener(StorageEvent.type, /** @type {EventListener} */ (listener));
			done();
		});

		it("should trigger an event when a cookie is removed", done => {
			sessionStorage.setItem("foo", "bar");
			const listener = (/** @type {StorageEvent} */ event) => {
				expect(event.key).to.equal("foo");
				expect(event.oldValue).to.equal("bar");
				expect(event.newValue).to.be.null;
			};

			const service = Storage.session();
			service.onChange(listener);
			service.remove("foo");
			service.removeEventListener(StorageEvent.type, /** @type {EventListener} */ (listener));
			done();
		});

		it("should handle the key prefix", done => {
			const listener = (/** @type {StorageEvent} */ event) => {
				expect(event.key).to.equal("baz");
				expect(event.oldValue).to.be.null;
				expect(event.newValue).to.equal("qux");
			};

			const service = Storage.local({keyPrefix: "prefix:"});
			service.onChange(listener);
			service.set("baz", "qux").removeEventListener(StorageEvent.type, /** @type {EventListener} */ (listener));
			done();
		});
	});

	describe(".putIfAbsent()", () => {
		it("should add a new entry if it does not exist", () => {
			const service = Storage.session();
			expect(sessionStorage.getItem("foo")).to.be.null;
			expect(service.putIfAbsent("foo", () => "bar")).to.equal("bar");
			expect(sessionStorage.getItem("foo")).to.equal("bar");
		});

		it("should not add a new entry if it already exists", () => {
			const service = Storage.session();
			sessionStorage.setItem("foo", "123");
			expect(service.putIfAbsent("foo", () => "XYZ")).to.equal("123");
			expect(sessionStorage.getItem("foo")).to.equal("123");
		});

		it("should handle the key prefix", () => {
			const service = Storage.session({keyPrefix: "prefix:"});
			expect(sessionStorage.getItem("prefix:baz")).to.be.null;
			expect(service.putIfAbsent("baz", () => "qux")).to.equal("qux");
			expect(sessionStorage.getItem("prefix:baz")).to.equal("qux");

			sessionStorage.setItem("prefix:baz", "456");
			expect(service.putIfAbsent("baz", () => "XYZ")).to.equal("456");
			expect(sessionStorage.getItem("prefix:baz")).to.equal("456");
		});
	});

	describe(".putObjectIfAbsent()", () => {
		it("should add a new entry if it does not exist", () => {
			const service = Storage.session();
			expect(sessionStorage.getItem("foo")).to.be.null;
			expect(service.putObjectIfAbsent("foo", () => "bar")).to.equal("bar");
			expect(sessionStorage.getItem("foo")).to.equal('"bar"');
		});

		it("should not add a new entry if it already exists", () => {
			const service = Storage.session();
			sessionStorage.setItem("foo", "123");
			expect(service.putObjectIfAbsent("foo", () => 999)).to.equal(123);
			expect(sessionStorage.getItem("foo")).to.equal("123");
		});

		it("should handle the key prefix", () => {
			const service = Storage.session({keyPrefix: "prefix:"});
			expect(sessionStorage.getItem("prefix:baz")).to.be.null;
			expect(service.putObjectIfAbsent("baz", () => "qux")).to.equal("qux");
			expect(sessionStorage.getItem("prefix:baz")).to.equal('"qux"');

			sessionStorage.setItem("prefix:baz", "456");
			expect(service.putObjectIfAbsent("baz", () => 999)).to.equal(456);
			expect(sessionStorage.getItem("prefix:baz")).to.equal("456");
		});
	});

	describe(".remove()", () => {
		it("should properly remove the storage entries", () => {
			sessionStorage.setItem("foo", "bar");
			sessionStorage.setItem("prefix:baz", "qux");

			Storage.session().remove("foo");
			expect(sessionStorage).to.have.lengthOf(1);
			expect(sessionStorage.getItem("foo")).to.be.null;
		});

		it("should handle the key prefix", () => {
			sessionStorage.setItem("foo", "bar");
			sessionStorage.setItem("prefix:baz", "qux");

			Storage.session({keyPrefix: "prefix:"}).remove("baz");
			expect(sessionStorage).to.have.lengthOf(1);
			expect(sessionStorage.getItem("prefix:baz")).to.be.null;
		});
	});

	describe(".set()", () => {
		it("should properly set the storage entries", () => {
			const service = Storage.session();
			expect(sessionStorage.getItem("foo")).to.be.null;

			service.set("foo", "bar");
			expect(sessionStorage.getItem("foo")).to.equal("bar");

			service.set("foo", "123");
			expect(sessionStorage.getItem("foo")).to.equal("123");
		});

		it("should handle the key prefix", () => {
			const service = Storage.session({keyPrefix: "prefix:"});
			expect(sessionStorage.getItem("prefix:baz")).to.be.null;

			service.set("baz", "qux");
			expect(sessionStorage.getItem("prefix:baz")).to.equal("qux");

			service.set("baz", "456");
			expect(sessionStorage.getItem("prefix:baz")).to.equal("456");
		});
	});

	describe(".setObject()", () => {
		it("should properly serialize and set the storage entries", () => {
			const service = Storage.session();
			expect(sessionStorage.getItem("foo")).to.be.null;

			service.setObject("foo", "bar");
			expect(sessionStorage.getItem("foo")).to.equal('"bar"');

			service.setObject("foo", 123);
			expect(sessionStorage.getItem("foo")).to.equal("123");

			service.setObject("foo", {key: "value"});
			expect(sessionStorage.getItem("foo")).to.equal('{"key":"value"}');
		});

		it("should handle the key prefix", () => {
			const service = Storage.session({keyPrefix: "prefix:"});
			expect(sessionStorage.getItem("prefix:baz")).to.be.null;

			service.setObject("baz", "qux");
			expect(sessionStorage.getItem("prefix:baz")).to.equal('"qux"');

			service.setObject("baz", 456);
			expect(sessionStorage.getItem("prefix:baz")).to.equal("456");

			service.setObject("baz", {key: "value"});
			expect(sessionStorage.getItem("prefix:baz")).to.equal('{"key":"value"}');
		});
	});

	describe(".toJSON()", () => {
		it("should return an empty array for an empty storage", () => {
			expect(JSON.stringify(Storage.session())).to.equal("[]");
		});

		it("should return a non-empty array for a non-empty storage", () => {
			sessionStorage.setItem("foo", "bar");
			sessionStorage.setItem("prefix:baz", "qux");

			const json = JSON.stringify(Storage.session());
			expect(json).to.include('["foo","bar"]');
			expect(json).to.include('["prefix:baz","qux"]');
		});

		it("should handle the key prefix", () => {
			sessionStorage.setItem("foo", "bar");
			sessionStorage.setItem("prefix:baz", "qux");

			const json = JSON.stringify(Storage.session({keyPrefix: "prefix:"}));
			expect(json).to.not.include('["foo","bar"]');
			expect(json).to.include('["baz","qux"]');
		});
	});
});
