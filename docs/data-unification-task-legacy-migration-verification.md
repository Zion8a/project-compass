# Data Unification Step 3 – Safe Task Legacy Migration Verification

Date: 2026-08-10

Status: Verification complete – awaiting steering group review

## Scope

This document verifies the current legacy task migration flow before any production-code change is made.

No backup, rollback, migration redesign or production-code modification is implemented in this step.

## 1. Current migration chain

### Trigger

Migration logic runs inside the Workspace page mount effect.

The flow begins by loading the current platform state:

```ts
const platformState = loadProjectCompassState();
const currentActiveProject = getActiveProject(platformState);
```

If no active project can be resolved, the effect returns before legacy tasks are read.

Migration can therefore only be reached when an active project exists.

### Source read

Legacy tasks are read from:

```text
project-compass-tasks
```

by:

```ts
const savedTasks = localStorage.getItem("project-compass-tasks");
```

If the key is missing or contains an empty string, `loadLegacyTasks()` returns an empty array.

### Parse

If a value exists, the code attempts:

```ts
JSON.parse(savedTasks)
```

If parsing throws, `loadLegacyTasks()` catches the error and returns an empty array.

If the parsed value is not an array, it also returns an empty array.

### Transform

The parsed array is filtered and mapped into the current `ProjectTask` shape.

Only items whose `title` is a non-empty string survive the filter.

The mapper then:

- preserves string `id`, otherwise creates a new UUID,
- preserves `title`,
- preserves string `description`, otherwise uses `undefined`,
- preserves a valid task status, otherwise defaults to `backlog`,
- preserves string `ownerId`, otherwise uses `undefined`,
- preserves string `createdAt`, otherwise creates the current timestamp,
- preserves string `updatedAt`, otherwise creates the current timestamp.

Fields not explicitly emitted by the mapper are discarded.

### Migration condition

Migration runs only when both conditions are true:

```ts
currentActiveProject.tasks.length === 0
legacyTasks.length > 0
```

Existing target tasks are therefore never merged with legacy tasks.

### Target state construction

The active project is copied and its empty task array is replaced by the transformed legacy tasks:

```ts
const migratedProject: Project = {
  ...currentActiveProject,
  tasks: legacyTasks,
};
```

`updateProject()` then creates a new `ProjectCompassState`, replaces the matching project and updates the project's `updatedAt`.

### Target write

The resulting state is passed to:

```ts
saveProjectCompassState(updatedState);
```

`saveProjectCompassState()` checks the currently stored `project-compass-state` before writing.

It refuses to write when the existing stored target is classified as:

- `invalid`,
- `unsupported-version`.

Otherwise it writes the state with:

```ts
localStorage.setItem(PROJECT_COMPASS_STORAGE_KEY, JSON.stringify(state));
```

The function returns `void`.

There is no read-back verification after the write.

### Source delete

Immediately after the save call, Workspace executes:

```ts
localStorage.removeItem("project-compass-tasks");
```

The source deletion is therefore not explicitly conditioned on a returned success result or a verified read-back of the migrated target.

### Verified chain

The current chain is:

```text
Workspace mount
→ load project-compass-state
→ resolve active project
→ read project-compass-tasks
→ parse JSON
→ validate array shape
→ filter task records
→ transform task fields
→ require empty target tasks and non-empty transformed source
→ build updated project/state
→ call saveProjectCompassState
→ delete project-compass-tasks
→ update React state
```

## 2. Field-by-field transformation matrix

The verified legacy task representation immediately before commit `d0e032d` was:

```ts
type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  ownerId?: string;
};
```

The verified legacy status values were:

```ts
type TaskStatus =
  | "backlog"
  | "planned"
  | "in-progress"
  | "blocked"
  | "review"
  | "done";
```

The current target representation is:

```ts
export type ProjectTask = {
  id: string;
  title: string;
  description?: string;
  status: ProjectTaskStatus;
  priority?: "low" | "medium" | "high";
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
};
```

