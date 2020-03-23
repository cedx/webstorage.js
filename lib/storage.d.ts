import { JsonObject } from './json';
/** Provides access to the [Web Storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage). */
export declare abstract class WebStorage extends EventTarget implements Iterable<[string, string | undefined]> {
    #private;
    /**
     * An event that is triggered when a storage value is changed (added, modified, or removed).
     * @event changes
     */
    static readonly eventChanges: string;
    /**
     * Creates a new storage service.
     * @param backend The underlying data store.
     */
    protected constructor(backend: Storage);
    /** The keys of this storage. */
    get keys(): string[];
    /** The number of entries in this storage. */
    get length(): number;
    /**
     * Returns a new iterator that allows iterating the entries of this storage.
     * @return An iterator for the entries of this storage.
     */
    [Symbol.iterator](): IterableIterator<[string, string | undefined]>;
    /** Removes all entries from this storage. */
    clear(): void;
    /** Cancels the subscription to the storage events. */
    destroy(): void;
    /**
     * Gets the value associated to the specified key.
     * @param key The key to seek for.
     * @param defaultValue The value to return if the item does not exist.
     * @return The value of the storage item, or the default value if the item is not found.
     */
    get(key: string, defaultValue?: string): string | undefined;
    /**
     * Gets the deserialized value associated to the specified key.
     * @param key The key to seek for.
     * @param defaultValue The value to return if the item does not exist.
     * @return The deserialized value of the storage item, or the default value if the item is not found.
     */
    getObject(key: string, defaultValue?: any): any;
    /**
     * Gets a value indicating whether this storage contains the specified key.
     * @param key The key to seek for.
     * @return `true` if this storage contains the specified key, otherwise `false`.
     */
    has(key: string): boolean;
    /**
     * Looks up the value of the specified key, or add a new value if it isn't there.
     *
     * Returns the value associated to `key`, if there is one. Otherwise calls `ifAbsent` to get a new value,
     * associates `key` to that value, and then returns the new value.
     *
     * @param key The key to seek for.
     * @param ifAbsent The function called to get a new value.
     * @return The value associated with the specified key.
     */
    putIfAbsent(key: string, ifAbsent: () => string): string;
    /**
     * Looks up the value of the specified key, or add a new value if it isn't there.
     *
     * Returns the deserialized value associated to `key`, if there is one. Otherwise calls `ifAbsent` to get a new value,
     * serializes and associates `key` to that value, and then returns the new value.
     *
     * @param key The key to seek for.
     * @param ifAbsent The function called to get a new value.
     * @return The deserialized value associated with the specified key.
     */
    putObjectIfAbsent(key: string, ifAbsent: () => any): any;
    /**
     * Removes the value associated to the specified key.
     * @param key The key to seek for.
     * @return The value associated with the specified key before it was removed.
     */
    remove(key: string): string | undefined;
    /**
     * Associates a given value to the specified key.
     * @param key The key to seek for.
     * @param value The item value.
     * @return This instance.
     */
    set(key: string, value: string): this;
    /**
     * Serializes and associates a given value to the specified key.
     * @param key The key to seek for.
     * @param value The item value.
     * @return This instance.
     */
    setObject(key: string, value: any): this;
    /**
     * Converts this object to a map in JSON format.
     * @return The map in JSON format corresponding to this object.
     */
    toJSON(): JsonObject;
}
/** Provides access to the local storage. */
export declare class LocalStorage extends WebStorage {
    /** Creates a new storage service. */
    constructor();
}
/** Provides access to the session storage. */
export declare class SessionStorage extends WebStorage {
    /** Creates a new storage service. */
    constructor();
}
