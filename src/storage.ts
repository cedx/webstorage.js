import {JsonObject} from './json_object';
import {SimpleChange} from './simple_change';

/** Provides access to the [Web Storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage). */
export abstract class WebStorage extends EventTarget implements Iterable<[string, string|undefined]> {

  /**
   * An event that is triggered when a storage value is changed (added, modified, or removed).
   * @event changes
   */
  static readonly eventChanges: string = 'changes';

  /** The function that listens for storage events. */
  private readonly _listener: (event: StorageEvent) => void;

  /**
   * Creates a new storage service.
   * @param _backend The underlying data store.
   */
  protected constructor(private _backend: Storage) {
    super();

    this._listener = event => {
      if (event.key == null || event.storageArea != _backend) return;
      const change = new SimpleChange(event.oldValue ?? undefined, event.newValue ?? undefined);
      this.dispatchEvent(new CustomEvent(WebStorage.eventChanges, {detail: new Map<string, SimpleChange>([[event.key, change]])}));
    };

    addEventListener('storage', this._listener);
  }

  /** The keys of this storage. */
  get keys(): string[] {
    const keys = [];
    for (let i = 0; true; i++) { // eslint-disable-line no-constant-condition
      const key = this._backend.key(i);
      if (key == null) return keys;
      keys.push(key);
    }
  }

  /** The number of entries in this storage. */
  get length(): number {
    return this._backend.length;
  }

  /**
   * Returns a new iterator that allows iterating the entries of this storage.
   * @return An iterator for the entries of this storage.
   */
  *[Symbol.iterator](): IterableIterator<[string, string|undefined]> {
    for (const key of this.keys) yield [key, this.get(key)];
  }

  /** Removes all entries from this storage. */
  clear(): void {
    const changes = new Map<string, SimpleChange>();
    for (const [key, value] of this) changes.set(key, new SimpleChange(value));
    this._backend.clear();
    this.dispatchEvent(new CustomEvent(WebStorage.eventChanges, {detail: changes}));
  }

  /** Cancels the subscription to the storage events. */
  destroy(): void {
    removeEventListener('storage', this._listener);
  }

  /**
   * Gets the value associated to the specified key.
   * @param key The key to seek for.
   * @param defaultValue The value to return if the item does not exist.
   * @return The value of the storage item, or the default value if the item is not found.
   */
  get(key: string, defaultValue?: string): string|undefined {
    return this._backend.getItem(key) ?? defaultValue;
  }

  /**
   * Gets the deserialized value associated to the specified key.
   * @param key The key to seek for.
   * @param defaultValue The value to return if the item does not exist.
   * @return The deserialized value of the storage item, or the default value if the item is not found.
   */
  getObject(key: string, defaultValue?: any): any {
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
  has(key: string): boolean {
    return this.keys.includes(key);
  }

  /**
   * Removes the value associated to the specified key.
   * @param key The key to seek for.
   * @return The value associated with the specified key before it was removed.
   */
  remove(key: string): string|undefined {
    const previousValue = this.get(key);
    this._backend.removeItem(key);
    this.dispatchEvent(new CustomEvent(WebStorage.eventChanges, {detail: new Map<string, SimpleChange>([
      [key, new SimpleChange(previousValue)]
    ])}));

    return previousValue;
  }

  /**
   * Associates a given value to the specified key.
   * @param key The key to seek for.
   * @param value The item value.
   * @return This instance.
   */
  set(key: string, value: string): this {
    const previousValue = this.get(key);
    this._backend.setItem(key, value);
    this.dispatchEvent(new CustomEvent(WebStorage.eventChanges, {detail: new Map<string, SimpleChange>([
      [key, new SimpleChange(previousValue, value)]
    ])}));

    return this;
  }

  /**
   * Serializes and associates a given value to the specified key.
   * @param key The key to seek for.
   * @param value The item value.
   * @return This instance.
   */
  setObject(key: string, value: any): this {
    return this.set(key, JSON.stringify(value));
  }

  /**
   * Converts this object to a map in JSON format.
   * @return The map in JSON format corresponding to this object.
   */
  toJSON(): JsonObject {
    const map: JsonObject = {};
    for (const [key, value] of this) map[key] = value;
    return map;
  }
}

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
