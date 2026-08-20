# ARTENIA Frontend Agent Rules

## Mission
Make the smallest safe change that completes the approved task without changing unrelated behavior.

## Context budget
1. Read this file first.
2. Read only the task/decision IDs named by the user and the files directly relevant to them.
3. If `../artenia-backend/ops/` exists, use it as the private source of project tasks and decisions. Do not copy private content into this public repository.
4. Do not scan the whole repository unless the task explicitly says `AUDIT`.
5. Reuse existing components, routes and styles before creating new ones.

## Runtime source-of-truth guard
Before autonomous product edits or deployment, confirm the repository contains the currently approved runtime files referenced by the live shell. In particular, if `index.html` expects `map-gate.js`, that file must exist in the repository; the approved global-search implementation (`artenia-search.js`) must also be versioned and wired before search/navigation work continues. If these are absent or the repo is known to lag behind production/local work, STOP and report `BLOCKED: runtime/repo drift`. Never recreate missing production code from memory.

## Safe workflow
1. Check current branch/status and preserve unrelated user changes.
2. Locate the smallest set of files responsible for the behavior.
3. Make a minimal diff. No broad refactors while fixing a focused task.
4. Run the narrowest useful validation available for changed files, then broader checks only when justified.
5. Review the final diff before reporting completion.

## Never do without explicit approval
- Deploy to production.
- Change deployment credentials, secrets or environment values.
- Change authentication, permissions, payments or destructive data behavior.
- Delete large data sets or major features.
- Add a new dependency when the task can be solved with the existing stack.

## ARTENIA UX invariants
- One global user-facing search entry point; do not add duplicate search boxes.
- Technical node-type controls must not appear as a separate competing navigation/search system.
- Primary navigation should remain easy to find throughout the experience.
- Critical user journeys should reach the destination in about 3 interactions or fewer where practical.
- Preserve ARTENIA's immersive/editorial depth; avoid generic dashboard styling unless explicitly requested.
- Keep mobile/responsive behavior intact.
- Cultural/historical factual content must not be invented. Preserve source/provenance when available.

## Token-efficient reporting
Return at most 8 short lines:
- DONE / BLOCKED
- Task ID
- Files changed
- What changed
- Validation run + result
- Risk/approval needed
- Next action only if necessary

If blocked, stop and report one precise blocker. Do not write a long diagnosis unless asked.