# NestJS 12 support design

**Branch:** `feat/nestjs-12-support`  
**Date:** 2026-11-24  
**Decision:** Add Nest 12 while keeping Nest 8–11 peer compatibility (approach 1).

## Goal

Declare and verify that `@ideashift/nestjs-passport-firebase` works with NestJS 12 without dropping support for Nest 8–11 consumers.

## Non-goals

- Dropping Nest 8–10 peer ranges
- Migrating this library itself to ESM
- Multi-version Nest CI matrix (11 + 12)
- Changing cookie/token auth behavior

## Compatibility model

| Consumer Nest | Recommended `@nestjs/passport` | Our package peers |
|---------------|--------------------------------|-------------------|
| 8–10          | 9–11                           | Allowed           |
| 11            | 11 or 12                       | Allowed           |
| 12            | 12                             | Allowed (new)     |

`@nestjs/passport@12` only peers Nest 11–12 and is ESM; Nest 8–10 apps must stay on older `@nestjs/passport`. Document this in README.

## Changes

### Dependencies

- **peerDependencies**
  - `@nestjs/common`: add `|| ^12.x` (keep `^8 || ^9 || ^10 || ^11`)
  - `@nestjs/passport`: add `|| ^12.x` (keep `^9 || ^10 || ^11`)
- **devDependencies:** bump Nest packages to latest 12.x (`@nestjs/common`, `core`, `passport`, `platform-express`, `testing`, `cli`, `schematics`)
- Leave other peers (`firebase-admin`, `passport*`, `jwks-rsa`) unchanged unless Nest 12 install forces a compatible bump
- Bump package version to **1.0.17** (compatibility patch)

### Source code

- No intentional API changes
- Keep root imports only from `@nestjs/passport` (no deep `/dist/` imports)
- Do not override `getAuthenticateOptions` with `defaultStrategy` / `property`
- Fix only what breaks under Nest 12 + Jest (e.g. Jest ESM transform config if required)

### Docs / engines

- README: Nest 8–12 support; Node **20.19+ or 22.12+** for Nest 12 / `@nestjs/passport@12`
- CHANGELOG: Nest 12 support entry
- Optional `engines.node` documenting minimum Node for Nest 12 consumers (document clearly if added)

### Verification

- `npm install` / `npm ci` succeeds with Nest 12 devDeps
- `npm test` passes
- `npm run build` passes

## Risks

| Risk | Mitigation |
|------|------------|
| Jest fails importing ESM `@nestjs/passport@12` | Adjust Jest config only as needed |
| TypeScript peer friction with Nest 12 | Bump TypeScript if required by Nest 12 packages |
| Wide peers confuse Nest 8–10 + passport@12 | README guidance on pairing |

## Out of scope follow-ups

- CI matrix across Nest majors
- Publishing / npm trusted publisher auth (separate from this change)
