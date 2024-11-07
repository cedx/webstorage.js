import {Storage, StorageEvent} from "@cedx/webstorage"
import {assert} from "chai"

# Tests the features of the `Storage` class.
describe "Storage", ->
	{deepEqual, equal, include, isEmpty, isFalse, isNull, isTrue, lengthOf, notInclude, sameMembers, sameOrderedMembers} = assert
	beforeEach -> sessionStorage.clear()

	describe "keys", ->
		it "should return an empty array for an empty storage", ->
			isEmpty Storage.session().keys

		it "should return the list of keys for a non-empty storage", ->
			sessionStorage.setItem "foo", "bar"
			sessionStorage.setItem "prefix:baz", "qux"
			sameOrderedMembers Array.from(Storage.session().keys), ["foo", "prefix:baz"]

		it "should handle the key prefix", ->
			sessionStorage.setItem "foo", "bar"
			sessionStorage.setItem "prefix:baz", "qux"
			sameMembers Array.from(Storage.session(keyPrefix: "prefix:").keys), ["baz"]

	describe "length", ->
		it "should return zero for an empty storage", ->
			lengthOf Storage.session(), 0

		it "should return the number of entries for a non-empty storage", ->
			sessionStorage.setItem "foo", "bar"
			sessionStorage.setItem "prefix:baz", "qux"
			lengthOf Storage.session(), 2

		it "should handle the key prefix", ->
			sessionStorage.setItem "foo", "bar"
			sessionStorage.setItem "prefix:baz", "qux"
			lengthOf Storage.session(keyPrefix: "prefix:"), 1

	describe "[Symbol.iterator]()", ->
		it "should end iteration immediately if the storage is empty", ->
			iterator = Storage.session()[Symbol.iterator]()
			isTrue iterator.next().done

		it "should iterate over the values if the storage is not empty", ->
			iterator = Storage.session()[Symbol.iterator]()
			sessionStorage.setItem "foo", "bar"
			sessionStorage.setItem "prefix:baz", "qux"

			next = iterator.next()
			isFalse next.done
			sameOrderedMembers next.value, ["foo", "bar"]
			next = iterator.next()
			isFalse next.done
			sameOrderedMembers next.value, ["prefix:baz", "qux"]
			isTrue iterator.next().done

		it "should handle the key prefix", ->
			iterator = Storage.session(keyPrefix: "prefix:")[Symbol.iterator]()
			sessionStorage.setItem "foo", "bar"
			sessionStorage.setItem "prefix:baz", "qux"

			next = iterator.next()
			isFalse next.done
			sameOrderedMembers next.value, ["baz", "qux"]
			isTrue iterator.next().done

	describe "clear()", ->
		it "should remove all storage entries", ->
			sessionStorage.setItem "foo", "bar"
			sessionStorage.setItem "prefix:baz", "qux"

			Storage.session().clear()
			lengthOf sessionStorage, 0

		it "should handle the key prefix", ->
			sessionStorage.setItem "foo", "bar"
			sessionStorage.setItem "prefix:baz", "qux"

			Storage.session(keyPrefix: "prefix:").clear()
			lengthOf sessionStorage, 1

	describe "delete()", ->
		it "should properly remove the storage entries", ->
			sessionStorage.setItem "foo", "bar"
			sessionStorage.setItem "prefix:baz", "qux"

			Storage.session().delete "foo"
			lengthOf sessionStorage, 1
			isNull sessionStorage.getItem "foo"

		it "should handle the key prefix", ->
			sessionStorage.setItem "foo", "bar"
			sessionStorage.setItem "prefix:baz", "qux"

			Storage.session(keyPrefix: "prefix:").delete "baz"
			lengthOf sessionStorage, 1
			isNull sessionStorage.getItem "prefix:baz"

	describe "get()", ->
		it "should properly get the storage entries", ->
			service = Storage.session()
			isNull service.get "foo"

			sessionStorage.setItem "foo", "bar"
			equal service.get("foo"), "bar"

			sessionStorage.setItem "foo", "123"
			equal service.get("foo"), "123"

			sessionStorage.removeItem "foo"
			isNull service.get "foo"

		it "should handle the key prefix", ->
			service = Storage.session keyPrefix: "prefix:"
			isNull service.get "baz"

			sessionStorage.setItem "prefix:baz", "qux"
			equal service.get("baz"), "qux"

			sessionStorage.setItem "prefix:baz", "456"
			equal service.get("baz"), "456"

			sessionStorage.removeItem "prefix:baz"
			isNull service.get "baz"

	describe "getObject()", ->
		it "should properly get the deserialized storage entries", ->
			service = Storage.session()
			isNull service.getObject "foo"

			sessionStorage.setItem "foo", '"bar"'
			equal service.getObject("foo"), "bar"

			sessionStorage.setItem "foo", "123"
			equal service.getObject("foo"), 123

			sessionStorage.setItem "foo", '{"key": "value"}'
			deepEqual service.getObject("foo"), key: "value"

			sessionStorage.setItem "foo", "{bar[123]}"
			isNull service.getObject "foo"

			sessionStorage.removeItem "foo"
			isNull service.getObject "foo"

		it "should handle the key prefix", ->
			service = Storage.session keyPrefix: "prefix:"
			isNull service.getObject "baz"

			sessionStorage.setItem "prefix:baz", '"qux"'
			equal service.getObject("baz"), "qux"

			sessionStorage.setItem "prefix:baz", "456"
			equal service.getObject("baz"), 456

			sessionStorage.setItem "prefix:baz", '{"key": "value"}'
			deepEqual service.getObject("baz"), key: "value"

			sessionStorage.setItem "prefix:baz", "{qux[456]}"
			isNull service.getObject "baz"

			sessionStorage.removeItem "prefix:baz"
			isNull service.getObject "baz"

	describe "has()", ->
		it "should return `false` if the specified key is not contained", ->
			isFalse Storage.session().has "foo"

		it "should return `true` if the specified key is contained", ->
			sessionStorage.setItem "foo", "bar"
			sessionStorage.setItem "prefix:baz", "qux"

			service = Storage.session()
			isFalse service.has "foo:bar"
			isTrue service.has "foo"
			isTrue service.has "prefix:baz"

		it "should handle the key prefix", ->
			sessionStorage.setItem "foo", "bar"
			sessionStorage.setItem "prefix:baz", "qux"

			service = Storage.session keyPrefix: "prefix:"
			isFalse service.has "foo"
			isTrue service.has "baz"

	describe "onChange()", ->
		it "should trigger an event when an entry is added", (done) ->
			listener = (event) ->
				equal event.key, "foo"
				isNull event.oldValue
				equal event.newValue, "bar"

			service = Storage.session()
			service.onChange listener
			service.set("foo", "bar").removeEventListener StorageEvent.type, listener
			done()

		it "should trigger an event when an entry is updated", (done) ->
			sessionStorage.setItem "foo", "bar"
			listener = (event) ->
				equal event.key, "foo"
				equal event.oldValue, "bar"
				equal event.newValue, "baz"

			service = Storage.session()
			service.onChange listener
			service.set("foo", "baz").removeEventListener StorageEvent.type, listener
			done()

		it "should trigger an event when an entry is removed", (done) ->
			sessionStorage.setItem "foo", "bar"
			listener = (event) ->
				equal event.key, "foo"
				equal event.oldValue, "bar"
				isNull event.newValue

			service = Storage.session()
			service.onChange listener
			service.delete "foo"
			service.removeEventListener StorageEvent.type, listener
			done()

		it "should handle the key prefix", (done) ->
			listener = (event) ->
				equal event.key, "baz"
				isNull event.oldValue
				equal event.newValue, "qux"

			service = Storage.local keyPrefix: "prefix:"
			service.onChange listener
			service.set("baz", "qux").removeEventListener StorageEvent.type, listener
			done()

	describe "set()", ->
		it "should properly set the storage entries", ->
			service = Storage.session()
			isNull sessionStorage.getItem "foo"

			service.set "foo", "bar"
			equal sessionStorage.getItem("foo"), "bar"

			service.set "foo", "123"
			equal sessionStorage.getItem("foo"), "123"

		it "should handle the key prefix", ->
			service = Storage.session keyPrefix: "prefix:"
			isNull sessionStorage.getItem "prefix:baz"

			service.set "baz", "qux"
			equal sessionStorage.getItem("prefix:baz"), "qux"

			service.set "baz", "456"
			equal sessionStorage.getItem("prefix:baz"), "456"

	describe "setObject()", ->
		it "should properly serialize and set the storage entries", ->
			service = Storage.session()
			isNull sessionStorage.getItem "foo"

			service.setObject "foo", "bar"
			equal sessionStorage.getItem("foo"), '"bar"'

			service.setObject "foo", 123
			equal sessionStorage.getItem("foo"), "123"

			service.setObject "foo", key: "value"
			equal sessionStorage.getItem("foo"), '{"key":"value"}'

		it "should handle the key prefix", ->
			service = Storage.session keyPrefix: "prefix:"
			isNull sessionStorage.getItem "prefix:baz"

			service.setObject "baz", "qux"
			equal sessionStorage.getItem("prefix:baz"), '"qux"'

			service.setObject "baz", 456
			equal sessionStorage.getItem("prefix:baz"), "456"

			service.setObject "baz", key: "value"
			equal sessionStorage.getItem("prefix:baz"), '{"key":"value"}'

	describe "toJSON()", ->
		it "should return an empty array for an empty storage", ->
			equal JSON.stringify(Storage.session()), "[]"

		it "should return a non-empty array for a non-empty storage", ->
			sessionStorage.setItem "foo", "bar"
			sessionStorage.setItem "prefix:baz", "qux"

			json = JSON.stringify Storage.session()
			include json, '["foo","bar"]'
			include json, '["prefix:baz","qux"]'

		it "should handle the key prefix", ->
			sessionStorage.setItem "foo", "bar"
			sessionStorage.setItem "prefix:baz", "qux"

			json = JSON.stringify Storage.session keyPrefix: "prefix:"
			notInclude json, '["foo","bar"]'
			include json, '["baz","qux"]'
