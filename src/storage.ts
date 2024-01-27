import {StorageEvent} from "./storage_event.js";

/**
 * Provides access to the [Web Storage](https://developer.mozilla.org/docs/Web/API/Web_Storage_API).
 */
export class Storage extends EventTarget {

	/**
	 * The underlying data store.
	 */
	readonly #backend: globalThis.Storage;

	/**
	 * A string prefixed to every key so that it is unique globally in the whole storage.
	 */
	readonly #keyPrefix: string;

	/**
	 * The function that listens for the global storage events.
	 */
	readonly #listener: ((event: globalThis.StorageEvent) => void)|null = null;

	/**
	 * Creates a new storage service.
	 * @param backend The underlying data store.
	 * @param options An object providing values to initialize this instance.
	 */
	private constructor(backend: globalThis.Storage, options: Partial<StorageOptions> = {}) {
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
	 * The keys of this storage.
	 */
	get keys(): string[] {
		const keys = Array.from(Array(this.#backend.length), (_, index) => this.#backend.key(index)!);
		return keys.filter(key => key.startsWith(this.#keyPrefix)).map(key => key.slice(this.#keyPrefix.length));
	}

	/**
	 * The number of entries in this storage.
	 */
	get length(): number {
		return this.#keyPrefix ? this.keys.length : this.#backend.length;
	}

	/**
	 * Creates a new local storage service.
	 * @param options An object providing values to initialize the service.
	 * @returns The newly created service.
	 */
	static local(options: Partial<StorageOptions> = {}): Storage {
		return new this(localStorage, options);
	}

	/**
	 * Creates a new session storage service.
	 * @param options An object providing values to initialize the service.
	 * @returns The newly created service.
	 */
	static session(options: Partial<StorageOptions> = {}): Storage {
		return new this(sessionStorage, options);
	}

	/**
	 * Returns a new iterator that allows iterating the entries of this storage.
	 * @returns An iterator for the entries of this storage.
	 */
	*[Symbol.iterator](): IterableIterator<[string, string]> {
		for (const key of this.keys) yield [key, this.get(key)!];
	}

	/**
	 * Removes all entries from this storage.
	 */
	clear(): void {
		if (this.#keyPrefix)
			for (const key of this.keys) this.remove(key);
		else {
			this.#backend.clear();
			this.dispatchEvent(new StorageEvent(null));
		}
	}

	/**
	 * Cancels the subscription to the global storage events.
	 */
	destroy(): void {
		if (this.#listener) removeEventListener("storage", this.#listener);
	}

	/**
	 * Gets the value associated to the specified key.
	 * @param key The storage key.
	 * @returns The storage value, or `null` if the key does not exist.
	 */
	get(key: string): string|null {
		return this.#backend.getItem(this.#buildKey(key));
	}

	/**
	 * Gets the deserialized value associated with the specified key.
	 * @param key The storage key.
	 * @returns The storage value, or `null` if the key does not exist or the value cannot be deserialized.
	 */
	getObject<T>(key: string): T|null {
		try { return JSON.parse(this.get(key) ?? ""); }
		catch { return null; }
	}

	/**
	 * Gets a value indicating whether this storage contains the specified key.
	 * @param key The storage key.
	 * @returns `true` if this storage contains the specified key, otherwise `false`.
	 */
	has(key: string): boolean {
		return this.get(key) != null;
	}

	/**
	 * Registers a function that will be invoked whenever the `change` event is triggered.
	 * @param listener The event handler to register.
	 * @event
	 */
	onChange(listener: (event: StorageEvent) => void): void {
		this.addEventListener(StorageEvent.type, listener as EventListener, {passive: true});
	}

	/**
	 * Looks up the value of the specified key, or add a new value if it isn't there.
	 * @param key The storage key.
	 * @param ifAbsent A function producing the new cookie value.
	 * @returns The value associated with the key.
	 */
	putIfAbsent(key: string, ifAbsent: () => string): string {
		if (!this.has(key)) this.set(key, ifAbsent());
		return this.get(key)!;
	}

	/**
	 * Looks up the deserialized value of the specified key, or add a new serialized value if it isn't there.
	 * @param key The storage key.
	 * @param ifAbsent A function producing the new cookie value.
	 * @returns The deserialized value associated with the key.
	 */
	putObjectIfAbsent<T>(key: string, ifAbsent: () => T): T {
		if (!this.has(key)) this.setObject(key, ifAbsent());
		return this.getObject(key)!;
	}

	/**
	 * Removes the value associated with the specified key.
	 * @param key The storage key.
	 * @returns The value associated with the key before it was removed.
	 */
	remove(key: string): string|null {
		const oldValue = this.get(key);
		this.#backend.removeItem(this.#buildKey(key));
		this.dispatchEvent(new StorageEvent(key, oldValue));
		return oldValue;
	}

	/**
	 * Associates a given value with the specified key.
	 * @param key The storage key.
	 * @param value The storage value.
	 * @returns This instance.
	 */
	set(key: string, value: string): this {
		const oldValue = this.get(key);
		this.#backend.setItem(this.#buildKey(key), value);
		this.dispatchEvent(new StorageEvent(key, oldValue, value));
		return this;
	}

	/**
	 * Serializes and associates a given `value` with the specified `key`.
	 * @param key The storage key.
	 * @param value The storage value.
	 * @returns This instance.
	 */
	setObject<T>(key: string, value: T): this {
		return this.set(key, JSON.stringify(value));
	}

	/**
	 * Returns a JSON representation of this object.
	 * @returns The JSON representation of this object.
	 */
	toJSON(): [string, string][] {
		return Array.from(this);
	}

	/**
	 * Builds a normalized storage key from the given key.
	 * @param key The original key.
	 * @returns The normalized storage key.
	 */
	#buildKey(key: string): string {
		return `${this.#keyPrefix}${key}`;
	}
}

/**
 * Defines the options of a {@link Storage} instance.
 */
export interface StorageOptions {

	/**
	 * A string prefixed to every key so that it is unique globally in the whole storage.
	 */
	keyPrefix: string;

	/**
	 * Value indicating whether to listen to the global storage events.
	 */
	listenToGlobalEvents: boolean;
}
