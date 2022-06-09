/**
 * An event triggered when the storage has been changed.
 */
 export class StorageEvent extends Event {

	/**
	 * The event type.
	 * @readonly
	 * @type {string}
	 */
	static type = "change";

	/**
	 * The changed key.
	 * @readonly
	 * @type {string|null}
	 */
	key;

	/**
	 * The new value.
	 * @readonly
	 * @type {string|null}
	 */
	newValue;

	/**
	 * The original value.
	 * @readonly
	 * @type {string|null}
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