| Field | Verified legacy representation | Current target representation | Current migration behaviour | Classification |
|---|---|---|---|---|
| `id` | required string | required string | preserved when value is a string; otherwise a new UUID is generated | preserve or transform |
| `title` | required string | required string | record is kept only when title is a non-empty string; surviving value is preserved | preserve or reject record |
| `description` | required string | optional string | preserved when value is a string; otherwise becomes `undefined` | preserve or normalize |
| `status` | one of six verified status values | same six current status values | preserved when valid; otherwise defaults to `backlog` | preserve or default |
| `ownerId` | optional string | optional string | preserved when value is a string; otherwise becomes `undefined` | preserve or normalize |
| `createdAt` | not present in verified legacy type | required string | current timestamp is created when missing | new target field/default |
| `updatedAt` | not present in verified legacy type | required string | current timestamp is created when missing | new target field/default |
| `priority` | not present in verified legacy type | optional `low`, `medium` or `high` | not emitted by the migration mapper | target-only field; no verified legacy loss |
| unknown extra fields | not part of verified legacy type | not generally part of target contract | discarded because the mapper reconstructs the object explicitly | ignored/discarded |

### Record-level filtering

Before mapping, the current implementation applies:

```ts
.filter((task) => typeof task.title === "string" && task.title.trim())
```

This means a legacy array can contain both accepted and rejected records.

If at least one record survives the filter, migration can continue and the complete legacy storage key can later be deleted.

Therefore rejected records can be permanently lost while valid records from the same source array are migrated.

This is a verified destructive partial-migration scenario.

### Runtime type assumption

The parsed legacy array is cast as:

```ts
Partial<ProjectTask>[]
```

This TypeScript cast does not perform runtime validation.

It also describes the parsed data using the current target model rather than the historically verified legacy `Task` model.

The historical legacy type and writer are therefore stronger evidence for the migration oracle than this cast.

## 3. Priority verification

The previous code-flow verification stated that:

> `priority` is not carried over by the mapper.

That statement is technically true when comparing the current migration mapper with the current `ProjectTask` target type.

However, the Step 3 verification adds an important historical correction.

The verified legacy `Task` type immediately before task migration was introduced did not contain a `priority` field:

```ts
type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  ownerId?: string;
};
```

The verified legacy task creation flow also created tasks without `priority`, and the legacy writer persisted that task array to:

```text
project-compass-tasks
```

Therefore there is currently no verified code-history evidence that Project Compass itself stored `priority` in the canonical legacy task source before the migration was introduced.

### Corrected conclusion

The current migration mapper does not emit `priority`.

However:

- `priority` was not part of the verified legacy task type,
- `priority` was not part of the verified legacy task creation flow,
- actual loss of a product-generated legacy `priority` value is therefore not established.

The earlier finding should consequently not be used as proof of confirmed legacy data loss.

### Remaining schema-drift risk

If `project-compass-tasks` contains non-canonical data with an additional `priority` field, the current mapper will silently discard that value because it reconstructs the target task explicitly.

That is a real transformation behaviour, but it is not currently proven to affect data produced by the verified historical Project Compass task writer.

### Oracle implication

The existence of `priority` in the current target model is not sufficient evidence that legacy tasks were expected to contain it.

For this migration, the historical producer type and writer are stronger evidence of the legitimate source contract than the current target model alone.

## 4. Destructive and irreversible points

The current migration contains several points where information can be changed, discarded or made difficult to recover.

### 4.1 Record filtering can remove part of the source

The current filter is:

```ts
.filter((task) => typeof task.title === "string" && task.title.trim())
```

Records that do not have a non-empty string title are removed from the transformed result.

If the same source array also contains at least one valid task, migration can continue and the complete legacy storage key can then be deleted.

This creates a verified partial-data-loss path:

```text
legacy array contains valid and rejected records
→ rejected records are filtered out
→ valid records are migrated
→ project-compass-tasks is deleted
→ rejected records are no longer recoverable from the legacy key
```

No warning, rejected-record count or migration report is produced.

### 4.2 Field normalization changes invalid or non-canonical values

The mapper can change source values by:

