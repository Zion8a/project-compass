# Project Compass – Project Platform Roadmap

## 1. Background

Project Compass started as a small project application and project model developed during the course *Practical Project Work in Software Testing* at EC Utbildning.

The idea came from working with project methods, test planning, test processes, scope, test goals, test strategy, area tours, test suites, test cases, bug reports, regression test suites and presentation of test results.

During the group project, tools such as Trello and Taiga were useful, but their free-tier limitations also revealed a clear problem: many project tools quickly become either too restricted, too complex, or too focused on boards and tasks before the project itself has been properly understood.

Project Compass is not intended to be a copy of Trello, Jira, Taiga or Reqtest. Its strength should be that it helps the user think clearly before a project turns into a board full of cards.

Project Compass should help teams turn unclear work into a manageable project.

The current MVP already includes:

* Landing page
* Project interview
* My Projects overview
* Example project/demo data
* Project map
* Project workspace / board view
* Members view
* Risk view
* Decision view
* Status report
* Shared application header and navigation
* localStorage-based data persistence
* Active project handling
* Responsibility model for tasks, risks and decisions
* Attention Needed
* Project Health
* Project Health reasons
* Project Health Score
* Improved Project Health summary text
* Recommended Next Step logic
* Traceability-based Recommended Next Step for high risks without linked tasks
* Traceability-based Recommended Next Step for open decisions without linked tasks
* Recommended Next Step in Status Report and Markdown export
* Project Health Score in Status Report and Markdown export
* Project Health scenario tests for Stable, Needs attention and At risk
* Playwright test coverage for traceability-based Recommended Next Step behavior for high risks and open decisions
* Risk-to-task traceability
* Decision-to-task traceability
* Markdown status report export
* Playwright E2E tests
* GitHub Actions CI
* Public GitHub repository with QA/portfolio-focused README
* Public Vercel deployment

Project Compass has evolved from an app for one active project into a small project platform where the user can create, save, open and manage multiple projects.

This platform direction makes Project Compass more useful, more realistic and stronger as a portfolio project. It shows product thinking, project management, frontend development, QA, test automation and documentation in one coherent application.

---

## 2. Problem We Are Solving

Many small projects fail because the team does not lack effort, but clarity.

The current version has moved beyond the original single-project MVP and now supports several saved projects, one active project, project members, responsibility, Attention Needed, Project Health, Project Health Score, traceability between project objects and recommended next steps in the Status Report, including traceability-based recommendations for high risks and open decisions without linked tasks.

The product should continue to solve the following problems:

* The user needs a clear overview of saved projects.
* The user needs a reliable concept of one active project.
* Project data must be clearly separated per project.
* Project members need to be a structured part of each project.
* Tasks, risks and decisions need clear ownership.
* Items without ownership need to be visible.
* Risks and decisions should be connected to the work they affect.
* The status report should show ownership, team structure, accountability, risk, decisions, traceability, health reasons, health score and next steps.
* The app should become less of a single workflow and more of a reusable project clarity platform.

Project Compass should help users answer questions such as:

* Why are we doing this project?
* What should improve?
* What should be delivered?
* Who is involved?
* Who is responsible for what?
* What is blocked?
* Which risks need attention?
* Which decisions are still open?
* Which tasks are affected by risks or decisions?
* How healthy is the project right now?
* Why does the project have that health status?
* What should happen next?

The main problem is not task management alone.

The main problem is project clarity.

---

## 3. Product Principles

### 3.1 Think Before Tracking

Project Compass should help the user clarify the project before tasks are created.

The app should support structured thinking around purpose, goals, deliverables, scope, risks, decisions, members, responsibilities, traceability, status and next steps.

### 3.2 Clarity Before Complexity

Every feature should make the project easier to understand.

If a feature adds complexity without improving clarity, responsibility, risk awareness, decision tracking, status, traceability or testability, it should wait.

### 3.3 Simple Before Advanced

The application should stay understandable and lightweight.

Every feature should answer a real project need. Features should not be added only because larger project tools have them.

### 3.4 Project Model First

The data model should support the project logic.

Instead of only adding UI screens, the app should gradually develop a clear internal project model.

### 3.5 Responsibility Must Be Visible

Tasks, risks and decisions should clearly show ownership.

Items without an owner should still be allowed, but they should be easy to find and clearly shown as needing attention.

### 3.6 Relationships Should Be Understandable

Project Compass should show why something matters.

Risks and decisions become more useful when they are connected to the tasks they affect.

Future versions should continue to improve traceability by connecting:

* tasks to goals
* tasks to deliverables
* risks to tasks
* decisions to tasks
* decisions to risks
* status report content to real project relationships

### 3.7 Status Should Be Generated From Project Data

The status report should not only be free text.

It should summarize real project information:

* project purpose
* goals
* deliverables
* members
* tasks
* blocked tasks
* risks
* decisions
* responsibilities
* missing owners
* relationships between project objects
* Attention Needed
* Project Health
* Project Health Score
* Project Health reasons
* Recommended Next Step

### 3.8 QA Mindset

Each change should be designed with testing in mind.

Before building a feature, we should consider user flow, data structure, edge cases, acceptance criteria, regression risks and Playwright test impact.

### 3.9 Portfolio Quality

Project Compass is also a QA and software testing portfolio project.

The repository should demonstrate structured product thinking, clear documentation, incremental development, version control discipline, testable acceptance criteria, manual testing, Playwright E2E testing, CI through GitHub Actions, risk-based thinking and professional README/documentation.

---

## 4. Proposed Data Model

The data model should support several saved projects and one active project.

Because the current application uses localStorage, the first platform version should continue with localStorage. The structure should still be designed so that it could later be moved to a backend or database.

### 4.1 App-Level State

```ts
type ProjectCompassState = {
  activeProjectId: string | null;
  projects: Project[];
};
```

Suggested localStorage key:

```ts
project-compass-state
```

