import {StorageEvent} from "./storage_event.js";

/**
 * Provides access to the [Web Storage](https://developer.mozilla.org/docs/Web/API/Web_Storage_API).
 */
export class Storage extends EventTarget {

	/**
	 * The keys of this storage.
	 */
	readonly keys: Set<string>;

	/**
	 * The number of entries in this storage.
	 */
	readonly length: number;

	/**
	 * Creates a new storage service.
	 */
	private constructor();

	/**
	 * Creates a new local storage service.
	 * @param options An object providing values to initialize the service.
	 * @returns The newly created service.
	 */
	static local(options?: StorageOptions): Storage;

	/**
	 * Creates a new session storage service.
	 * @param options An object providing values to initialize the service.
	 * @returns The newly created service.
	 */
	static session(options?: StorageOptions): Storage;

	/**
	 * Returns a new iterator that allows iterating the entries of this storage.
	 * @returns An iterator for the entries of this storage.
	 */
	[Symbol.iterator](): IterableIterator<[string, string]>;

	/**
	 * Removes all entries from this storage.
	 */
	clear(): void;

	/**
	 * Removes the value associated with the specified key.
	 * @param key The storage key.
	 * @returns The value associated with the key before it was removed.
	 */
	delete(key: string): string|null;

	/**
	 * Cancels the subscription to the global storage events.
	 */
	destroy(): void;

	/**
	 * Gets the value associated to the specified key.
	 * @param key The storage key.
	 * @returns The storage value, or `null` if the key does not exist.
	 */
	get(key: string): string|null;

	/**
	 * Gets the deserialized value associated with the specified key.
	 * @param key The storage key.
	 * @returns The storage value, or `null` if the key does not exist or the value cannot be deserialized.
	 */
	getObject<T>(key: string): T|null;

	/**
	 * Handles the events.
	 * @param event The dispatched event.
	 */
	handleEvent(event: globalThis.StorageEvent): void;

	/**
	 * Gets a value indicating whether this storage contains the specified key.
	 * @param key The storage key.
	 * @returns `true` if this storage contains the specified key, otherwise `false`.
	 */
	has(key: string): boolean;

	/**
	 * Registers a function that will be invoked whenever the `change` event is triggered.
	 * @param listener The event handler to register.
	 * @returns This instance.
	 */
	onChange(listener: (event: StorageEvent) => void): this;

	/**
	 * Associates a given value with the specified key.
	 * @param key The storage key.
	 * @param value The storage value.
	 * @returns This instance.
	 */
	set(key: string, value: string): this;

	/**
	 * Serializes and associates a given `value` with the specified `key`.
	 * @param key The storage key.
	 * @param value The storage value.
	 * @returns This instance.
	 */
	setObject(key: string, value: unknown): this;

	/**
	 * Returns a JSON representation of this object.
	 * @returns The JSON representation of this object.
	 */
	toJSON(): Array<[string, string]>;
}

/**
 * Defines the options of a {@link Storage} instance.
 */
export type StorageOptions = Partial<{

	/**
	 * A string prefixed to every key so that it is unique globally in the whole storage.
	 */
	keyPrefix: string;

	/**
	 * Value indicating whether to listen to the global storage events.
	 */
	listenToGlobalEvents: boolean;
}>;
