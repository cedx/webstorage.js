# An event dispatched when the storage has been changed.
export class StorageEvent extends Event

	# The event type.
	@type = "storage:change"

	# Creates a new storage event.
	constructor: (key, oldValue = null, newValue = null) ->
		super StorageEvent.type

		# The changed key.
		@key = key

		# The new value.
		@newValue = newValue

		# The original value.
		@oldValue = oldValue
