# Sprint 0 - Architecture and Test Findings

## 1. Purpose

This document summarizes what has actually been verified in Sprint 0 before decisions are made about data model, storage, migration or new implementation in Project Compass.

The document is based on current code, terminal results, Playwright tests and previously verified analysis.

The purpose is to create a clear decision basis before continued work on Project Compass V1.

## 2. Verified technical baseline

Verified terminal results:

- `npx playwright test --project=chromium --workers=1` passed with 32 tests.
- `git status` showed `nothing to commit, working tree clean`.
- Local branch `master` is in sync with `origin/master`.

Verified commit state:

```text
4dec44f Fix ambiguous attention preview test selectors
d2e4eec Add V1 quality and competency map
8108f62 Add AI review log
bdef952 Document Sprint 0 current state
be3efef Update README for open decision traceability
```

Verified documents:

- `CURRENT_STATE.md` exists and has been pushed.
- `docs/project-compass-v1-quality-and-competency-map.md` exists and has been pushed.
- `docs/ai-review-log.md` exists and has been started.

## 3. Current architecture

Project Compass has a stable main flow based on the projects overview:

```text
My Projects
-> activeProject
-> Members / Workspace / Risks / Decisions
-> Project Map
-> Status Report
```

This main flow is the best tested and most stable part of the application.

There is also a separate Project Interview / legacy flow through `/new-project`, which uses a different localStorage key than the main model.

## 4. Data storage and state

Verified localStorage keys:

```text
project-compass-state
project-compass-current-project
```

`project-compass-state` is used for the main model and contains:

- `activeProjectId`
- `projects`
- `members`
- `tasks`
- `risks`
- `decisions`
- `testCases`

`project-compass-current-project` is used by the Project Interview / legacy flow and contains text-based project information:

- `projectName`
- `purpose`
- `goal`
- `deliverables`
- `risks`
- `decisions`

Verified gap:

- There are two parallel project models.
- `/projects` creates a real project in the main model.
- `/new-project` writes Project Interview data to `project-compass-current-project`.
- Project Map and Status Report can read from both models.

## 5. Identified data models and relations

Verified central models in the main flow:

- Project
- ProjectMember
- ProjectTask
- ProjectRisk
- ProjectDecision
- ProjectTestCase

Verified relations:

- Task can have `ownerId`.
- Risk can have `ownerId`.
- Decision can have `ownerId`.
- Risk can be linked to a task through `relatedTaskId`.
- Decision can be linked to a task through `relatedTaskId`.
- Test case can be linked to a task through `relatedTaskId`.

Verified gaps:

- Risk and decision have both `owner` and `ownerId`, which indicates a mixed legacy / main model pattern.
- Test cases exist in the model, but are not yet broadly used in Project Map, Project Health or Status Report.
- Task to test case traceability is not fully visible in the report or Project Map.

## 6. Existing automated tests

Verified Playwright test files that have been analyzed:

- `tests/status-report-markdown.spec.ts`
- `tests/recommended-next-step-traceability.spec.ts`
- `tests/project-health-scenarios.spec.ts`
- `tests/project-map-attention.spec.ts`
- `tests/example-project.spec.ts`
- `tests/project-setup-checklist.spec.ts`
- `tests/projects-overview.spec.ts`
- `tests/project-members.spec.ts`
- `tests/task-responsibility.spec.ts`
- `tests/risk-responsibility.spec.ts`
- `tests/decision-responsibility.spec.ts`
- `tests/main-flow.spec.ts`

Verified test state:

- 32 Playwright tests pass.
- The test suite covers several important user flows, not only isolated components.

## 7. What the 32 Playwright tests actually verify

Verified test coverage includes:

- create project
- validation when project name is missing
- project persistence after reload
- create example project
- My Projects overview
- Attention Needed preview
- Project Map empty state
- Project setup checklist
- Workspace empty state
- task validation
- task without owner
- task with owner
- Risk View empty state
- risk validation
- risk without owner
- risk with owner
- Decision View empty state
- decision validation
- decision without owner
- decision with owner
- Project Health scenarios
- Recommended Next Step
- risk / decision traceability recommendations
- Status Report
- Markdown export
- legacy / interview data in Project Map and Status Report

## 8. Important quality risks

Verified or likely quality risks:

- Two parallel project models can create confusion and inconsistent state.
- The Project Interview flow is not fully integrated with the main model.
- The QA module exists, but is not sufficiently integrated into report, health or map.
- localStorage handling works in the happy path, but robust error handling is weaker.
- `schemaVersion` is missing.
- A full migration strategy is missing.
- Backup / restore is missing.
- Broken JSON in some legacy reads can likely cause problems.
- `activeProjectId` can likely point to a project that no longer exists without clear user feedback.
- Some test data contains older or future fields that do not fully match the current type model.

## 9. Verified gaps

Verified product and test gaps:

- No clear Playwright test for the Test Cases flow.
- No QA Summary in Status Report.
- Test cases do not affect Project Health.
- Test cases are not shown in Project Map.
- Task to test case traceability is not reported.
- Risk to task via UI is not clearly E2E-tested.
- Decision to task via UI is not clearly E2E-tested.
- Status changes for tasks, risks and decisions are not clearly tested.
- The Project Interview form is not fully E2E-tested through the UI.
- localStorage error handling is not tested.
- schemaVersion and migration are missing.
- Backup / restore is missing.

## 10. Needs investigation

The following should be investigated before larger implementation:

- How `project-compass-current-project` should be merged into `project-compass-state`.
- Whether Project Interview should create a real Project directly.
- Whether Project Interview should remain as a separate setup step or be rebuilt as Guided Project Setup.
- How schemaVersion should be introduced.
- How migration from older localStorage data should be handled.
- How corrupted localStorage data should be handled without silent data loss.
- How backup / export and restore / import should work.
- How QA Summary should be integrated into Status Report.
- How test case status should affect Attention Needed or Project Health.
- How task to test case traceability should be shown.

## 11. Recommended work order

Recommended order after this document:

1. Document data model and storage gaps.
2. Create `docs/project-data-unification-plan.md`.
3. Decide how Project Interview should connect to the main model.
4. Introduce schemaVersion and a simple migration strategy.
5. Add more robust localStorage error handling.
6. Add a minimal QA Summary in Status Report.
7. Create a Playwright test for Test Cases to Status Report.
8. Only after that consider larger UI polish or new functionality.

## 12. First possible implementation after this document

The first possible implementation after this document should be small, verifiable and committable.

Recommended first implementation:

```text
Create a project-data-unification-plan before changing code.
```

First possible code implementation after the plan:

```text
Let Project Interview create or update a real Project in project-compass-state.
```

Alternative first QA implementation after the plan:

```text
Show a simple QA Summary in Status Report based on activeProject.testCases.
```

The decision about which of these should happen first should be made after the data model plan.

## 13. Explicitly not in scope

This document does not:

- change code
- introduce a new data model
- introduce migration
- introduce schemaVersion
- build QA Summary
- change tests
- create a data-unification-plan
- decide final architecture

This document is only a verified decision basis.
