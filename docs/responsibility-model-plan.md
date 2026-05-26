# Project Compass – Responsibility Model Plan

## 1. Background

Project Compass is evolving from a single-project MVP into a small project platform.

The app now supports:

- Multiple saved projects
- Active project selection
- Project overview
- Project members
- Members shown in the status report
- Playwright coverage for project overview and project members

The next step is to connect project work to people.

A project is not only a list of tasks, risks and decisions. It also needs responsibility. Without responsibility, the user may understand what exists in the project but not who owns the next action.

The purpose of this plan is to define how Project Compass should handle responsibility before we start implementing it.

---

## 2. Why Responsibility Matters

In real projects, unclear responsibility is one of the most common causes of slow progress.

A task without an owner can be forgotten.  
A risk without an owner can remain unhandled.  
A decision without an owner can block the project.  
A status report without responsibility can show information but not drive action.

Project Compass should help the user answer:

- Who owns this task?
- Who follows up this risk?
- Who is responsible for this decision?
- Which responsibilities are missing?
- What should be followed up next?

The goal is not to create a complex permission system. The goal is to make ownership visible and useful.

---

## 3. Product Principle

Responsibility in Project Compass should follow one simple principle:

> Every important project item should be able to have one responsible member.

This applies to:

- Tasks
- Risks
- Decisions

The first version should stay simple:

- One responsible member per item
- Optional ownership
- Clear display of responsibility
- No permissions
- No user accounts
- No advanced team management

This keeps the feature aligned with the core idea of Project Compass:

- Purpose
- Goals
- Deliverables
- Risks
- Decisions
- Members
- Responsibility
- Status
- Next steps

---

## 4. Data Model

Responsibility should be stored by connecting an item to a project member.

The technical link should be:

```ts
ownerId?: string;
```

The `ownerId` should refer to:

```ts
ProjectMember.id
```

This means that tasks, risks and decisions do not store the member name directly. They store the member ID.

This is better because:

- The member name can change later.
- The same member can own several items.
- The status report can look up the member by ID.
- Future features can reuse the same relationship.

---

## 5. Responsibility for Tasks

Tasks should be able to have an optional responsible member.

Suggested task structure:

```ts
type ProjectTask = {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority?: "low" | "medium" | "high";
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
};
```

### User Flow

The user should be able to:

1. Open the project workspace.
2. Create or view a task.
3. Select a responsible member from the active project.
4. Save the task.
5. See the responsible member on the task card.
6. See task responsibility in the status report.

### Empty State

If the active project has no members, the UI should explain:

> Add project members before assigning responsibility.

The app should not block the user from creating tasks without members. Ownership should be helpful, not mandatory.

---

## 6. Responsibility for Risks

Risks should be able to have an optional responsible member.

Suggested risk structure:

```ts
type ProjectRisk = {
  id: string;
  title: string;
  description?: string;
  probability?: "low" | "medium" | "high";
  impact?: "low" | "medium" | "high";
  mitigation?: string;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
};
```

### User Flow

The user should be able to:

1. Open the risk view.
2. Add or view a risk.
3. Select a responsible member.
4. Save the risk.
5. See the responsible member on the risk card.
6. See risk responsibility in the status report.

### Product Purpose

Risk ownership is important because a risk without follow-up can become a problem.

The status report should make open risks with owners visible.

---

## 7. Responsibility for Decisions

Decisions should be able to have an optional responsible member.

Suggested decision structure:

```ts
type ProjectDecision = {
  id: string;
  title: string;
  description?: string;
  decidedBy?: string;
  ownerId?: string;
  date?: string;
  createdAt: string;
  updatedAt: string;
};
```

### User Flow

The user should be able to:

1. Open the decision view.
2. Add or view a decision.
3. Select a responsible member.
4. Save the decision.
5. See the responsible member on the decision card.
6. See decision responsibility in the status report.

### Product Purpose

Decision ownership should help answer:

- Who is responsible for following up this decision?
- Who needs to act on it?
- Which decisions are still open?

---

## 8. Status Report

The status report should gradually become the main communication artifact for a project.

Responsibility should appear in the report in a way that helps the user understand the current situation.

The report should show:

- Project members
- Number of members
- Tasks and their responsible members
- Risks and their responsible members
- Decisions and their responsible members
- Items without responsibility, where useful

The first version does not need advanced charts or grouping. A simple, readable display is enough.

### Suggested Report Sections

The status report could eventually include:

- Project summary
- Project members
- Task status
- Risks
- Decisions
- Responsibility overview
- Recommended next steps

### Possible Responsibility Overview

A future section could show:

```txt
Responsibility Overview

Johan Larsson
- 2 tasks
- 1 risk
- 1 decision

Unassigned
- 3 tasks
- 2 risks
```

This is not required in the first implementation but should guide the direction.