- generating a new UUID when `id` is not a string,
- replacing invalid task status with `backlog`,
- replacing non-string `description` with `undefined`,
- replacing non-string `ownerId` with `undefined`,
- generating new timestamps when `createdAt` or `updatedAt` are missing or non-string,
- discarding fields that are not explicitly emitted.

For data matching the verified historical legacy contract, most of these defensive branches should not normally be required.

For malformed or non-canonical data, however, migration can silently change semantics before the source is removed.

### 4.3 Source deletion occurs without explicit migration confirmation

Workspace calls:

```ts
saveProjectCompassState(updatedState);
localStorage.removeItem("project-compass-tasks");
```

`saveProjectCompassState()` returns `void`.

There is therefore no explicit success value used by the caller before source deletion.

There is also no read-back step between target write and source deletion.

Under the normal static flow, an already invalid or unsupported target state prevents migration from being reached because no active project can be resolved.

However, the code does not establish an invariant that source deletion is conditioned on verified persistence of the migrated target.

If the stored target changes between the initial state read and the later save check, or if future save behaviour can fail silently, the caller has no positive migration result to verify before deletion.

### 4.4 Successful target write followed by failed source deletion

If the target write succeeds but:

```ts
localStorage.removeItem("project-compass-tasks");
```

fails by throwing, the migrated target may already contain the tasks while the legacy source remains.

On a later Workspace load, the target task array is no longer empty.

The migration condition will therefore fail, and the legacy source can remain stranded indefinitely.

This is primarily a duplication/stale-data risk rather than immediate data loss.

### 4.5 Existing target tasks block migration

If:

```ts
currentActiveProject.tasks.length > 0
```

legacy tasks are not merged, transformed or deleted.

The source key can therefore remain indefinitely even when legacy data exists.

This avoids automatic overwrite of existing target tasks, but leaves no reconciliation path or user-visible explanation.

### 4.6 Entire-source parse failures are non-destructive but silent

If legacy JSON is malformed, not an array, missing, empty, or results in no accepted records, `loadLegacyTasks()` returns an empty array.

Migration is skipped and the source key is not deleted.

This preserves the raw source but provides no warning or recovery guidance.

### 4.7 No backup or rollback exists

The current task migration creates no backup of `project-compass-tasks`.

After successful source deletion, recovery depends entirely on the migrated target state or external/manual recovery.

There is no built-in rollback path.

## 5. Error and retry behaviour

The current migration has different retry behaviour depending on where failure occurs.

### 5.1 Missing or empty legacy source

If `project-compass-tasks` is missing or contains an empty string:

```ts
if (!savedTasks) {
  return [];
}
```

Migration is not attempted.

The source key is not deleted.

There is no user-visible warning.

### 5.2 Malformed JSON

If `JSON.parse(savedTasks)` throws, the `catch` block returns an empty array.

Migration is not attempted and the legacy key remains.

This preserves the raw source for a future recovery attempt, but the failure is silent.

### 5.3 Parsed source is not an array

If parsed legacy data is not an array, `loadLegacyTasks()` returns an empty array.

Migration is skipped and the source remains.

No diagnostic is produced.

### 5.4 All records are rejected

If every parsed record fails the title filter, the transformed result is empty.

Because:

```ts
legacyTasks.length > 0
```

is false, migration is skipped.

The legacy key remains.

### 5.5 Some records are accepted and some rejected

If at least one task survives the filter, migration can proceed.

Rejected records are not carried into the target.

If the target write succeeds and the legacy key is then removed, the rejected records cannot be retried from the original source.

This is the most direct verified retry-breaking data-loss path.

### 5.6 Target already contains tasks

If the active project already contains one or more tasks, migration is skipped.

The legacy source remains unchanged.

On later loads the same condition remains true unless the target task array becomes empty.

There is no merge or reconciliation behaviour.

### 5.7 Initial target is invalid or unsupported

`loadProjectCompassState()` returns an empty fallback state when the stored target is invalid or uses an unsupported schema version.

That fallback has no active project.

