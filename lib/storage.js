import { SimpleChange } from './simple_change.js';
/** Provides access to the [Web Storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage). */
export class WebStorage extends EventTarget {
    /**
     * Creates a new storage service.
     * @param _backend The underlying data store.
     */
    constructor(_backend) {
        super();
        this._backend = _backend;
        this._listener = event => {
            var _a, _b;
            if (event.key == null || event.storageArea != _backend)
                return;
            const change = new SimpleChange((_a = event.oldValue, (_a !== null && _a !== void 0 ? _a : undefined)), (_b = event.newValue, (_b !== null && _b !== void 0 ? _b : undefined)));
            this.dispatchEvent(new CustomEvent(WebStorage.eventChanges, { detail: new Map([[event.key, change]]) }));
        };
        addEventListener('storage', this._listener);
    }
    /** The keys of this storage. */
    get keys() {
        const keys = [];
        for (let i = 0; true; i++) { // eslint-disable-line no-constant-condition
            const key = this._backend.key(i);
            if (key == null)
                return keys;
            keys.push(key);
        }
    }
    /** The number of entries in this storage. */
    get length() {
        return this._backend.length;
    }
    /**
     * Returns a new iterator that allows iterating the entries of this storage.
     * @return An iterator for the entries of this storage.
     */
    *[Symbol.iterator]() {
        for (const key of this.keys)
            yield [key, this.get(key)];
    }
    /** Removes all entries from this storage. */
    clear() {
        const changes = new Map();
        for (const [key, value] of this)
            changes.set(key, new SimpleChange(value));
        this._backend.clear();
        this.dispatchEvent(new CustomEvent(WebStorage.eventChanges, { detail: changes }));
    }
    /** Cancels the subscription to the storage events. */
    destroy() {
        removeEventListener('storage', this._listener);
    }
    /**
     * Gets the value associated to the specified key.
     * @param key The key to seek for.
     * @param defaultValue The value to return if the item does not exist.
     * @return The value of the storage item, or the default value if the item is not found.
     */
    get(key, defaultValue) {
        var _a;
        return _a = this._backend.getItem(key), (_a !== null && _a !== void 0 ? _a : defaultValue);
    }
    /**
     * Gets the deserialized value associated to the specified key.
     * @param key The key to seek for.
     * @param defaultValue The value to return if the item does not exist.
     * @return The deserialized value of the storage item, or the default value if the item is not found.
     */
    getObject(key, defaultValue) {
        try {
            const value = this.get(key);
            return value != undefined ? JSON.parse(value) : defaultValue;
        }
        catch (err) {
            return defaultValue;
        }
    }
    /**
     * Gets a value indicating whether this storage contains the specified key.
     * @param key The key to seek for.
     * @return `true` if this storage contains the specified key, otherwise `false`.
     */
    has(key) {
        return this.keys.includes(key);
    }
    /**
     * Removes the value associated to the specified key.
     * @param key The key to seek for.
     * @return The value associated with the specified key before it was removed.
     */
    remove(key) {
        const previousValue = this.get(key);
        this._backend.removeItem(key);
        this.dispatchEvent(new CustomEvent(WebStorage.eventChanges, { detail: new Map([
                [key, new SimpleChange(previousValue)]
            ]) }));
        return previousValue;
    }
    /**
     * Associates a given value to the specified key.
     * @param key The key to seek for.
     * @param value The item value.
     * @return This instance.
     */
    set(key, value) {
        const previousValue = this.get(key);
        this._backend.setItem(key, value);
        this.dispatchEvent(new CustomEvent(WebStorage.eventChanges, { detail: new Map([
                [key, new SimpleChange(previousValue, value)]
            ]) }));
        return this;
    }
    /**
     * Serializes and associates a given value to the specified key.
     * @param key The key to seek for.
     * @param value The item value.
     * @return This instance.
     */
    setObject(key, value) {
        return this.set(key, JSON.stringify(value));
    }
    /**
     * Converts this object to a map in JSON format.
     * @return The map in JSON format corresponding to this object.
     */
    toJSON() {
        const map = {};
        for (const [key, value] of this)
            map[key] = (value !== null && value !== void 0 ? value : null);
        return map;
    }
}
/**
 * An event that is triggered when a storage value is changed (added, modified, or removed).
 * @event changes
 */
WebStorage.eventChanges = 'changes';
/** Provides access to the local storage. */
export class LocalStorage extends WebStorage {
    /** Creates a new storage service. */
    constructor() {
        super(localStorage);
    }
}
/** Provides access to the session storage. */
export class SessionStorage extends WebStorage {
    /** Creates a new storage service. */
    constructor() {
        super(sessionStorage);
    }
}
