/**
 * An event dispatched when the storage has been changed.
 */
export declare class StorageEvent extends Event {
    /**
     * The event type.
     */
    static readonly type = "storage:change";
    /**
     * The changed key.
     */
    readonly key: string | null;
    /**
     * The new value.
     */
    readonly newValue: string | null;
    /**
     * The original value.
     */
    readonly oldValue: string | null;
    /**
     * Creates a new cookie event.
     * @param key The changed key.
     * @param oldValue The original value.
     * @param newValue The new value.
     */
    constructor(key: string | null, oldValue?: string | null, newValue?: string | null);
}
//# sourceMappingURL=storage_event.d.ts.map