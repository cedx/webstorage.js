var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
import { SimpleChange } from './simple_change.js';
/** Provides access to the [Web Storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage). */
let WebStorage = /** @class */ (() => {
    var _backend, _listener;
    class WebStorage extends EventTarget {
        /**
         * Creates a new storage service.
         * @param backend The underlying data store.
         * @param options An object specifying values used to initialize this instance.
         */
        constructor(backend, options = {}) {
            super();
            /** The underlying data store. */
            _backend.set(this, void 0);
            /** The function that listens for storage events. */
            _listener.set(this, void 0);
            __classPrivateFieldSet(this, _backend, backend);
            if (options.listenToStorageEvents) {
                __classPrivateFieldSet(this, _listener, event => {
                    var _a, _b;
                    if (event.key == null || event.storageArea != __classPrivateFieldGet(this, _backend))
                        return;
                    const change = new SimpleChange((_a = event.oldValue) !== null && _a !== void 0 ? _a : undefined, (_b = event.newValue) !== null && _b !== void 0 ? _b : undefined);
                    this.dispatchEvent(new CustomEvent(WebStorage.eventChanges, { detail: new Map([[event.key, change]]) }));
                });
                addEventListener('storage', __classPrivateFieldGet(this, _listener));
            }
        }
        /** The keys of this storage. */
        get keys() {
            const keys = [];
            for (let i = 0;; i++) { // eslint-disable-line no-constant-condition
                const key = __classPrivateFieldGet(this, _backend).key(i);
                if (key == null)
                    return keys;
                keys.push(key);
            }
        }
        /** The number of entries in this storage. */
        get length() {
            return __classPrivateFieldGet(this, _backend).length;
        }
        /**
         * Returns a new iterator that allows iterating the entries of this storage.
         * @return An iterator for the entries of this storage.
         */
        *[(_backend = new WeakMap(), _listener = new WeakMap(), Symbol.iterator)]() {
            for (const key of this.keys)
                yield [key, this.get(key)];
        }
        /** Removes all entries from this storage. */
        clear() {
            const changes = new Map();
            for (const [key, value] of this)
                changes.set(key, new SimpleChange(value));
            __classPrivateFieldGet(this, _backend).clear();
            this.dispatchEvent(new CustomEvent(WebStorage.eventChanges, { detail: changes }));
        }
        /** Cancels the subscription to the storage events. */
        destroy() {
            if (__classPrivateFieldGet(this, _listener))
                removeEventListener('storage', __classPrivateFieldGet(this, _listener));
        }
        /**
         * Gets the value associated to the specified key.
         * @param key The key to seek for.
         * @param defaultValue The value to return if the item does not exist.
         * @return The value of the storage item, or the default value if the item is not found.
         */
        get(key, defaultValue) {
            var _a;
            return (_a = __classPrivateFieldGet(this, _backend).getItem(key)) !== null && _a !== void 0 ? _a : defaultValue;
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
            catch {
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
         * Looks up the value of the specified key, or add a new value if it isn't there.
         *
         * Returns the value associated to `key`, if there is one. Otherwise calls `ifAbsent` to get a new value,
         * associates `key` to that value, and then returns the new value.
         *
         * @param key The key to seek for.
         * @param ifAbsent The function called to get a new value.
         * @return The value associated with the specified key.
         */
        putIfAbsent(key, ifAbsent) {
            if (!this.has(key))
                this.set(key, ifAbsent());
            return this.get(key);
        }
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
        putObjectIfAbsent(key, ifAbsent) {
            if (!this.has(key))
                this.setObject(key, ifAbsent());
            return this.getObject(key);
        }
        /**
         * Removes the value associated to the specified key.
         * @param key The key to seek for.
         * @return The value associated with the specified key before it was removed.
         */
        remove(key) {
            const previousValue = this.get(key);
            __classPrivateFieldGet(this, _backend).removeItem(key);
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
            __classPrivateFieldGet(this, _backend).setItem(key, value);
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
                map[key] = value !== null && value !== void 0 ? value : null;
            return map;
        }
    }
    /**
     * An event that is triggered when a storage value is changed (added, modified, or removed).
     * @event changes
     */
    WebStorage.eventChanges = 'changes';
    return WebStorage;
})();
export { WebStorage };
/** Provides access to the local storage. */
export class LocalStorage extends WebStorage {
    /**
     * Creates a new local storage service.
     * @param options An object specifying values used to initialize this instance.
     */
    constructor(options = {}) {
        super(localStorage, options);
    }
}
/** Provides access to the session storage. */
export class SessionStorage extends WebStorage {
    /**
     * Creates a new session storage service.
     * @param options An object specifying values used to initialize this instance.
     */
    constructor(options = {}) {
        super(sessionStorage, options);
    }
}
