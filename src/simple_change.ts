import {JsonObject} from './json_object';

/** Represents the event parameter used for a change event. */
export class SimpleChange {

  /**
   * Creates a new simple change.
   * @param previousValue The previous value, or `undefined` if added.
   * @param currentValue The current value, or `undefined` if removed.
   */
  constructor(readonly previousValue?: string, readonly currentValue?: string) {}

  /**
   * Creates a new simple change from the specified JSON object.
   * @param map A JSON object representing a simple change.
   * @return The instance corresponding to the specified JSON object.
   */
  static fromJson(map: JsonObject): SimpleChange {
    return new SimpleChange(
      typeof map.previousValue == 'string' ? map.previousValue : undefined,
      typeof map.currentValue == 'string' ? map.currentValue : undefined
    );
  }

  /**
   * Converts this object to a map in JSON format.
   * @return The map in JSON format corresponding to this object.
   */
  toJSON(): JsonObject {
    return {
      currentValue: typeof this.currentValue == 'string' ? this.currentValue : null,
      previousValue: typeof this.previousValue == 'string' ? this.previousValue : null
    };
  }
}