This makes it possible to store multiple projects, open a selected project, track the active project, keep project data separated, add members per project, connect responsibility to tasks, risks and decisions, connect risks and decisions to related tasks, add Attention Needed, calculate Project Health, show Project Health reasons, show Project Health Score and recommend next steps.

### 4.2 Project

```ts
type Project = {
  id: string;
  name: string;
  description?: string;
  purpose?: string;
  desiredOutcome?: string;
  status: "not-started" | "in-progress" | "at-risk" | "completed";
  createdAt: string;
  updatedAt: string;

  interview?: ProjectInterview;
  map?: ProjectMap;

  members: ProjectMember[];
  goals: ProjectGoal[];
  deliverables: ProjectDeliverable[];
  tasks: ProjectTask[];
  risks: ProjectRisk[];
  decisions: ProjectDecision[];

  statusNotes?: string;
};
```

### 4.3 Project Member

```ts
type ProjectMember = {
  id: string;
  name: string;
  role?: string;
  responsibility?: string;
  email?: string;
  comment?: string;
  createdAt: string;
  updatedAt: string;
};
```

### 4.4 Project Goal

```ts
type ProjectGoal = {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};
```

### 4.5 Project Deliverable

```ts
type ProjectDeliverable = {
  id: string;
  title: string;
  description?: string;
  ownerId?: string;
  status: "not-started" | "in-progress" | "done";
  createdAt: string;
  updatedAt: string;
};
```

### 4.6 Project Task

```ts
type ProjectTask = {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "blocked" | "done";
  priority?: "low" | "medium" | "high";
  ownerId?: string;
  linkedGoalId?: string;
  linkedDeliverableId?: string;
  createdAt: string;
  updatedAt: string;
};
```

### 4.7 Project Risk

Current implemented model uses `relatedTaskId` for task traceability.

```ts
type ProjectRisk = {
  id: string;
  title: string;
  description?: string;
  probability?: "low" | "medium" | "high";
  impact?: "low" | "medium" | "high";
  action?: string;
  owner?: string;
  ownerId?: string;
  relatedTaskId?: string;
  status: ProjectRiskStatus;
  createdAt: string;
  updatedAt: string;
};
```

The original long-term model used `linkedTaskId`. Future cleanup may standardize naming, but the current MVP uses `relatedTaskId`.

### 4.8 Project Decision

Current implemented model uses `relatedTaskId` for task traceability.

```ts
type ProjectDecision = {
  id: string;
  title: string;
  description?: string;
  owner?: string;
  ownerId?: string;
  relatedTaskId?: string;
  deadline?: string;
  consequence?: string;
  status: ProjectDecisionStatus;
  createdAt: string;
  updatedAt: string;
};
```

Future versions may add `linkedRiskId` or a more general relationship model.

### 4.9 Attention Needed

Attention Needed is calculated from existing project data.

```ts
type AttentionItem = {
  id: string;
  title: string;
  text: string;
  severity: "medium" | "high";
};
```

Examples of attention rules:

* task has no owner
* task is blocked
* risk has no owner
* risk has high probability or high impact
* decision has no owner
* decision is still open

### 4.10 Project Health

Project Health is calculated from project data.

Current implemented model:

```ts
type ProjectHealth = {
  level: "stable" | "needs-attention" | "at-risk";
  title: "Stable" | "Needs attention" | "At risk";
  summary: string;
  reasons: string[];
  score: number;
};
```

The current logic is intentionally simple and based on project signals such as:

* blocked tasks
* high risks
* open decisions
* attention items
* missing ownership

The Status Report now shows:

* Project Health level
* Project Health Score
* main reasons behind the current health level
* improved Project Health summary text
* Recommended Next Step

The Project Health Score starts at 100 and is reduced when the active project contains attention signals.

Current MVP scoring logic:

* High severity attention item: -15
* Medium severity attention item: -5
* Minimum score: 0
* Maximum score: 100

Examples of Project Health reasons:

* 1 blocked task
* 2 high risks
* 1 open decision
* Some tasks, risks or decisions are missing clear ownership
* No current attention signals

Project Health scenario tests now verify that the app can show:

* Stable
* Needs attention
* At risk

Project Health Score is not intended to be an exact project performance metric. It is a simple rule-based MVP indicator designed to make project signals easier to understand and discuss.

### 4.11 Recommended Next Step

Recommended Next Step is calculated from project data.

```ts
type RecommendedNextStep = {
  title: string;
  text: string;
};
```

The current logic prioritizes:

* blocked tasks
* high risks without linked tasks
* high risks
* open decisions without linked tasks
* open decisions
* missing ownership
* missing tasks
* missing members
* checkpoint preparation when no urgent signals exist

When a high risk is not connected to a related task, Project Compass recommends linking that risk to the concrete work it may affect. This strengthens the connection between risk management, traceability and project leadership.

When an open decision is not connected to a related task, Project Compass recommends linking that decision to the concrete work it affects. This strengthens decision follow-up, traceability and project leadership.

The recommendation is currently shown in:

* Status Report
* Markdown export

This helps the Status Report become more than a list of project information. It gives the project leader a clear suggested next action.

### 4.12 Shared Project Insight Logic

Attention Needed, Project Health, Project Health Score and Recommended Next Step are calculated through shared project insight logic in `src/lib/projectInsights.ts`.

This helper currently contains:

* `getAttentionItems(project)`
* `getProjectHealth(project, attentionItems)`
* `getRecommendedNextStep(project, attentionItems)`

The purpose of this shared logic is to make sure that Project Map, Status Report and My Projects can use the same interpretation of project data.

This reduces duplicated logic, lowers the risk of inconsistent project status between views, and prepares the app for future improvements such as richer health explanations, improved score rules, recommended next steps based on traceability gaps, shared dashboard summaries, health indicators in My Projects and future QA/test summary insights.

This is an important maintainability step because Project Compass should not only display project information, but interpret project signals in a consistent and testable way.

This makes the app act more like a project compass: it helps the project leader understand what should happen next.

