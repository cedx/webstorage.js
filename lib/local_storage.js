import {Storage} from "./storage.js";

/**
 * Provides access to the local storage.
 */
export class LocalStorage extends Storage {

	/**
	 * Creates a new local storage service.
	 * @param {Partial<import("./storage.js").StorageOptions>} [options] An object providing values to initialize this instance.
	 */
	constructor(options = {}) {
		super(options);
	}
}
