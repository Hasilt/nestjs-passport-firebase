# NestJS 12 Support Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add NestJS 12 peer/dev support while keeping Nest 8–11 peers; verify build and tests.

**Architecture:** Compatibility-only change — widen peer ranges, bump Nest 12 devDependencies, document Node/`@nestjs/passport` pairing. No auth API changes unless Nest 12 + Jest force config tweaks.

**Tech Stack:** NestJS 12, `@nestjs/passport` 12, Jest/ts-jest, TypeScript 5.x (bump only if required)

**Spec:** `docs/superpowers/specs/2026-11-24-nestjs-12-support-design.md`

---

## File map

| File | Responsibility |
|------|----------------|
| `package.json` | peers, Nest 12 devDeps, version 1.0.17, optional engines |
| `package-lock.json` | lockfile after install |
| `README.md` | Nest 8–12 + Node/`passport` pairing notes |
| `CHANGELOG.md` | 1.0.17 entry |
| `jest.config.ts` | only if ESM import failures |

---

### Task 1: Bump dependencies and version

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] Step 1: Update peers — `@nestjs/common` add `|| ^12.x`; `@nestjs/passport` add `|| ^12.x`
- [ ] Step 2: Set `"version": "1.0.17"`; optional `"engines": { "node": ">=18" }` with README clarifying Nest 12 needs 20.19+/22.12+
- [ ] Step 3: `npm install @nestjs/common@12 @nestjs/core@12 @nestjs/passport@12 @nestjs/platform-express@12 @nestjs/testing@12 @nestjs/cli@12 @nestjs/schematics@12 --save-dev`
- [ ] Step 4: `npm test` and `npm run build` — fix Jest/TS only if needed

### Task 2: Docs

**Files:**
- Modify: `CHANGELOG.md`
- Modify: `README.md`

- [ ] Step 1: Add `## [1.0.17]` Nest 12 support notes
- [ ] Step 2: Document Nest 8–12; Nest 12 → Node 20.19+/22.12+; Nest 8–10 keep `@nestjs/passport@9–11`

### Task 3: Verify

- [ ] Step 1: `npm test` — all pass
- [ ] Step 2: `npm run build` — succeeds
