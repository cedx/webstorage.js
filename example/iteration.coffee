import {Storage} from "@cedx/webstorage"
import console from "node:console"

# Loop over all entries of the local storage.
localStorage = Storage.local()
	.set "foo", "bar"
	.set "bar", "baz"
	.set "baz", "qux"

console.log "#{key} => #{value}" for [key, value] from localStorage
# Round 1: "foo => bar"
# Round 2: "bar => baz"
# Round 3: "baz => qux"

# Loop over entries of the session storage that use the same key prefix.
Storage.session()
	.set "foo", "bar"
	.set "prefix:bar", "baz"

prefixedStorage = Storage.session(keyPrefix: "prefix:").set "baz", "qux"
console.log "#{key} => #{value}" for [key, value] from prefixedStorage
# Round 1: "bar => baz"
# Round 2: "baz => qux"
