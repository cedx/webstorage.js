import {StorageEvent} from "./storage_event.js";

/**
 * Provides access to the [Web Storage](https://developer.mozilla.org/docs/Web/API/Web_Storage_API).
 */
export class Storage extends EventTarget {

	/**
	 * The underlying data store.
	 * @type {globalThis.Storage}
	 * @readonly
	 */
	#backend;

	/**
	 * A string prefixed to every key so that it is unique globally in the whole storage.
	 * @type {string}
	 */
	#keyPrefix;

	/**
	 * The function that listens for the global storage events.
	 * @type {((event: globalThis.StorageEvent) => void)|null}
	 */
	#listener = null;

	/**
	 * Creates a new storage service.
	 * @param {globalThis.Storage} backend The underlying data store.
	 * @param {StorageOptions} [options] An object providing values to initialize this instance.
	 * @protected
	 */
	constructor(backend, options = {}) {
		super();
		this.#backend = backend;
		this.#keyPrefix = options.keyPrefix ?? "";

		if (options.listenToGlobalEvents) {
			this.#listener = event => {
				if (event.storageArea == this.#backend && (event.key == null || event.key.startsWith(this.#keyPrefix)))
					this.dispatchEvent(new StorageEvent(event.key?.slice(this.#keyPrefix.length) ?? null, event.oldValue, event.newValue));
			};

			addEventListener("storage", this.#listener);
		}
	}

	/**
	 * Creates a new local storage service.
	 * @param {StorageOptions} [options] An object providing values to initialize the service.
	 * @returns {Storage} The newly created service.
	 */
	static local(options = {}) {
		return new this(localStorage, options);
	}

	/**
	 * Creates a new session storage service.
	 * @param {StorageOptions} [options] An object providing values to initialize the service.
	 * @returns {Storage} The newly created service.
	 */
	static session(options = {}) {
		return new this(sessionStorage, options);
	}

	/**
	 * The keys of this storage.
	 * @type {string[]}
	 */
	get keys() {
		const keys = /** @type {string[]} */ (Array.from(Array(this.#backend.length), (_, index) => this.#backend.key(index)));
		return keys.filter(key => key.startsWith(this.#keyPrefix)).map(key => key.slice(this.#keyPrefix.length));
	}

	/**
	 * The number of entries in this storage.
	 * @type {number}
	 */
	get length() {
		return this.#keyPrefix ? this.keys.length : this.#backend.length;
	}

	/**
	 * Returns a new iterator that allows iterating the entries of this storage.
	 * @returns {IterableIterator<[string, string]>} An iterator for the entries of this storage.
	 */
	*[Symbol.iterator]() {
		for (const key of this.keys) yield [key, /** @type {string} */ (this.get(key))];
	}

	/**
	 * Removes all entries from this storage.
	 */
	clear() {
		if (this.#keyPrefix) this.keys.forEach(key => this.remove(key));
		else {
			this.#backend.clear();
			this.dispatchEvent(new StorageEvent(null));
		}
	}

	/**
	 * Cancels the subscription to the global storage events.
	 */
	destroy() {
		if (this.#listener) removeEventListener("storage", this.#listener);
	}

	/**
	 * Gets the value associated to the specified key.
	 * @param {string} key The storage key.
	 * @returns {string|null} The storage value, or `null` if the key does not exist.
	 */
	get(key) {
		return this.#backend.getItem(this.#buildKey(key));
	}

	/**
	 * Gets the deserialized value associated with the specified key.
	 * @template T
	 * @param {string} key The storage key.
	 * @returns {T|null} The storage value, or `null` if the key does not exist or the value cannot be deserialized.
	 */
	getObject(key) {
		try { return JSON.parse(this.get(key) ?? ""); }
		catch { return null; }
	}

	/**
	 * Gets a value indicating whether this storage contains the specified key.
	 * @param {string} key The storage key.
	 * @returns {boolean} `true` if this storage contains the specified key, otherwise `false`.
	 */
	has(key) {
		return this.get(key) != null;
	}

	/**
	 * Registers a function that will be invoked whenever the `change` event is triggered.
	 * @param {(event: StorageEvent) => void} listener The event handler to register.
	 */
	onChange(listener) {
		this.addEventListener(StorageEvent.type, /** @type {EventListener} */ (listener), {passive: true});
	}

	/**
	 * Looks up the value of the specified key, or add a new value if it isn't there.
	 * @param {string} key The storage key.
	 * @param {() => string} ifAbsent A function producing the new cookie value.
	 * @returns {string} The value associated with the key.
	 */
	putIfAbsent(key, ifAbsent) {
		if (!this.has(key)) this.set(key, ifAbsent());
		return /** @type {string} */ (this.get(key));
	}

	/**
	 * Looks up the deserialized value of the specified key, or add a new serialized value if it isn't there.
	 * @template T
	 * @param {string} key The storage key.
	 * @param {() => T} ifAbsent A function producing the new cookie value.
	 * @returns {T} The deserialized value associated with the key.
	 */
	putObjectIfAbsent(key, ifAbsent) {
		if (!this.has(key)) this.setObject(key, ifAbsent());
		return /** @type {T} */ (this.getObject(key));
	}

	/**
	 * Removes the value associated with the specified key.
	 * @param {string} key The storage key.
	 * @returns {string|null} The value associated with the key before it was removed.
	 */
	remove(key) {
		const oldValue = this.get(key);
		this.#backend.removeItem(this.#buildKey(key));
		this.dispatchEvent(new StorageEvent(key, oldValue));
		return oldValue;
	}

	/**
	 * Associates a given value with the specified key.
	 * @param {string} key The storage key.
	 * @param {string} value The storage value.
	 * @returns {this} This instance.
	 */
	set(key, value) {
		const oldValue = this.get(key);
		this.#backend.setItem(this.#buildKey(key), value);
		this.dispatchEvent(new StorageEvent(key, oldValue, value));
		return this;
	}

	/**
	 * Serializes and associates a given `value` with the specified `key`.
	 * @template T
	 * @param {string} key The storage key.
	 * @param {T} value The storage value.
	 * @returns {this} This instance.
	 */
	setObject(key, value) {
		return this.set(key, JSON.stringify(value));
	}

	/**
	 * Returns a JSON representation of this object.
	 * @returns {Array<[string, string]>} The JSON representation of this object.
	 */
	toJSON() {
		return [...this];
	}

	/**
	 * Builds a normalized storage key from the given key.
	 * @param {string} key The original key.
	 * @returns {string} The normalized storage key.
	 */
	#buildKey(key) {
		return `${this.#keyPrefix}${key}`;
	}
}

/**
 * Defines the options of a {@link Storage} instance.
 * @typedef {object} StorageOptions
 * @property {string} [keyPrefix] A string prefixed to every key so that it is unique globally in the whole storage.
 * @property {boolean} [listenToGlobalEvents] Value indicating whether to listen to the global storage events.
 */
