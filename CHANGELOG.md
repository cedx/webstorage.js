# Changelog

## Version [3.0.0](https://github.com/cedx/webstorage.js/compare/v2.0.2...v3.0.0)
- Breaking change: removed the `LocalStorage` and `SessionStorage` classes.
- Added the `localStorage` and `sessionStorage` symbols.

## Version [2.0.2](https://github.com/cedx/webstorage.js/compare/v2.0.1...v2.0.2)
- Fixed the [TypeScript](https://www.typescriptlang.org) typings.

## Version [2.0.1](https://github.com/cedx/webstorage.js/compare/v2.0.0...v2.0.1)
- Fixed a packaging issue.

## Version [2.0.0](https://github.com/cedx/webstorage.js/compare/v1.6.0...v2.0.0)
- Breaking change: removed the `defaultValue` parameter from the getter methods.
- Breaking change: renamed the `WebStorage` class to `Storage`.
- Breaking change: replaced the `SimpleChange` class by the `StorageEvent` one.
- Added support for key prefix.
- Added the `local()` and `session()` static methods to the `Storage` class.
- Added the `Storage.onChange()` instance method.
- Ported the source code to [JavaScript](https://developer.mozilla.org/docs/Web/JavaScript).
- Restored support for [GitHub Packages](https://github.com/features/packages).

## Version [1.6.0](https://github.com/cedx/webstorage.js/compare/v1.5.0...v1.6.0)
- Replaced the build system based on [Gulp](https://gulpjs.com) by [PowerShell](https://docs.microsoft.com/en-us/powershell) scripts.
- Updated the package dependencies.

## Version [1.5.0](https://github.com/cedx/webstorage.js/compare/v1.4.0...v1.5.0)
- Dropped support for [GitHub Packages](https://github.com/features/packages).
- Raised the [Node.js](https://nodejs.org) constraint.
- Updated the documentation.
- Updated the package dependencies.

## Version [1.4.0](https://github.com/cedx/webstorage.js/compare/v1.3.0...v1.4.0)
- Added the `listenToStorageEvents` optional parameter to the class constructors.
- Added the `WebStorageOptions` interface.
- Improved the documentation.

## Version [1.3.0](https://github.com/cedx/webstorage.js/compare/v1.2.0...v1.3.0)
- Updated the package dependencies.

## Version [1.2.0](https://github.com/cedx/webstorage.js/compare/v1.1.0...v1.2.0)
- Added the `putIfAbsent()` and `putObjectIfAbsent()` methods to the `WebStorage` class.
- Updated the package dependencies.

## Version [1.1.0](https://github.com/cedx/webstorage.js/compare/v1.0.0...v1.1.0)
- Replaced [`babel-minify`](https://github.com/babel/minify) by [`terser`](https://terser.org) for minification.

## Version 1.0.0
- Initial release.