The Workspace effect therefore returns before `loadLegacyTasks()` is called.

Under this normal initial-state path:

- task migration does not start,
- target is not overwritten,
- legacy task source is not deleted.

### 5.8 Target write throws

`saveProjectCompassState()` does not catch exceptions from:

- `localStorage.getItem(...)`,
- `JSON.stringify(state)`,
- `localStorage.setItem(...)`.

If one of these throws during migration, execution stops before the following source deletion line is reached.

The legacy source therefore remains available for a later retry.

The page effect itself can still fail, so this protects source data but not necessarily the user experience.

### 5.9 Target save is silently blocked

`saveProjectCompassState()` can return without writing when the stored target is classified as `invalid` or `unsupported-version`.

The function returns `void`, so the caller cannot distinguish this from a successful save.

In the normal static flow, this specific state is detected earlier and prevents migration from being reached.

A remaining structural risk exists if the stored target changes between:

```text
initial loadProjectCompassState()
```

and:

```text
saveProjectCompassState(updatedState)
```

for example through another browsing context or other concurrent storage mutation.

In that case, save can be blocked while the caller continues to source deletion.

No read-back or save-result check prevents that sequence.

### 5.10 Source deletion throws after successful target write

If target persistence succeeds but `localStorage.removeItem("project-compass-tasks")` throws:

- target may already contain the migrated tasks,
- source may still exist,
- execution stops before React state updates complete.

On a later load, the target task array is non-empty.

The migration condition then prevents a second migration attempt and the legacy source can remain stranded.

### 5.11 Normal rerun after successful migration

After the normal successful path:

- target contains migrated tasks,
- `project-compass-tasks` has been removed.

On the next Workspace load, `loadLegacyTasks()` returns an empty array.

Migration does not run again.

This makes the normal successful path effectively one-time.

### 5.12 Retry summary

| Scenario | Target changed? | Legacy source deleted? | Automatic retry possible? |
|---|---|---|---|
| source missing/empty | no | no | not applicable |
| malformed JSON | no | no | yes, if source is repaired |
| parsed value not array | no | no | yes, if source is repaired |
| all records rejected | no | no | yes, if source is repaired |
| partial valid source + successful migration | yes | yes | no for rejected records |
| target already has tasks | no migration | no | only if target later becomes empty |
| initial target invalid/unsupported | no | no | yes after target recovery |
| target write throws | normally no completed write | no | yes |
| save silently blocked after concurrent target change | no verified write | can be yes | no if source was deleted |
| source deletion throws after successful write | yes | may remain | migration itself will normally not rerun |
| normal successful migration | yes | yes | no retry needed |

## 6. Existing automated test coverage

The current automated test suite does not contain a direct test of the legacy task migration.

### Vitest coverage

A search across current unit tests found no references to:

- `loadLegacyTasks`,
- `project-compass-tasks`,
- `ProjectBoardPage`.

This means there is no unit test that directly verifies:

- legacy task source parsing,
- record filtering,
- field transformation,
- migration conditions,
- source deletion,
- retry behaviour.

### Playwright coverage

Several Playwright tests navigate to Workspace and therefore execute the Workspace page code indirectly.

Relevant tests include:

- `landing-page.spec.ts`,
- `project-map-attention.spec.ts`,
- `task-responsibility.spec.ts`.

However, no Playwright test writes or seeds:

```text
project-compass-tasks
```

The strongest current Workspace coverage is `task-responsibility.spec.ts`.

Its `beforeEach` clears localStorage:

```ts
await page.evaluate(() => {
  window.localStorage.clear();
});
```

The tests then create a new current project through the UI and navigate to Workspace.

This means the Workspace effect reaches the migration decision with:

- a valid current project,
- an empty current task array,
- no legacy task source.

Therefore the migration condition is evaluated, but:

```ts
legacyTasks.length > 0
```

is false.

The actual migration block is not entered.

### Current protection level

Existing automated tests protect:

- Workspace navigation,
- Workspace empty state,
- task validation,
- creation and persistence of current tasks,
- task responsibility behaviour.