---

## 5. User Stories

### 5.1 Project Overview

As a user, I want to see all my saved projects, so that I can choose which project to continue working on.

### 5.2 Create Project

As a user, I want to create a new project, so that I can start a separate project with its own data.

### 5.3 Open Project

As a user, I want to open an existing project, so that I can continue working with the correct project data.

### 5.4 Active Project

As a user, I want the app to remember which project is active, so that I do not accidentally work in the wrong project.

### 5.5 Project Members

As a user, I want to add members to a project, so that the project has a clear team structure.

### 5.6 Member Responsibilities

As a user, I want to describe each member's role and responsibility, so that it is clear who does what.

### 5.7 Task Ownership

As a user, I want to connect tasks to members, so that work can have a responsible person.

### 5.8 Risk Ownership

As a user, I want to connect risks to members, so that each risk can have someone responsible for follow-up.

### 5.9 Decision Ownership

As a user, I want to connect decisions to members, so that important decisions have responsibility.

### 5.10 Risk-to-Task Traceability

As a project leader, I want to connect a risk to a related task, so that I can understand which concrete work the risk may affect.

### 5.11 Decision-to-Task Traceability

As a project leader, I want to connect a decision to a related task, so that I can understand which concrete work the decision affects.

### 5.12 Attention Needed

As a project leader, I want to see tasks, risks and decisions that need attention, so that I know what to act on first.

### 5.13 Project Health

As a project leader, I want to see a simple project health indicator, so that I can quickly understand if the project is stable, needs attention or is at risk.

### 5.14 Project Health Reasons

As a project leader, I want to see the main reasons behind the project health status, so that I understand why the project is considered stable, needs attention or is at risk.

### 5.15 Project Health Score

As a project leader, I want to see a simple Project Health Score, so that I can quickly understand how many attention signals are affecting the project.

The score should support the health level and main reasons, not replace them.

### 5.16 Recommended Next Step

As a project leader, I want the app to recommend a next step, so that I know what to act on after reviewing the project status.

### 5.17 Improved Status Report

As a user, I want the status report to summarize the project clearly, so that I can share project status with a teacher, mentor, stakeholder or recruiter.

### 5.18 Future Export

As a user, I want to export project data and status reports, so that I can document progress outside the app.

### 5.19 Future QA Module

As a QA-focused user, I want to add test cases, bugs and test summaries, so that Project Compass can also support simple test leadership.

---

## 6. Acceptance Criteria

### 6.1 Multiple Projects

* The user can create more than one project.
* Each project has a unique ID.
* Each project has a name.
* Each project stores its own project data.
* Projects are saved in localStorage.
* Reloading the browser does not remove saved projects.
* The user can return to a previous project.

### 6.2 My Projects Overview

* A page called "My Projects" exists.
* The page lists all saved projects.
* Each project card shows project name, project status or health and last updated date.
* The user can open a project from the project overview.
* The active project is visually clear.
* The overview helps the user understand where to continue.
* If there are no projects, the page shows a helpful empty state.
* The user can create an example project with demo data.

### 6.3 Active Project

* The application stores an `activeProjectId`.
* When a project is opened, it becomes the active project.
* Project-specific pages use the active project data.
* Views such as workspace, risks, decisions and status report only show data for the active project.
* If no active project exists, the user is guided to create or open a project.

### 6.4 Project Members

* A project can have members.
* A member has at least a name.
* A member can optionally have role, responsibility, email and comment.
* Members belong to one project.
* Members are saved in localStorage.
* Reloading the browser does not remove members.
* A project with no members shows a helpful empty state.

### 6.5 Responsibility

* Tasks can have an assigned member.
* Risks can have an assigned member.
* Decisions can have an assigned member.
* Items without an owner are still allowed, but should be visible as needing attention.
* Owner names should be shown in relevant views.
* Missing ownership should be shown directly in the relevant work view.
* If a member is removed in the future, ownership should be handled safely.

### 6.6 Traceability

* Risks can be linked to related tasks.
* Decisions can be linked to related tasks.
* Linked objects are visible in the relevant cards.
* Project Map shows risk-to-task relationships.
* Project Map shows decision-to-task relationships.
* Project Map distinguishes linked and unlinked risks.
* Project Map distinguishes linked and unlinked decisions.
* Status Report includes linked risk and decision objects.
* Markdown export includes linked risk and decision objects.
* Existing objects without links still work safely.

### 6.7 Attention Needed

* The app shows a section for Attention Needed.
* The section includes blocked tasks.
* The section includes tasks without owners.
* The section includes risks without owners.
* The section includes high risks.
* The section includes decisions without owners.
* The section includes open decisions.
* Attention items show severity as High or Medium.
* If there are no attention items, the app shows a positive empty state.

### 6.8 Project Health

* The app calculates project health from project data.
* The possible health states are Stable, Needs attention and At risk.
* The health state is shown on Project Map.
* The health state is shown in the My Projects overview.
* The health state is shown in the Status Report.
* The health explanation includes the main reasons or a clear summary.
* The Markdown export includes main Project Health reasons.
* The health score is shown in the Status Report.
* The health score is included in the Markdown export.
* The health score is tested through the Status Report Markdown export test.
* Stable Project Health behavior is tested through Playwright.
* Needs attention Project Health behavior is tested through Playwright.
* At risk Project Health behavior is tested through Playwright.
* The health score is clearly described as a simple rule-based MVP indicator.

### 6.9 Recommended Next Step

* The app calculates a recommended next step from project data.
* Blocked tasks are prioritized before other signals.
* High risks without linked tasks are prioritized before general high risk review.
* High risks are prioritized before open decisions.
* Open decisions without linked tasks are prioritized before general open decision review.
* Open decisions are prioritized before missing ownership.
* Missing ownership is shown as a useful next action when relevant.
* Stable projects receive a checkpoint-oriented recommendation.
* The recommendation is shown in the Status Report.
* The recommendation is included in the Markdown export.
* Recommended Next Step behavior is covered by Playwright in the Status Report Markdown export test.
* Traceability-based Recommended Next Step behavior for high risks and open decisions is covered by a focused Playwright test.

