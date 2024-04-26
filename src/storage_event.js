/**
 * An event dispatched when the storage has been changed.
 */
export class StorageEvent extends Event {

	/**
	 * The event type.
	 * @readonly
	 */
	static type = "storage:change";

	/**
	 * The changed key.
	 * @type {string|null}
	 * @readonly
	 */
	key;

	/**
	 * The new value.
	 * @type {string|null}
	 * @readonly
	 */
	newValue;

	/**
	 * The original value.
	 * @type {string|null}
	 * @readonly
	 */
	oldValue;

	/**
	 * Creates a new cookie event.
	 * @param {string|null} key The changed key.
	 * @param {string|null} oldValue The original value.
	 * @param {string|null} newValue The new value.
	 */
	constructor(key, oldValue = null, newValue = null) {
		super(StorageEvent.type);
		this.key = key;
		this.newValue = newValue;
		this.oldValue = oldValue;
	}
}
