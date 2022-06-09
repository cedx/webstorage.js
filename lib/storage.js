/**
 * Provides access to the [Web Storage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API).
 * @abstract
 */
export class Storage extends EventTarget {

	/**
	 * A string prefixed to every key so that it is unique globally in the whole storage.
	 * @type {string}
	 */
	#keyPrefix;

	/**
	 * Creates a new storage service.
	 * @param {Partial<StorageOptions>} [options] An object providing values to initialize this instance.
	 */
	constructor(options = {}) {
		super();
		const {keyPrefix = "", listenToGlobalEvents = false} = options;
		this.#keyPrefix = keyPrefix;
	}
}

/**
 * Defines the options of a {@link Storage} instance.
 * @typedef {object} StorageOptions
 * @property {string} keyPrefix A string prefixed to every key so that it is unique globally in the whole storage.
 * @property {boolean} listenToGlobalEvents Value indicating whether to listen to the global storage events.
 */
