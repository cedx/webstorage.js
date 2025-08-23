/**
 * An event dispatched when the storage has been changed.
 */
export class StorageEvent extends Event {

	/**
	 * The changed key.
	 */
	readonly key: string|null;

	/**
	 * The new value.
	 */
	readonly newValue: string|null;

	/**
	 * The original value.
	 */
	readonly oldValue: string|null;

	/**
	 * Creates a new cookie event.
	 * @param type The event type.
	 * @param key The changed key.
	 * @param oldValue The original value.
	 * @param newValue The new value.
	 */
	constructor(type: string, key: string|null, oldValue: string|null = null, newValue: string|null = null) {
		super(type);
		this.key = key;
		this.newValue = newValue;
		this.oldValue = oldValue;
	}
}