They do not currently protect:

- canonical legacy task migration,
- field preservation during migration,
- partial-record rejection behaviour,
- target persistence before source deletion,
- source retention on migration failure,
- rerun or retry behaviour,
- legacy source cleanup after verified migration.

### Test gap conclusion

There is currently no automated test that exercises the complete chain:

```text
project-compass-tasks
→ parse
→ transform
→ project-compass-state
→ source deletion
```

The migration therefore has no direct executable regression oracle today.

## 7. Migration oracle

The migration oracle must be built from verified product evidence, not from assumptions made by AI or from the current implementation alone.

### 7.1 Strongest source-side evidence

The strongest evidence for the legitimate legacy task source contract is the historical Project Compass code immediately before commit `d0e032d`.

That code defined:

```ts
type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  ownerId?: string;
};
```

The verified legacy status values were:

```ts
type TaskStatus =
  | "backlog"
  | "planned"
  | "in-progress"
  | "blocked"
  | "review"
  | "done";
```

The same historical Workspace implementation created tasks using those fields and persisted the task array to:

```text
project-compass-tasks
```

This historical producer type plus the actual legacy writer is the primary source-side oracle.

### 7.2 Current target contract

The current target contract is the `ProjectTask` type in `src/lib/projectStorage.ts`:

```ts
export type ProjectTask = {
  id: string;
  title: string;
  description?: string;
  status: ProjectTaskStatus;
  priority?: "low" | "medium" | "high";
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
};
```

The current `Project` type requires:

```ts
tasks: ProjectTask[];
```

This defines the target shape that migrated legacy data must satisfy.

### 7.3 Current transformation as implementation evidence

`loadLegacyTasks()` is evidence of what the current migration implementation actually does.

It is not, by itself, proof that every transformation is correct.

The current implementation must therefore be compared against:

- the historical source contract,
- the current target contract,
- verified product rules,
- executable tests once migration tests exist.

### 7.4 Product rules

Existing product documentation provides relevant semantic rules.

The responsibility model states that responsibility should be stored through:

```ts
ownerId?: string;
```

and that `ownerId` should refer to:

```ts
ProjectMember.id
```

This supports preserving a legitimate legacy `ownerId` relationship during migration.

However, documentation must be checked for age and consistency before being used as a technical oracle.

For example, some older documentation still shows an outdated three-value task status model.

Actual current code is therefore stronger evidence for current technical enums and structures.

### 7.5 Existing fixtures and tests

Current fixtures and automated tests provide secondary evidence for how current project and task data is used.

They are useful for:

- current-state shape,
- current task responsibility behaviour,
- persistence expectations,
- Workspace user flows.

They do not currently define legacy migration correctness because no existing automated test seeds `project-compass-tasks`.

### 7.6 Git history

Git history is part of the oracle because it establishes:

- when the legacy storage key was introduced,
- what task model wrote to that key,
- when `ownerId` was added,
- when centralized `ProjectTask` was introduced,
- when the Workspace migration was introduced.

Relevant verified commits include:

- `6ce3a45` – original Workspace legacy task storage,
- `9c1ca14` – task responsibility added before migration,
- `3c91462` – centralized project storage model introduced,
- `d0e032d` – Workspace task migration into active project introduced.

### 7.7 What is not an oracle

The following must not be treated as proof of correct migration behaviour:

- AI assumptions,
- TypeScript casts without runtime validation,
- the current mapper merely because it exists,
- generated build output,
- `.next` artifacts,
- an undocumented assumption that every current target field must have existed in legacy data,
- a green Workspace regression suite that never seeds legacy task storage.

### 7.8 Oracle conclusion

For Safe Task Legacy Migration, the preferred evidence order is:

```text
historical source producer and writer
→ current target TypeScript contract
→ verified product rules
→ current transformation implementation
→ Git history
→ relevant fixtures
→ direct migration tests
```

Once direct migration tests are added, they should encode behaviour derived from the verified source and target contracts rather than from unverified assumptions.

## 8. Ranked risks

