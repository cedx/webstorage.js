import {StorageEvent} from "./storage_event.js"

# Provides access to the [Web Storage](https://developer.mozilla.org/docs/Web/API/Web_Storage_API).
export class Storage extends EventTarget

	# The keys of this storage.
	Object.defineProperty @prototype, "keys",
		get: ->
			keys = Array.from(Array(@_backend.length), (_, index) => @_backend.key(index))
			new Set(if @_keyPrefix then keys.filter((key) => key.startsWith(@_keyPrefix)).map(key => key.slice(@_keyPrefix.length)) else keys)

	# The number of entries in this storage.
	Object.defineProperty @prototype, "length",
		get: -> if @_keyPrefix then @keys.size else @_backend.length

	# Creates a new storage service.
	constructor: (backend, options = {}) ->
		super()
		addEventListener("storage", @) if options.listenToGlobalEvents

		# The underlying data store.
		@_backend = backend

		# A string prefixed to every key so that it is unique globally in the whole storage.
		@_keyPrefix = options.keyPrefix ? ""

	# Creates a new local storage service.
	@local: (options = {}) -> new @ localStorage, options

	# Creates a new session storage service.
	@session: (options = {}) -> new @ sessionStorage, options

	# Returns a new iterator that allows iterating the entries of this storage.
	[Symbol.iterator]: () ->
		yield [key, @get(key)] for key in @keys
		return

	# Removes all entries from this storage.
	clear: ->
		if @_keyPrefix then @delete key for key in @keys
		else
			@_backend.clear()
			@dispatchEvent new StorageEvent null

	# Removes the value associated with the specified key.
	delete: (key) ->
		oldValue = @get key
		@_backend.removeItem @_buildKey key
		@dispatchEvent new StorageEvent key, oldValue
		oldValue

	# Cancels the subscription to the global storage events.
	destroy: -> removeEventListener "storage", this

	# Gets the value associated to the specified key.
	get: (key) -> @_backend.getItem @_buildKey key

	# Gets the deserialized value associated with the specified key.
	getObject: (key) -> try JSON.parse(@get(key) ? "") catch then null

	# Handles the events.
	handleEvent: (event) ->
		if event.storageArea is @_backend and (not event.key? or event.key.startsWith @_keyPrefix)
			@dispatchEvent new StorageEvent event.key?.slice(@_keyPrefix.length) ? null, event.oldValue, event.newValue

	# Gets a value indicating whether this storage contains the specified key.
	has: (key) -> @get(key)?

	# Registers a function that will be invoked whenever the `change` event is triggered.
	onChange: (listener) ->
		@addEventListener StorageEvent.type, listener, passive: true
		this

	# Associates a given value with the specified key.
	set: (key, value) ->
		oldValue = @get key
		@_backend.setItem @_buildKey(key), value
		@dispatchEvent new StorageEvent key, oldValue, value
		this

	# Serializes and associates a given value with the specified key.
	setObject: (key, value) -> @set key, JSON.stringify(value)

	# Returns a JSON representation of this object.
	toJSON: -> Array.from @

	# Builds a normalized storage key from the given key.
	@_buildKey: (key) -> "#{@_keyPrefix}#{key}"