### 6.10 Improved Status Report

* The status report includes project purpose.
* The status report includes goals and deliverables when available.
* The status report includes project members.
* The status report includes tasks.
* The status report includes risks.
* The status report includes decisions.
* The status report includes blocked items.
* The status report includes responsibilities.
* The status report includes Attention Needed.
* The status report includes Project Health.
* The status report includes Project Health Score.
* The status report includes main Project Health reasons.
* The status report includes risk-to-task links.
* The status report includes decision-to-task links.
* The status report includes Recommended Next Step.
* The status report can recommend linking high risks to affected tasks.
* The status report can recommend linking open decisions to affected tasks.
* The Markdown export includes Project Health Score.
* The report can be copied or exported as Markdown.
* The report should be useful as a real project communication artifact.

### 6.11 Testing

* Existing Playwright tests should continue to pass.
* New core flows should be covered by Playwright tests when relevant.
* At minimum, tests should cover landing page, main flow, project creation, project persistence, member creation, responsibility, Attention Needed, Project Health, Project Health Score, Project Health reasons, Project Health scenarios, Recommended Next Step, traceability-based recommendations, traceability and Markdown export.

### 6.12 Future Export

* The user can export a project as JSON.
* The user can export the status report as Markdown.
* Exported data should belong only to the selected project.
* Export should not break existing localStorage data.

### 6.13 Future QA Module

* The user can create test cases.
* A test case can have status, priority and steps.
* A test case can be linked to a task, goal or deliverable.
* The user can create bug or issue records.
* The user can create a simple test summary.
* QA data should appear in the status report when relevant.

---

## 7. Test Strategy

Project Compass should be tested as both a product and a QA portfolio project.

The test strategy should combine:

* manual exploratory testing
* structured manual test cases
* regression testing
* Playwright E2E tests
* GitHub Actions CI
* documentation updates

### 7.1 Regression Testing

Existing tests should be run after each major change:

```bash
npx playwright test tests/landing-page.spec.ts
npx playwright test tests/main-flow.spec.ts --project=chromium
```

If the shared navigation or project data flow changes, the full Playwright suite should be run:

```bash
npx playwright test
```

### 7.2 Manual Testing

Manual testing should be used for new UI flows, empty states, form validation, confusing user flows, project switching, localStorage behavior, status report review and visual inspection.

Manual tests should cover happy path, edge cases, negative cases, empty projects, projects with no members, projects with blocked tasks, projects with high risks, projects with open decisions, projects with missing ownership, projects with linked and unlinked risks/decisions, page reload, project switching and Markdown export.

### 7.3 Playwright Tests

Playwright should focus on the most important user flows.

Current important Playwright coverage includes:

* landing page loads
* create project
* select active project
* create example project
* add project members
* create task
* assign task owner
* create risk
* assign risk owner
* create decision
* assign decision owner
* show Attention Needed
* show Project Health
* show Project Health reasons in Status Report
* show Project Health Score in Status Report
* show Project Health scenarios for Stable, Needs attention and At risk
* show Recommended Next Step in Status Report
* show traceability-based Recommended Next Step for high risks without linked tasks
* show traceability-based Recommended Next Step for open decisions without linked tasks
* show traceability in Project Map
* show traceability in Status Report
* generate status report
* copy Markdown report
* verify Project Health Score in Markdown export
* verify Project Health scenarios for Stable, Needs attention and At risk
* verify Recommended Next Step in Markdown export
* verify traceability-based Recommended Next Step behavior
* handle no active project

Suggested test files:

```txt
tests/projects-overview.spec.ts
tests/project-members.spec.ts
tests/task-responsibility.spec.ts
tests/risk-responsibility.spec.ts
tests/decision-responsibility.spec.ts
tests/project-map-attention.spec.ts
tests/project-health-scenarios.spec.ts
tests/recommended-next-step-traceability.spec.ts
tests/status-report-markdown.spec.ts
```

Playwright should not test every small visual detail.

The goal is to cover important behavior and prevent regressions.

### 7.4 Suggested Test Scenarios

#### Project Overview

* User can navigate to My Projects.
* User can see the project overview page.
* User can create a new project.
* New project appears in the project list.
* User can create an example project.
* User can open a project.
* Active project is clearly shown.

#### Persistence

* User creates a project.
* User reloads the page.
* The project still exists.
* The same project can be opened again.

#### Members

* User opens a project.
* User navigates to Members.
* User adds a member.
* Member appears in the member list.
* Member remains after reload.

#### Responsibility

* User assigns a member to a task.
* User assigns a member to a risk.
* User assigns a member to a decision.
* Assigned responsibility is shown in the relevant view.
* Missing responsibility is shown as needing owner.

#### Traceability

* User creates a task.
* User creates a risk and links it to the task.
* User creates a decision and links it to the task.
* Risk View shows the related task.
* Decision View shows the related task.
* Project Map shows linked and unlinked risks.
* Project Map shows linked and unlinked decisions.
* Status Report shows which task a risk affects.
* Status Report shows which task a decision affects.
* Markdown export includes the linked task information.

#### Attention Needed

* User creates a task without an owner.
* User creates a blocked task.
* User creates a high risk.
* User creates an open decision.
* Attention Needed shows the relevant items.
* When all issues are handled, a positive empty state is shown.

#### Project Health

* Empty or low-risk project shows Stable or Needs attention depending on rules.
* Project with some open issues shows Needs attention.
* Project with several blocked tasks or high risks shows At risk.
* Health explanation shows the reasons.
* Project Health Score is shown in the Status Report.
* Project Health Score is included in the Markdown export.
* Project Health Score matches the attention signals used by the current MVP rules.
* Markdown export includes health reasons.
* Project Health scenario tests cover Stable.
* Project Health scenario tests cover Needs attention.
* Project Health scenario tests cover At risk.

