/**
 * An event dispatched when the storage has been changed.
 */
export class StorageEvent extends Event {

	/**
	 * The event type.
	 */
	static readonly type = "change";

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
	 * @param key The changed key.
	 * @param oldValue The original value.
	 * @param newValue The new value.
	 */
	constructor(key: string|null, oldValue: string|null = null, newValue: string|null = null) {
		super(StorageEvent.type);
		this.key = key;
		this.newValue = newValue;
		this.oldValue = oldValue;
	}
}
