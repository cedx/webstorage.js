/** Represents the event parameter used for a change event. */
export class SimpleChange {
    /**
     * Creates a new simple change.
     * @param previousValue The previous value, or `undefined` if added.
     * @param currentValue The current value, or `undefined` if removed.
     */
    constructor(previousValue, currentValue) {
        this.previousValue = previousValue;
        this.currentValue = currentValue;
    }
    /**
     * Creates a new simple change from the specified JSON object.
     * @param map A JSON object representing a simple change.
     * @return The instance corresponding to the specified JSON object.
     */
    static fromJson(map) {
        return new SimpleChange(typeof map.previousValue == 'string' ? map.previousValue : undefined, typeof map.currentValue == 'string' ? map.currentValue : undefined);
    }
    /**
     * Converts this object to a map in JSON format.
     * @return The map in JSON format corresponding to this object.
     */
    toJSON() {
        var _a, _b;
        return {
            currentValue: (_a = this.currentValue, (_a !== null && _a !== void 0 ? _a : null)),
            previousValue: (_b = this.previousValue, (_b !== null && _b !== void 0 ? _b : null))
        };
    }
}