The risks below are ranked by potential impact on user data, reversibility and likelihood within the verified current flow.

### Critical

#### 1. Partial-record migration can permanently delete rejected legacy tasks

A legacy source array can contain both accepted and rejected records.

The current filter removes tasks whose title is missing, non-string or empty.

If at least one other task survives:

```text
partial source
→ rejected records removed from transformed result
→ accepted records written to target
→ entire project-compass-tasks key deleted
```

The rejected records are then no longer recoverable from the legacy source.

This is a directly verified silent data-loss path.

#### 2. Source deletion is not conditioned on verified target persistence

The migration performs:

```ts
saveProjectCompassState(updatedState);
localStorage.removeItem("project-compass-tasks");
```

The save function returns `void` and no read-back verification occurs before deletion.

Under the normal static invalid/unsupported-target path, migration is prevented earlier because no active project is available.

However, the migration still lacks a positive persistence invariant between target write and irreversible source deletion.

This creates a structural data-safety risk if stored target state changes between the initial read and save, or if save behaviour later gains another silent failure path.

### High

#### 3. Non-canonical values can be silently transformed before source deletion

Invalid or unexpected values can be:

- replaced,
- normalized,
- defaulted,
- removed.

Examples include regenerated IDs, defaulted status and discarded unknown fields.

If migration then succeeds, the original representation is deleted without a migration report or backup.

#### 4. No direct automated migration regression test exists

Neither Vitest nor Playwright currently exercises the complete legacy task migration.

A destructive migration path therefore has no executable test that proves:

- canonical legacy fields are preserved,
- target persistence occurs,
- source deletion happens only in the expected case,
- rejected or failed migration data remains recoverable.

This increases the probability that future changes introduce or hide data-loss behaviour.

#### 5. No backup or rollback exists

Once the legacy source is deleted, Project Compass contains no built-in mechanism to restore it.

This magnifies the impact of any transformation or persistence defect.

### Medium

#### 6. Existing target tasks strand legacy source data

If the active project already contains tasks, migration does not run.

Legacy data is not merged and is not deleted.

This avoids destructive overwrite but can leave old source data indefinitely without explanation or reconciliation.

#### 7. Failed source deletion can leave duplicate or stale legacy data

If target persistence succeeds and source deletion fails, both representations can remain.

Because target tasks are now non-empty, later Workspace loads normally skip migration.

The legacy source can therefore remain stranded.

#### 8. Malformed or unsupported legacy source fails silently

Malformed JSON, non-array values and all-rejected arrays do not trigger destructive deletion.

The source remains recoverable, which limits impact.

However, there is no diagnostic or user-facing indication that migration did not occur.

### Low to Medium

#### 9. `priority` schema drift

The current mapper does not emit `priority`.

Historical verification found no evidence that the canonical product-generated legacy task source contained `priority`.

Therefore confirmed product-generated priority loss is not established.

If non-canonical legacy data contains `priority`, the field would still be discarded.

This remains a schema-drift risk rather than a verified historical data-loss defect.

### Overall risk conclusion

The strongest verified safety issue is not `priority`.

It is the combination of:

```text
record-level filtering
+
whole-source deletion
+
no backup
+
no direct migration test
```

This combination can produce silent and irreversible loss of rejected legacy task records.

The second major design risk is that source deletion is not tied to a positively verified migration result.

## 9. Minimum recommended next technical step

Do not change the production migration yet.

The minimum recommended next technical step is:

> Add one direct Playwright characterization test for the canonical legacy-task happy path before modifying migration behaviour.

The test should seed:

1. a valid current `project-compass-state`,
2. an active project whose `tasks` array is empty,
3. a canonical `project-compass-tasks` array matching the verified historical legacy contract.

The canonical legacy fixture should contain the verified source fields:

```ts
{
  id: string;
  title: string;
  description: string;
  status:
    | "backlog"
    | "planned"
    | "in-progress"
    | "blocked"
    | "review"
    | "done";
  ownerId?: string;
}
```

The test should then open Workspace and verify, at minimum, that:

