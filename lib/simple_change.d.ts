import { JsonObject } from './json';
/** Represents the event parameter used for a change event. */
export declare class SimpleChange {
    readonly previousValue?: string | undefined;
    readonly currentValue?: string | undefined;
    /**
     * Creates a new simple change.
     * @param previousValue The previous value, or `undefined` if added.
     * @param currentValue The current value, or `undefined` if removed.
     */
    constructor(previousValue?: string | undefined, currentValue?: string | undefined);
    /**
     * Creates a new simple change from the specified JSON object.
     * @param map A JSON object representing a simple change.
     * @return The instance corresponding to the specified JSON object.
     */
    static fromJson(map: JsonObject): SimpleChange;
    /**
     * Converts this object to a map in JSON format.
     * @return The map in JSON format corresponding to this object.
     */
    toJSON(): JsonObject;
}
