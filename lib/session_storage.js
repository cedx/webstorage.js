import {Storage} from "./storage.js";

/**
 * Provides access to the session storage.
 */
export class SessionStorage extends Storage {

	/**
	 * Creates a new session storage service.
	 * @param {Partial<import("./storage.js").StorageOptions>} [options] An object providing values to initialize this instance.
	 */
	constructor(options = {}) {
		super(options);
	}
}
