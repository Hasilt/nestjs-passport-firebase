# Changelog

## [1.0.17] - 2026-11-24

- Added NestJS 12 peer and development dependency support (Nest 8–11 still supported)
- Bumped TypeScript to 6.x for Nest 12 tooling compatibility
- Documented Node.js 20.19+ / 22.12+ requirement when using Nest 12 / `@nestjs/passport@12`
- Adjusted Jest to load Nest 12 ESM packages via `--experimental-vm-modules`

## [1.0.10] - 2024-09-11

- Updated package to support NestJS 11
- Added tests for cookie-based authentication strategy

## [1.0.7] - 2023-09-03

### Added

- Support for cookie-based authentication alongside existing JWT authentication.
- Ability to customize the cookie name used for authentication.

### Changed

- Updated `FirebaseStrategy` to handle both JWT and cookie-based authentication.
- Modified `FirebaseAuthConfig` to include an optional `cookieName` property.

## [1.0.6] - 2023-06-25

- Update peer deps `@nestjs/passport` to support version `^10.0.0`
- Add `.nvmrc` to force use node v18 to contributors
- Update package-lock.json

## [1.0.5] - 2023-04-15

- Update peer deps `jwks-rsa` to support version ^3.0.0

## [1.0.4] - 2023-04-15

- Update peer deps `@nestjs/common` to support version ^9.0.0

## [1.0.3] - 2022-09-06

- Update devDependencies NestJS packages to v8
- Update @nestjs/passport to v9

## [1.0.2] - 2021-05-11

- Change the response type of the `validate` method of `FirebaseStrategy`
  to `any | Promise<any>`. This will allow customization of `validate`
  behavior using method overriding.
- Add documentation on how you can override the `validate` method.

## [1.0.1] - 2021-03-17

- Add description under _Protect your APIs_ section in documentation

## [1.0.0] - 2021-03-17

### Initial Release

- Add custom passport strategy named FirebaseStrategy, extending
  the PassportJwt Strategy.
- Create a dynamic module for initialization of FirebaseStrategy
