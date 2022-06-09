/**
 * Provides access to the [Web Storage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API).
 * @abstract
 */
export class Storage {

	/**
	 * Creates a new storage service.
	 */
	constructor() {
		// TODO
	}
}

/**
 * Defines the options of a {@link Storage} instance.
 * @typedef {object} StorageOptions
 * @property {string} keyPrefix A string prefixed to every key so that it is unique globally in the whole storage.
 * @property {boolean} listenToGlobalEvents Value indicating whether to listen to the global storage events.
 */