#### Recommended Next Step

* A project with blocked tasks recommends resolving blocked work.
* A project with a high risk without a linked task recommends linking high risks to affected tasks.
* A project with high risks recommends reviewing high risks.
* A project with an open decision without a linked task recommends linking open decisions to affected tasks.
* A project with open decisions recommends closing open decisions.
* A project with missing ownership recommends assigning ownership.
* A stable project recommends preparing the next checkpoint.
* The traceability-based recommendation explains why high risks and open decisions should be connected to concrete work.
* Markdown export includes the same recommendation as the UI.

#### Status Report

* User adds members, tasks, risks and decisions.
* User opens the Status Report.
* Status Report shows members and responsibilities.
* Status Report shows Attention Needed.
* Status Report shows Project Health.
* Status Report shows Project Health Score.
* Status Report shows main Project Health reasons.
* Status Report shows Recommended Next Step.
* Status Report shows traceability-based Recommended Next Step when high risks are not linked to concrete work.
* Status Report shows traceability-based Recommended Next Step when open decisions are not linked to affected tasks.
* Status Report shows traceability.
* Status Report gives a useful project overview.
* Markdown export includes the same important project information.

### 7.5 Risk-Based Testing

High-risk areas should be tested first.

Important risks:

* data from different projects is mixed
* active project is lost after reload
* localStorage data becomes invalid
* owner assignment breaks when members change
* status report shows wrong project data
* Attention Needed misses important items
* Project Health gives a misleading status
* Project Health Score gives a misleading sense of precision
* Project Health reasons do not match the project data
* Project Health scenario behavior regresses when insight logic changes
* Recommended Next Step is misleading or too generic
* traceability-based recommendations do not appear when they should
* high risks without linked tasks are not detected
* open decisions without linked tasks are not detected
* linked risks or decisions point to missing tasks
* old objects without links break after model changes
* old Playwright tests fail after UI changes

### 7.6 CI Testing

GitHub Actions should run relevant Playwright tests automatically.

The CI setup should show that the project has automated tests, repeatable quality checks, a professional development workflow and confidence before deployment.

---

## 8. Implementation Phases

## Phase 1 – Platform Foundation ✅ Complete

Goal: make the app reliable for several saved projects and one active project.

Definition of Done:

* the user can create multiple projects ✅
* the user can switch active project ✅
* project data does not mix between projects ✅
* reload keeps saved projects ✅
* no active project state is understandable ✅
* important flows are tested ✅

---

## Phase 2 – Project Members ✅ Complete

Goal: add project members as a first-class part of each project.

Definition of Done:

* each project can have its own members ✅
* members are visible in the project ✅
* members persist after reload ✅
* members appear in the status report ✅
* member flow is tested ✅

---

## Phase 3 – Responsibility ✅ Complete

Goal: connect work, risks and decisions to people.

Definition of Done:

* tasks, risks and decisions can be assigned to members ✅
* owner names are visible ✅
* unassigned items are easy to identify ✅
* responsibility appears in the status report ✅
* responsibility flows are tested ✅

---

## Phase 4 – Attention Needed ✅ Complete

Goal: help the project leader see what requires action.

Definition of Done:

* Attention Needed is visible on My Projects, Project Map and Status Report ✅
* important problems are surfaced automatically ✅
* severity is shown as High or Medium ✅
* the logic is understandable ✅
* empty state is helpful ✅
* the feature is tested ✅

---

## Phase 5 – Project Health ✅ MVP complete

Goal: give the user a simple and useful interpretation of the project status.

Definition of Done:

* every active project has a calculated health state ✅
* the health state is visible ✅
* the health explanation is understandable ✅
* health reasons are shown in the Status Report ✅
* health reasons are included in Markdown export ✅
* Project Health Score is calculated from attention signals ✅
* Project Health Score is shown in the Status Report ✅
* Project Health Score is included in Markdown export ✅
* Project Health Score is tested through Playwright ✅
* Project Health scenario tests cover Stable, Needs attention and At risk ✅
* the status report includes Project Health ✅
* the feature is tested ✅

Implementation note:

Project Health is now shown in the My Projects overview, Project Map and Status Report. In the Status Report, the health state is supported by main reasons, improved summary text and a simple Project Health Score so the user can understand why the project is stable, needs attention or is at risk.

The Project Health Score is intentionally simple and rule-based. It starts at 100 and is reduced by attention signals.

Project Health now has focused Playwright scenario coverage for Stable, Needs attention and At risk. These tests verify that the health level, Project Health Score, health summary and health reasons respond correctly to different project situations.

The health state, health reasons and score are calculated through shared project insight logic in `src/lib/projectInsights.ts`.

This means that My Projects, Project Map and Status Report can build on the same project interpretation logic.

---

## Phase 6 – Improved Status Report ✅ MVP complete

Goal: make the Status Report one of the strongest parts of Project Compass.

Focus areas:

* project purpose
* goals
* deliverables
* members
* tasks
* risks
* decisions
* responsibilities
* Attention Needed
* Project Health
* Project Health Score
* main Project Health reasons
* Recommended Next Step
* Markdown export

Implemented so far:

