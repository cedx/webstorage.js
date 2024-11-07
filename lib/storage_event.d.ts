/**
 * An event dispatched when the storage has been changed.
 */
export class StorageEvent extends Event {

	/**
	 * The event type.
	 */
	static readonly type: string;

	/**
	 * The changed key.
	 */
	key: string|null;

	/**
	 * The new value.
	 */
	newValue: string|null;

	/**
	 * The original value.
	 */
	oldValue: string|null;

	/**
	 * Creates a new storage event.
	 * @param key The changed key.
	 * @param oldValue The original value.
	 * @param newValue The new value.
	 */
	constructor(key: string|null, oldValue?: string|null, newValue?: string|null);
}