- the migration is triggered,
- the legacy task appears in the active project's current `tasks` array,
- `id` is preserved,
- `title` is preserved,
- `description` is preserved,
- `status` is preserved,
- `ownerId` is preserved when supplied,
- `createdAt` is populated,
- `updatedAt` is populated,
- the migrated task survives a page reload,
- the legacy source key is removed only on the successful canonical path.

### Why this is the minimum next step

There is currently no executable regression oracle for legacy task migration.

A characterization test establishes a verified baseline using the historical source contract and current target contract before backup, rollback or migration safety logic is changed.

This keeps the next change:

- small,
- test-only,
- reviewable,
- reversible,
- directly connected to the highest-risk migration path.

### Explicit non-scope

This verification does not yet authorize implementation of:

- backup,
- rollback,
- new migration architecture,
- partial-record handling,
- migration reporting,
- changes to `saveProjectCompassState()`,
- source-deletion policy,
- risk migration,
- decision migration,
- Project Interview migration.

Those require steering group approval after this verification report.

## 10. AI Review #005 summary

AI Review #005 covers the verification work for:

```text
Data Unification Step 3
Safe Task Legacy Migration – Current Flow Verification
```

### AI used for

AI was used to support:

- narrowing repository searches to relevant source and test directories,
- reconstructing the historical legacy task model through Git history,
- comparing the historical source model with the current `ProjectTask` target model,
- tracing the migration control flow from Workspace mount to source deletion,
- identifying destructive and retry-sensitive branches,
- separating confirmed behaviour from assumptions,
- reviewing existing Vitest and Playwright coverage,
- structuring the field-by-field migration matrix,
- defining a migration oracle,
- ranking verified migration risks,
- proposing one minimum next technical step without implementing it.

### Human verification sources

AI conclusions were checked against:

- current source code in `src/app/project-board/page.tsx`,
- current source code in `src/lib/projectStorage.ts`,
- historical Git revisions,
- current test files,
- existing project documentation,
- terminal output from direct repository searches.

Generated `.next` output was not used as an authoritative source.

### Important corrected assumptions

Two earlier conclusions were refined during this verification.

#### Priority

An earlier verification described missing `priority` mapping as a concrete data-loss risk.

Historical code review showed that the verified legacy `Task` type and legacy task creation flow did not contain `priority`.

The corrected conclusion is:

- the current mapper does not emit `priority`,
- non-canonical stored priority would be discarded,
- but confirmed loss of a product-generated legacy priority value is not established.

#### Blocked save followed by source deletion

An early control-flow interpretation suggested that an already invalid or unsupported target could normally reach:

```ts
saveProjectCompassState(updatedState);
localStorage.removeItem("project-compass-tasks");
```

Further verification showed that an invalid or unsupported target causes `loadProjectCompassState()` to return an empty fallback state.

No active project can then be resolved, so Workspace returns before task migration begins.

The corrected conclusion is:

- the ordinary initial invalid/unsupported path does not delete legacy tasks,
- the structural risk remains because source deletion is not explicitly conditioned on a verified save result,
- this matters if stored target state changes between the initial read and save or if another silent save-failure path exists.

### Strongest verified finding

The strongest directly verified data-loss path is:

```text
legacy source contains both accepted and rejected records
→ rejected records are filtered out
→ at least one valid record survives
→ valid records are migrated
→ entire legacy source key is deleted
→ rejected records are no longer recoverable from that source
```

This risk is stronger than the earlier `priority` concern because it follows directly from the current filter, migration condition and source deletion behaviour.

### AI limitations

AI was not treated as the migration oracle.

In particular:

- AI assumptions were not accepted without code or history evidence,
- current TypeScript casts were not treated as runtime proof,
- the current mapper was not assumed to define correct behaviour merely because it exists,
- current target fields were not assumed to have existed in legacy data,
- green Workspace tests were not treated as legacy migration tests when they did not seed the legacy source.

### Status

AI Review #005 remains open pending steering group review of this verification.

No production-code migration change, backup, rollback or new migration implementation has been made in this step.