* Status Report gives a clear project overview ✅
* Status Report shows Project Health ✅
* Status Report shows Project Health Score ✅
* Status Report shows main Project Health reasons ✅
* Status Report shows improved Project Health summary text ✅
* Status Report shows Attention Needed with severity ✅
* Status Report shows responsibilities for tasks, risks and decisions ✅
* Status Report shows risk-to-task traceability ✅
* Status Report shows decision-to-task traceability ✅
* Status Report shows a Recommended Next Step ✅
* Status Report shows traceability-based Recommended Next Step for high risks without linked tasks ✅
* Status Report shows traceability-based Recommended Next Step for open decisions without linked tasks ✅
* Markdown export includes Project Health ✅
* Markdown export includes Project Health Score ✅
* Markdown export includes main Project Health reasons ✅
* Markdown export includes Attention Needed ✅
* Markdown export includes traceability ✅
* Markdown export includes Recommended Next Step ✅
* Playwright verifies Recommended Next Step in the Markdown export ✅
* Playwright verifies traceability-based Recommended Next Step behavior for high risks and open decisions ✅
* Playwright verifies Project Health Score in the Markdown export ✅
* Playwright verifies Project Health scenarios for Stable, Needs attention and At risk ✅
* README has been updated with Project Health recommendations ✅
* README has been updated with Project Health Score ✅
* README has been updated with Project Health scenario tests ✅
* README has been updated with traceability-based Recommended Next Step behavior ✅

Definition of Done:

* the status report gives a clear project overview ✅
* the report can be shown to a teacher, mentor, stakeholder or recruiter ✅
* the report includes both data and interpretation ✅
* the report explains why the project has its current health status ✅
* the report shows a simple rule-based Project Health Score ✅
* the report suggests a recommended next step ✅
* the report can recommend traceability improvements when high risks are not linked to concrete work ✅
* the report can recommend traceability improvements when open decisions are not linked to concrete work ✅
* Markdown export works ✅
* important report behavior is tested ✅

Implementation note:

This phase is now a strong MVP. The Status Report no longer only lists project data. It interprets the project situation through Project Health, explains the main reasons behind that status, shows a simple Project Health Score and suggests a recommended next step based on project signals.

The Status Report can now also recommend linking high risks and open decisions to affected tasks when they are not connected to concrete work. This strengthens the connection between risk management, decision follow-up, traceability and project leadership.

This supports the core identity of Project Compass: helping users turn unclear work into a manageable project.

---

## Phase 7 – Traceability ✅ MVP complete

Status: MVP completed and verified.

Implemented in Version 1.3:

* Risks can be linked to related tasks.
* Decisions can be linked to related tasks.
* Risk View shows related task.
* Decision View shows related task.
* Project Map shows risk-to-task links.
* Project Map shows decision-to-task links.
* Project Map distinguishes linked and unlinked risks.
* Project Map distinguishes linked and unlinked decisions.
* Status Report shows which task a risk affects.
* Status Report shows which task a decision affects.
* Markdown export includes risk-to-task links.
* Markdown export includes decision-to-task links.
* README has been updated to describe the traceability MVP.

Verified with:

```bash
npm run build
npx playwright test tests/risk-responsibility.spec.ts --project=chromium --workers=1
npx playwright test tests/decision-responsibility.spec.ts --project=chromium --workers=1
npx playwright test tests/project-map-attention.spec.ts --project=chromium --workers=1
npx playwright test tests/status-report-markdown.spec.ts --project=chromium --workers=1
```

Goal: show why tasks, risks and decisions matter.

Definition of Done:

* important objects can be linked ✅
* the user can understand relationships ✅
* Project Map shows connections ✅
* Status Report includes linked objects ✅
* Markdown export includes linked objects ✅
* traceability flow is tested through focused regression tests ✅

Remaining possible future traceability improvements:

* Link tasks to goals.
* Link tasks to deliverables.
* Link decisions to risks.
* Improve relationship visualization in Project Map.
* Consider a more general relationship model if the app grows.

---

## Phase 8 – Export and Import

Goal: make project data more portable and professional.

Focus areas:

* export project as JSON
* import project from JSON
* improve status report export
* protect against invalid imported data
* document limitations

Suggested small steps:

1. Add JSON export for active project.
2. Improve Markdown export formatting further.
3. Add JSON import later.
4. Validate imported structure before saving.
5. Test export with several projects.
6. Test import with valid and invalid files.
7. Add documentation.
8. Commit and push.

Definition of Done:

* active project can be exported
* status report can be exported
* export does not include wrong project data
* invalid import data is handled safely
* feature is documented

---

## Phase 9 – QA Module

Goal: make Project Compass stronger as a QA and test leadership portfolio case.

Focus areas:

* test case module
* bug or issue log
* regression suite
* test summary report
* link test cases to tasks, goals or deliverables
* include QA status in status report

Suggested small steps:

1. Define simple test case model.
2. Add test case list.
3. Add create test case form.
4. Add test status.
5. Add bug or issue log.
6. Add regression suite marker.
7. Add test summary section.
8. Link test cases to project objects.
9. Add QA summary to status report.
10. Add Playwright tests for core QA flow.
11. Update README with QA portfolio value.
12. Commit and push.

Definition of Done:

* the app supports simple test leadership
* test cases can be created and tracked
* bugs or issues can be documented
* test summary can be created
* QA information can be included in the status report
* documentation explains the QA purpose

---

## Phase 10 – Professional Presentation

Goal: make the project ready for GitHub, LinkedIn, LIA and interviews.

Focus areas:

* improved README
* screenshots
* live demo link
* CI badge
* test status badge
* roadmap
* known limitations
* what I learned
* manual testing documentation
* Playwright documentation
* better visual polish

Suggested small steps:

1. Add screenshots.
2. Add Vercel demo link.
3. Add CI badge.
4. Add test documentation.
5. Add roadmap section.
6. Add Known limitations.
7. Add What I learned.
8. Improve visual consistency.
9. Review app as a recruiter would.
10. Commit and push.

Definition of Done:

* the repository looks professional
* the app is easy to understand
* documentation explains both product and QA work
* tests and CI are visible
* the project can be used in LIA and job interviews

---

## 9. Risks

### 9.1 Product Risks