---

## 9. Acceptance Criteria

### 9.1 General Responsibility

- A project item can have an optional `ownerId`.
- `ownerId` refers to a member in the active project.
- If no member is selected, the item remains unassigned.
- The app should not crash if an owner is missing.
- The app should not crash if a member no longer exists.

### 9.2 Task Responsibility

- A task can be assigned to a project member.
- The assigned member is visible on the task card.
- The assignment persists after reload.
- The assigned member can be shown in the status report.

### 9.3 Risk Responsibility

- A risk can be assigned to a project member.
- The assigned member is visible on the risk card.
- The assignment persists after reload.
- The assigned member can be shown in the status report.

### 9.4 Decision Responsibility

- A decision can be assigned to a project member.
- The assigned member is visible on the decision card.
- The assignment persists after reload.
- The assigned member can be shown in the status report.

### 9.5 Status Report

- The status report shows project members.
- The status report shows responsibility where available.
- The status report handles unassigned items clearly.
- The report remains useful even if no members have been added.

---

## 10. Test Strategy

Responsibility affects several flows and should be tested carefully.

### 10.1 Existing Regression Tests

The existing tests should continue to pass:

```bash
npx playwright test tests/projects-overview.spec.ts --project=chromium
npx playwright test tests/project-members.spec.ts --project=chromium
npx playwright test tests/landing-page.spec.ts
npx playwright test tests/main-flow.spec.ts --project=chromium
```

### 10.2 New Playwright Tests

New tests should be added gradually.

Suggested test files:

```txt
tests/task-responsibility.spec.ts
tests/risk-responsibility.spec.ts
tests/decision-responsibility.spec.ts
```

### 10.3 First Test Focus

The first responsibility test should focus on tasks.

Suggested scenario:

1. Create a project.
2. Add a project member.
3. Go to workspace.
4. Create a task.
5. Assign the task to the member.
6. Reload the page.
7. Confirm that the task still shows the responsible member.
8. Go to status report.
9. Confirm that responsibility is visible there.

### 10.4 Manual Testing

Manual testing should focus on:

- Can the user understand what responsibility means?
- Is it clear when no members exist?
- Is it clear when an item has no owner?
- Does the selected owner persist after reload?
- Does the status report remain readable?

---

## 11. Risks

### 11.1 Mixing Old and New Storage

Some current pages still use older localStorage keys, while the new platform structure uses:

```txt
project-compass-state
```

This creates a risk that responsibility data becomes split between old and new structures.

Mitigation:

- Introduce responsibility carefully.
- Prefer using `projectStorage.ts`.
- Avoid spreading new localStorage logic across pages.
- Gradually migrate old views to the new project structure.

### 11.2 Scope Creep

Responsibility can easily grow into permissions, accounts, notifications or team management.

Mitigation:

- Keep the first version simple.
- Use one optional owner per item.
- Do not add user accounts.
- Do not add permissions.
- Do not add notifications.

### 11.3 Broken References

If a member is removed later, an item may still reference that member's ID.

Mitigation:

- For now, do not implement member deletion.
- Later, handle deleted members safely.
- Show "Unknown member" or "Unassigned" if an owner cannot be found.

### 11.4 UI Complexity

Adding owner selection to tasks, risks and decisions may make the UI feel crowded.

Mitigation:

- Use simple select fields.
- Show responsibility only where it helps.
- Avoid adding too many controls at once.

---

## 12. Implementation Plan

### Phase 1: Task Responsibility

- Update task data model if needed.
- Load active project members in workspace.
- Add owner selection when creating or editing a task.
- Show responsible member on task cards.
- Save assignment in localStorage.
- Add Playwright test for task responsibility.

### Phase 2: Risk Responsibility

- Load active project members in risk view.
- Add owner selection to risk form.
- Show responsible member on risk cards.
- Save assignment in localStorage.
- Update status report.
- Add Playwright test for risk responsibility.

### Phase 3: Decision Responsibility

- Load active project members in decision view.
- Add owner selection to decision form.
- Show responsible member on decision cards.
- Save assignment in localStorage.
- Update status report.
- Add Playwright test for decision responsibility.

### Phase 4: Status Report Responsibility Overview

- Add responsibility summary to status report.
- Show assigned and unassigned items.
- Keep the layout readable.
- Add test coverage for responsibility in the report.

---

## 13. Definition of Done

The responsibility model is considered done when:

- Tasks can be assigned to members.
- Risks can be assigned to members.
- Decisions can be assigned to members.
- Assigned responsibility is visible in the relevant views.
- Assigned responsibility is visible in the status report.
- Unassigned items are handled clearly.
- Existing regression tests pass.
- New responsibility tests pass.
- Documentation is updated if the data model changes.
- The feature still supports the core purpose of Project Compass: helping users think clearly about projects, not just manage cards.