| Risk                                                 | Impact                                        | Mitigation                                                                       |
| ---------------------------------------------------- | --------------------------------------------- | -------------------------------------------------------------------------------- |
| The app becomes too similar to Trello, Jira or Taiga | The product loses its identity                | Keep focus on clarity, responsibility, risks, decisions, traceability and status |
| Too many features are added too fast                 | The app becomes hard to maintain              | Work in small MVP steps                                                          |
| Users do not understand where to start               | Poor first impression                         | Improve empty states, demo data and setup checklist                              |
| Status report becomes too generic                    | Weak product value                            | Generate report from real project data                                           |
| Attention Needed becomes noisy                       | User ignores it                               | Keep rules simple and relevant                                                   |
| Project Health becomes misleading                    | User gets false confidence                    | Show reasons behind every health status                                          |
| Project Health Score feels too exact                 | User may overtrust a simple rule-based signal | Describe it clearly as an MVP indicator, not a validated performance metric      |
| Recommended Next Step becomes too generic            | User does not trust the recommendation        | Base recommendations on clear project signals                                    |
| Traceability becomes too complex                     | User gets confused                            | Keep relationship types simple and visible                                       |

### 9.2 Technical Risks

| Risk                                               | Impact                                  | Mitigation                                            |
| -------------------------------------------------- | --------------------------------------- | ----------------------------------------------------- |
| localStorage data structure becomes hard to change | Future features become harder           | Keep data model documented                            |
| Project data gets mixed between projects           | Serious user trust problem              | Test active project and project switching carefully   |
| Old saved data breaks after model changes          | App may crash                           | Add safe defaults and migration logic if needed       |
| Owner references break when members change         | Wrong or missing responsibility display | Handle missing member references gracefully           |
| Linked task references break when tasks change     | Traceability becomes unclear            | Show safe fallback such as Unknown task               |
| Shared insight logic becomes inconsistent          | Views show different project status     | Keep calculations centralized in `projectInsights.ts` |
| Playwright tests become brittle                    | CI becomes unreliable                   | Test behavior, not small visual details               |
| Navigation becomes more complex                    | User gets lost                          | Keep active project and main actions visible          |

### 9.3 QA Risks

| Risk                                                     | Impact                                               | Mitigation                                                                                                |
| -------------------------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Important flows are only tested manually                 | Regressions may be missed                            | Add Playwright tests for critical flows                                                                   |
| Tests do not match real user behavior                    | Low confidence                                       | Write tests around user journeys                                                                          |
| Regression suite becomes too large                       | Hard to maintain                                     | Prioritize high-risk flows                                                                                |
| Documentation is not updated                             | Portfolio value decreases                            | Update docs as part of Definition of Done                                                                 |
| Traceability is not tested after changes                 | Links may break silently                             | Include traceability in focused regression                                                                |
| Project Health and recommendations are not tested        | Status logic may regress                             | Add scenario tests for core health and recommendation rules                                               |
| Project Health Score is not tested                       | Score logic or export may regress                    | Verify score in the Status Report Markdown export test                                                    |
| Project Health scenario behavior is not tested           | Health levels may regress silently                   | Verify Stable, Needs attention and At risk with focused Playwright tests                                  |
| Traceability-based recommendation behavior is not tested | Recommendations may stop supporting the product idea | Verify traceability-based recommendations for high risks and open decisions with focused Playwright tests |

### 9.4 Portfolio Risks

| Risk                         | Impact                                    | Mitigation                                                                 |
| ---------------------------- | ----------------------------------------- | -------------------------------------------------------------------------- |
| The app looks unfinished     | Recruiters may not understand the value   | Improve README, screenshots and demo flow                                  |
| The QA value is not visible  | The project looks like only frontend work | Document test strategy, test cases and CI                                  |
| The product story is unclear | The project is harder to explain          | Keep the message: project clarity, responsibility, traceability and status |
| The repo becomes messy       | Lower professional impression             | Keep commits small and documentation current                               |

### 9.5 localStorage Limitations

localStorage is useful for an MVP, but not suitable for multi-user collaboration or long-term production data.

Mitigation:

* Accept localStorage as an MVP choice.
* Keep the data model clean enough to move to a backend later.
* Document technical limitations clearly.

---

## 10. Definition of Done

A phase or feature is considered done when it meets the following criteria.

### 10.1 Product

* The feature supports project clarity, responsibility, risk awareness, decision tracking, traceability, status or QA value.
* The user flow is understandable.
* Empty states are helpful.
* Error states are handled.
* The feature works for the active project.
* The feature does not mix data between projects.
* The app still feels like Project Compass, not a generic task board.

### 10.2 UX

* The user can understand what to do next.
* Labels and headings are clear.
* Important information is visible.
* The active project is visible where relevant.
* Relationships between objects are understandable where shown.
* The UI is consistent with the rest of the app.
* The feature works on normal desktop screen sizes.
* Basic mobile usability should not be broken.

### 10.3 Code

* The implementation is small enough to review.
* TypeScript types are updated if needed.
* Data structures are clear.
* Repeated logic is extracted when useful.
* The app builds successfully.
* Existing functionality still works.

### 10.4 Testing

* The feature has been manually tested.
* Happy path has been tested.
* Relevant edge cases have been tested.
* Negative cases have been considered.
* Existing regression areas have been checked.
* Playwright tests are added or updated if the feature affects an important flow.
* GitHub Actions should pass.

### 10.5 Documentation

* README is updated if the feature changes the product story.
* Roadmap or docs are updated if the feature changes future direction.
* Test documentation is updated when relevant.
* Known limitations are documented if the feature is intentionally incomplete.

### 10.6 Git Workflow

* Changes are committed with a clear commit message.
* The commit is pushed to GitHub.
* GitHub Actions should pass.
* Vercel deployment should be checked if relevant.

Example commit messages:

* Add project platform roadmap
* Improve active project handling
* Add My Projects overview
* Add project members page
* Add Attention Needed section
* Add Project Health indicator
* Add project health score logic
* Show project health score in status report
* Test project health score in status report export
* Improve project health summary text
* Test project health summary in status report export
* Add project health scenario tests
* Improve status report summary
* Add traceability between risks and tasks
* Add traceability between decisions and tasks
* Update README with traceability MVP
* Mark traceability MVP as complete
* Add recommended next step logic
* Show recommended next step in status report
* Test recommended next step in status report export
* Recommend linking high risks to tasks
* Test recommended next step traceability
* Recommend linking open decisions to tasks
* Test open decision traceability recommendation
* Update README for traceability recommendation test
* Update roadmap for traceability recommendation test
* Update README for project health recommendations
* Update README for project health score
* Update README for project health scenario tests
* Update roadmap for project health score
* Update roadmap for project health scenario tests

---

## 11. Recommended Next Implementation Step

Version 1.4 – Status Report and Project Health is now strong enough to be considered a solid portfolio MVP.

Completed Version 1.4 improvements:

* Project Health reasons are shown in the Status Report.
* Project Health reasons are included in the Markdown export.
* Project Health Score logic has been added.
* Project Health Score is shown in the Status Report.
* Project Health Score is included in the Markdown export.
* Improved Project Health summary text has been added.
* Playwright verifies Project Health Score in the Markdown export.
* Project Health scenario tests verify Stable, Needs attention and At risk.
* Recommended Next Step logic has been added.
* Recommended Next Step is shown in the Status Report.
* Recommended Next Step is included in the Markdown export.
* Recommended Next Step recommends linking high risks to affected tasks when high risks are not connected to concrete work.
* Recommended Next Step recommends linking open decisions to affected tasks when open decisions are not connected to concrete work.
* Playwright verifies Recommended Next Step in the Markdown export.
* Playwright verifies traceability-based Recommended Next Step behavior for high risks and open decisions.
* README has been updated to describe Project Health reasons, Project Health Score, Project Health scenario tests, Recommended Next Step and traceability-based recommendation behavior.
* The roadmap has been updated to describe open decision traceability recommendations.

Current value:

The Status Report now works more like a project leadership artifact. It does not only summarize tasks, risks, decisions and responsibility. It also explains the project situation, shows a simple health score, shows concrete health reasons and suggests what the project leader should do next.

The report can also guide the project leader toward better traceability by recommending that high risks and open decisions are linked to the concrete work they may affect.

Recommended next implementation step:

Close Version 1.4 as a portfolio milestone after final verification, then start Version 1.5 – QA Module.

Suggested final Version 1.4 checkpoint:

```bash
npm run build
npx playwright test tests/status-report-markdown.spec.ts --project=chromium --workers=1
npx playwright test tests/recommended-next-step-traceability.spec.ts --project=chromium --workers=1
npx playwright test tests/project-health-scenarios.spec.ts --project=chromium --workers=1
npx playwright test tests/project-map-attention.spec.ts --project=chromium --workers=1
```

If these checks pass, Version 1.4 can be treated as complete enough for portfolio presentation.

Possible next phase:

Start Version 1.5 by designing the smallest possible QA module MVP:

* Test case model
* Test case list
* Create test case form
* Test status
* Link test case to task
* QA summary in Status Report
* Playwright test for the core QA flow

---

## 12. Manual Test Checklist for Version 1.4

Use this checklist when testing Version 1.4 Status Report and Project Health improvements.

### Status Report

* Can I open the Status Report for the active project?
* Does the report show the correct active project?
* Does the report show Project Health?
* Does the report show Project Health Score?
* Does the score make sense based on the current attention signals?
* Does the health summary make sense for the current project data?
* Does the report show main Project Health reasons?
* Do the health reasons match the project data?
* Does the report show Attention Needed?
* Does the report show blocked tasks?
* Does the report show high risks?
* Does the report show open decisions?
* Does the report show missing responsibility?
* Does the report show risk-to-task links?
* Does the report show decision-to-task links?
* Does the report show a Recommended Next Step?
* Does a high risk without a linked task recommend linking high risks to affected tasks?
* Does an open decision without a linked task recommend linking open decisions to affected tasks?
* Does the traceability-based recommendation explain why the risk or decision should be connected to concrete work?
* Does the recommended next step make sense for the project situation?

### Project Health scenarios

* Does a stable project show Stable?
* Does a stable project show Project Health Score 100 / 100?
* Does a stable project show no current attention signals?
* Does a project with missing ownership show Needs attention?
* Does a project with missing ownership show a reduced Project Health Score?
* Does a project with missing ownership show a concrete health summary?
* Does a project with several high risks show At risk?
* Does a project with several high risks show a reduced Project Health Score?
* Do all Project Health scenarios show clear health reasons?

### Markdown export

* Does Markdown export include the project name?
* Does Markdown export include Overall Project Status?
* Does Markdown export include Project Health Score?
* Does Markdown export include main Project Health reasons?
* Does Markdown export include Attention Needed?
* Does Markdown export include task responsibility?
* Does Markdown export include risk responsibility?
* Does Markdown export include decision responsibility?
* Does Markdown export include risk-to-task links?
* Does Markdown export include decision-to-task links?
* Does Markdown export include Recommended Next Step?
* Is the copied Markdown usable outside the app?

### Edge cases

* Does the app still handle no active project correctly?
* Does the app still work after reload?
* Does a stable project show a reasonable health summary?
* Does a project with high risks recommend reviewing risks?
* Does a project with high risks without linked tasks recommend linking high risks to affected tasks?
* Does a project with blocked tasks recommend resolving blocked work?
* Does a project with open decisions without linked tasks recommend linking open decisions to affected tasks?
* Does a project with open decisions recommend closing open decisions?
* Does a project with missing ownership recommend assigning ownership?

Recommended command before and after implementation:

```bash
npm run build
npx playwright test tests/status-report-markdown.spec.ts --project=chromium --workers=1
npx playwright test tests/recommended-next-step-traceability.spec.ts --project=chromium --workers=1
npx playwright test tests/project-health-scenarios.spec.ts --project=chromium --workers=1
npx playwright test tests/project-map-attention.spec.ts --project=chromium --workers=1
```

If Project Health logic changes significantly, also run:

```bash
npx playwright test tests/projects-overview.spec.ts --project=chromium --workers=1
```
