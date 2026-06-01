# Project Compass – Project Platform Roadmap

## 1. Background

Project Compass started as a small project application and project model developed during the course *Practical Project Work in Software Testing* at EC Utbildning.

The idea came from working with project methods, test planning, test processes, scope, test goals, test strategy, area tours, test suites, test cases, bug reports, regression test suites and presentation of test results.

During the group project, tools such as Trello and Taiga were useful, but their free-tier limitations also revealed a clear problem: many project tools quickly become either too restricted, too complex, or too focused on boards and tasks before the project itself has been properly understood.

Project Compass is not intended to be a copy of Trello, Jira, Taiga or Reqtest. Its strength should be that it helps the user think clearly before a project turns into a board full of cards.

Project Compass should help teams turn unclear work into a manageable project.

The current MVP already includes:

- Landing page
- Project interview
- Project map
- Project workspace / board view
- Risk view
- Decision view
- Status report
- Shared application header and navigation
- localStorage-based data persistence
- Playwright E2E tests
- GitHub Actions CI
- Public GitHub repository with QA/portfolio-focused README

The next step is to evolve Project Compass from an app for one active project into a small project platform where the user can create, save, open and manage multiple projects.

This platform direction makes Project Compass more useful, more realistic and stronger as a portfolio project. It shows product thinking, project management, frontend development, QA, test automation and documentation in one coherent application.

---

## 2. Problem We Are Solving

Many small projects fail because the team does not lack effort, but clarity.

The current version works mainly as a single-project application. This limits the product in several ways:

- The user cannot manage several projects at the same time.
- There is no clear overview of saved projects.
- The app needs a reliable concept of one active project.
- Project data must be clearly separated per project.
- Project members need to be a structured part of each project.
- Tasks, risks and decisions need clear ownership.
- The status report should show ownership, team structure, accountability, risk and next steps.
- The app should become less of a single workflow and more of a reusable project clarity platform.

Real projects are not only collections of tasks. They also include people, responsibilities, risks, decisions, goals, deliverables, status and next steps.

Project Compass should help users answer questions such as:

- Why are we doing this project?
- What should improve?
- What should be delivered?
- Who is involved?
- Who is responsible for what?
- What is blocked?
- Which risks need attention?
- Which decisions are still open?
- How healthy is the project right now?
- What should happen next?

The main problem is not task management alone.

The main problem is project clarity.

---

## 3. Product Principles

Project Compass should be developed according to the following product principles.

### 3.1 Think Before Tracking

Project Compass should help the user clarify the project before tasks are created.

The app should support structured thinking around:

- Purpose
- Goals
- Deliverables
- Scope
- Risks
- Decisions
- Members
- Responsibilities
- Status
- Next steps

### 3.2 Clarity Before Complexity

Every feature should make the project easier to understand.

If a feature adds complexity without improving clarity, responsibility, risk awareness, decision tracking, status or testability, it should wait.

### 3.3 Simple Before Advanced

The application should stay understandable and lightweight.

Every feature should answer a real project need. Features should not be added only because larger project tools have them.

### 3.4 Project Model First

The data model should support the project logic.

Instead of only adding UI screens, the app should gradually develop a clear internal project model.

### 3.5 Responsibility Must Be Visible

Tasks, risks and decisions should clearly show ownership.

Items without an owner should still be allowed, but they should be easy to find and clearly shown as needing attention.

### 3.6 Status Should Be Generated From Project Data

The status report should not only be free text.

It should summarize real project information:

- project purpose
- goals
- deliverables
- members
- tasks
- blocked tasks
- risks
- decisions
- missing owners
- Attention needed
- Project Health
- recommended next steps

### 3.7 QA Mindset

Each change should be designed with testing in mind.

Before building a feature, we should consider:

- User flow
- Data structure
- Edge cases
- Acceptance criteria
- Regression risks
- Playwright test impact

### 3.8 Portfolio Quality

Project Compass is also a QA and software testing portfolio project.

The repository should demonstrate:

- Structured product thinking
- Clear documentation
- Incremental development
- Version control discipline
- Testable acceptance criteria
- Manual testing
- Playwright E2E testing
- CI through GitHub Actions
- Risk-based thinking
- Professional README and documentation

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

This makes it possible to:

- store multiple projects
- open a selected project
- track the active project
- keep project data separated
- add members per project
- connect responsibility to tasks, risks and decisions
- build a stronger status report
- add Attention needed
- calculate Project Health
- prepare future export, import and QA features

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

```ts
type ProjectRisk = {
  id: string;
  title: string;
  description?: string;
  probability?: "low" | "medium" | "high";
  impact?: "low" | "medium" | "high";
  status: "open" | "mitigated" | "closed";
  mitigation?: string;
  ownerId?: string;
  linkedTaskId?: string;
  createdAt: string;
  updatedAt: string;
};
```

### 4.8 Project Decision

```ts
type ProjectDecision = {
  id: string;
  title: string;
  description?: string;
  status: "open" | "decided";
  decision?: string;
  decidedBy?: string;
  ownerId?: string;
  linkedTaskId?: string;
  linkedRiskId?: string;
  date?: string;
  createdAt: string;
  updatedAt: string;
  decidedAt?: string;
};
```

### 4.9 Attention Needed

Attention needed should be calculated from existing project data.

```ts
type AttentionItem = {
  id: string;
  type: "task" | "risk" | "decision";
  title: string;
  reason: string;
  severity: "low" | "medium" | "high";
};
```

Examples of attention rules:

- task has no owner
- task is blocked
- risk has no owner
- risk has high probability and high impact
- decision has no owner
- decision is still open

### 4.10 Project Health

Project Health should also be calculated from project data.

```ts
type ProjectHealth = {
  level: "stable" | "needs-attention" | "at-risk";
  summary: string;
  reasons: string[];
};
```

Suggested logic:

Stable:

- no blocked tasks
- no high open risks
- no important open decisions
- few or no unassigned items

Needs attention:

- one or more blocked tasks
- some unassigned tasks, risks or decisions
- one or more open decisions
- one or more medium or high risks

At risk:

- several blocked tasks
- several high risks
- important decisions are open
- many items have no owner

### 4.11 Shared Project Insight Logic

Attention Needed and Project Health are now calculated through shared project insight logic in `src/lib/projectInsights.ts`.

This helper currently contains:

- `getAttentionItems(project)`
- `getProjectHealth(project, attentionItems)`

The purpose of this shared logic is to make sure that Project Map, Status Report and My Projects can use the same interpretation of project data.

This reduces duplicated logic, lowers the risk of inconsistent project status between views, and prepares the app for future improvements such as:

- Project Health Score
- richer health explanations
- shared dashboard summaries
- health indicators in My Projects
- future QA/test summary insights

This is an important maintainability step because Project Compass should not only display project information, but interpret project signals in a consistent and testable way.

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

As a user, I want to connect decisions to members, so that important decisions have traceability and responsibility.

### 5.10 Attention Needed

As a project leader, I want to see tasks, risks and decisions that need attention, so that I know what to act on first.

### 5.11 Project Health

As a project leader, I want to see a simple project health indicator, so that I can quickly understand if the project is stable, needs attention or is at risk.

### 5.12 Improved Status Report

As a user, I want the status report to summarize the project clearly, so that I can share project status with a teacher, mentor, stakeholder or recruiter.

### 5.13 Future Export

As a user, I want to export project data and status reports, so that I can document progress outside the app.

### 5.14 Future QA Module

As a QA-focused user, I want to add test cases, bugs and test summaries, so that Project Compass can also support simple test leadership.

---

## 6. Acceptance Criteria

### 6.1 Multiple Projects

- The user can create more than one project.
- Each project has a unique ID.
- Each project has a name.
- Each project stores its own project data.
- Projects are saved in localStorage.
- Reloading the browser does not remove saved projects.
- The user can return to a previous project.

### 6.2 My Projects Overview

- A page called "My Projects" exists.
- The page lists all saved projects.
- Each project card shows at least:
  - project name
  - project status or health
  - last updated date
- The user can open a project from the project overview.
- The active project is visually clear.
- The overview helps the user understand where to continue.
- If there are no projects, the page shows a helpful empty state.

### 6.3 Active Project

- The application stores an `activeProjectId`.
- When a project is opened, it becomes the active project.
- Project-specific pages use the active project data.
- Views such as workspace, risks, decisions and status report only show data for the active project.
- If no active project exists, the user is guided to create or open a project.

### 6.4 Project Members

- A project can have members.
- A member has at least a name.
- A member can optionally have:
  - role
  - responsibility
  - email
  - comment
- Members belong to one project.
- Members are saved in localStorage.
- Reloading the browser does not remove members.
- A project with no members shows a helpful empty state.

### 6.5 Responsibility

- Tasks can have an assigned member.
- Risks can have an assigned member.
- Decisions can have an assigned member.
- Items without an owner are still allowed, but should be visible as needing attention.
- Owner names should be shown in relevant views.
- If a member is removed in the future, ownership should be handled safely.

### 6.6 Attention Needed

- The app shows a section for Attention needed.
- The section includes blocked tasks.
- The section includes tasks without owners.
- The section includes risks without owners.
- The section includes high open risks.
- The section includes decisions without owners.
- The section includes open decisions.
- If there are no attention items, the app shows a positive empty state.

### 6.7 Project Health

- The app calculates project health from project data.
- The possible health states are Stable, Needs attention and At risk.
- The health state is shown clearly on the project dashboard.
- The health state is shown in the My Projects overview.
- The health state is shown in the status report.
- The health explanation includes the main reasons.

### 6.8 Improved Status Report

- The status report includes project purpose.
- The status report includes goals and deliverables.
- The status report includes project members.
- The status report includes tasks.
- The status report includes risks.
- The status report includes decisions.
- The status report includes blocked items.
- The status report includes responsibilities.
- The status report includes Attention needed.
- The status report includes Project Health.
- The status report includes recommended next steps.
- The report can be copied or exported as Markdown.
- The report should be useful as a real project communication artifact.

### 6.9 Testing

- Existing Playwright tests should continue to pass.
- New core flows should be covered by Playwright tests.
- At minimum, tests should cover:
  - landing page loads
  - main flow still works
  - user can create a project
  - user can open a project
  - project data persists after reload
  - user can add a member
  - member appears in status report
  - Attention needed displays relevant items
  - Project Health is visible

### 6.10 Future Export

- The user can export a project as JSON.
- The user can export the status report as Markdown.
- Exported data should belong only to the selected project.
- Export should not break existing localStorage data.

### 6.11 Future QA Module

- The user can create test cases.
- A test case can have status, priority and steps.
- A test case can be linked to a task, goal or deliverable.
- The user can create bug or issue records.
- The user can create a simple test summary.
- QA data should appear in the status report when relevant.

---

## 7. Test Strategy

Project Compass should be tested as both a product and a QA portfolio project.

The test strategy should combine:

- manual exploratory testing
- structured manual test cases
- regression testing
- Playwright E2E tests
- GitHub Actions CI
- documentation updates

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

Manual testing should be used for:

- new UI flows
- empty states
- form validation
- confusing user flows
- project switching
- localStorage behavior
- status report review
- visual inspection

Manual tests should cover:

- happy path
- edge cases
- negative cases
- empty project
- project with no members
- project with several members
- project with blocked tasks
- project with high risks
- project with open decisions
- page reload
- project switching

### 7.3 Playwright Tests

Playwright should focus on the most important user flows.

Recommended Playwright coverage:

- landing page loads
- create project
- select active project
- add project members
- create task
- assign task owner
- create risk
- assign risk owner
- create decision
- assign decision owner
- show Attention needed
- show Project Health
- generate status report
- export or copy Markdown report
- handle no active project

Suggested test files:

```txt
tests/projects-overview.spec.ts
tests/project-members.spec.ts
tests/task-responsibility.spec.ts
tests/risk-responsibility.spec.ts
tests/decision-responsibility.spec.ts
tests/attention-needed.spec.ts
tests/project-health.spec.ts
tests/status-report-responsibility.spec.ts
```

Playwright should not test every small visual detail.

The goal is to cover important behavior and prevent regressions.

### 7.4 Suggested Test Scenarios

#### Project Overview

- User can navigate to My Projects.
- User can see the project overview page.
- User can create a new project.
- New project appears in the project list.
- User can open a project.
- Active project is clearly shown.

#### Persistence

- User creates a project.
- User reloads the page.
- The project still exists.
- The same project can be opened again.

#### Members

- User opens a project.
- User navigates to Members.
- User adds a member.
- Member appears in the member list.
- Member remains after reload.

#### Responsibility

- User assigns a member to a task.
- User assigns a member to a risk.
- User assigns a member to a decision.
- Assigned responsibility is shown in the relevant view.

#### Attention Needed

- User creates a task without an owner.
- User creates a blocked task.
- User creates a high risk.
- User creates an open decision.
- Attention needed shows the relevant items.
- When all issues are handled, a positive empty state is shown.

#### Project Health

- Empty or low-risk project shows Stable or Needs attention depending on rules.
- Project with some open issues shows Needs attention.
- Project with several blocked tasks or high risks shows At risk.
- Health explanation shows the reasons.

#### Status Report

- User adds members, risks and decisions.
- User opens the status report.
- Status report shows members and responsibilities.
- Status report shows Attention needed.
- Status report shows Project Health.
- Status report gives a useful project overview.

### 7.5 Risk-Based Testing

High-risk areas should be tested first.

Important risks:

- data from different projects is mixed
- active project is lost after reload
- localStorage data becomes invalid
- owner assignment breaks when members change
- status report shows wrong project data
- Attention needed misses important items
- Project Health gives a misleading status
- old Playwright tests fail after UI changes

### 7.6 CI Testing

GitHub Actions should run relevant Playwright tests automatically.

The CI setup should show that the project has:

- automated tests
- repeatable quality checks
- a professional development workflow
- confidence before deployment

---

## 8. Implementation Phases

## Phase 1 – Platform Foundation

Goal:

Make the app reliable for several saved projects and one active project.

Focus areas:

- review current project data structure
- make sure each project has its own data
- make activeProjectId reliable
- improve no active project handling
- improve localStorage loading and saving
- create or improve My Projects overview
- show active project clearly in the UI

Suggested small steps:

1. Review current data model.
2. Document how projects are saved today.
3. Improve active project handling if needed.
4. Improve empty state when no active project exists.
5. Add or improve My Projects page.
6. Test project switching manually.
7. Add or update Playwright test for project switching.
8. Run build and relevant tests.
9. Update README or docs.
10. Commit and push.

Definition of Done:

- the user can create multiple projects
- the user can switch active project
- project data does not mix between projects
- reload keeps saved projects
- no active project state is understandable
- important flows are tested

---

## Phase 2 – Project Members

Goal:

Add project members as a first-class part of each project.

Focus areas:

- project members per project
- member role
- member responsibility
- member comments
- empty state when no members exist
- members shown in status report

Suggested small steps:

1. Create or improve a Members page.
2. Add members to the project data model.
3. Allow the user to add members.
4. Store name, role, responsibility and comment.
5. Show members in the status report.
6. Test member persistence after reload.
7. Add basic Playwright coverage for member flow.
8. Update documentation.
9. Commit and push.

Definition of Done:

- each project can have its own members
- members are visible in the project
- members persist after reload
- members appear in the status report
- member flow is tested

---

## Phase 3 – Responsibility

Goal:

Connect work, risks and decisions to people.

Focus areas:

- owner selection for tasks
- owner selection for risks
- owner selection for decisions
- better display of owner names
- unassigned items visible

Suggested small steps:

1. Add or verify `ownerId` on tasks.
2. Add or verify `ownerId` on risks.
3. Add or verify `ownerId` on decisions.
4. Add member selection in relevant views.
5. Show responsible person in task, risk and decision displays.
6. Update status report to show responsibility clearly.
7. Test with several members.
8. Add or update Playwright tests for ownership.
9. Update documentation.
10. Commit and push.

Definition of Done:

- tasks, risks and decisions can be assigned to members
- owner names are visible
- unassigned items are easy to identify
- responsibility appears in the status report
- responsibility flows are tested

---

## Phase 4 – Attention Needed

Goal:

Help the project leader see what requires action.

Focus areas:

- tasks without owner
- risks without owner
- decisions without owner
- blocked tasks
- open decisions
- high risks
- positive empty state when nothing needs attention

Suggested small steps:

1. Define attention rules.
2. Create helper function for calculating attention items.
3. Add Attention needed section to dashboard.
4. Add links or references to the relevant items.
5. Add empty state for healthy projects.
6. Test with project data that triggers each attention rule.
7. Add Playwright test for Attention needed.
8. Update README or roadmap.
9. Commit and push.

Definition of Done:

- Attention needed is visible on the dashboard
- important problems are surfaced automatically
- the logic is understandable
- empty state is helpful
- the feature is tested

---

## Phase 5 – Project Health

Goal:

Give the user a simple and useful interpretation of the project status.

Focus areas:

- Stable
- Needs attention
- At risk
- explanation of health status
- health shown on dashboard
- health shown in My Projects
- health shown in status report

Suggested small steps:

1. Define health rules.
2. Create helper function for calculating Project Health.
3. Show health badge on dashboard.
4. Show health summary in status report.
5. Add health indicator to project cards. ✅ Implemented in My Projects overview.
6. Test different project situations.
7. Add Playwright test for health states.
8. Update documentation.
9. Commit and push.

Definition of Done:

- every active project has a calculated health state
- the health state is visible
- the health explanation is understandable
- the status report includes Project Health
- the feature is tested
Implementation note:

Project Health is now shown in the My Projects overview. Each project card shows the calculated health state, a short health summary and the number of attention items. This makes the project overview more useful as a project leadership view, not only a list of saved projects.

The health state is calculated through shared project insight logic in `src/lib/projectInsights.ts`.

This means that My Projects, Project Map and Status Report can build on the same project interpretation logic.

---

## Phase 6 – Improved Status Report

Goal:

Make the status report one of the strongest parts of Project Compass.

Focus areas:

- project purpose
- goals
- deliverables
- members
- tasks
- risks
- decisions
- responsibilities
- Attention needed
- Project Health
- recommended next steps
- Markdown export

Suggested small steps:

1. Review current status report.
2. Add missing project context.
3. Add member and responsibility summary.
4. Add Attention needed summary.
5. Add Project Health summary.
6. Add recommended next steps.
7. Improve Markdown export.
8. Test report with empty and rich project data.
9. Add or update Playwright test for status report.
10. Update README screenshots or documentation later.
11. Commit and push.

Definition of Done:

- the status report gives a clear project overview
- the report can be shown to a teacher, mentor, stakeholder or recruiter
- the report includes both data and interpretation
- Markdown export works
- important report behavior is tested

---

## Phase 7 – Traceability

Goal:

Show why tasks, risks and decisions matter.

Focus areas:

- link task to goal
- link task to deliverable
- link risk to task
- link decision to task
- link decision to risk
- show relationships in Project Map
- include relationships in status report

Suggested small steps:

1. Add linkedGoalId and linkedDeliverableId to tasks.
2. Add linkedTaskId to risks.
3. Add linkedTaskId and linkedRiskId to decisions.
4. Show links in relevant cards.
5. Improve Project Map to show relationships.
6. Add relationship summary to status report.
7. Test linked and unlinked objects.
8. Add Playwright test for one important linking flow.
9. Update documentation.
10. Commit and push.

Definition of Done:

- important objects can be linked
- the user can understand relationships
- Project Map shows connections
- status report includes linked objects
- traceability flow is tested

---

## Phase 8 – Export and Import

Goal:

Make project data more portable and professional.

Focus areas:

- export project as JSON
- import project from JSON
- export status report as Markdown
- protect against invalid imported data
- document limitations

Suggested small steps:

1. Add JSON export for active project.
2. Add Markdown export for status report.
3. Add JSON import later.
4. Validate imported structure before saving.
5. Test export with several projects.
6. Test import with valid and invalid files.
7. Add documentation.
8. Commit and push.

Definition of Done:

- active project can be exported
- status report can be exported
- export does not include wrong project data
- invalid import data is handled safely
- feature is documented

---

## Phase 9 – QA Module

Goal:

Make Project Compass stronger as a QA and test leadership portfolio case.

Focus areas:

- test case module
- bug or issue log
- regression suite
- test summary report
- link test cases to tasks, goals or deliverables
- include QA status in status report

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

- the app supports simple test leadership
- test cases can be created and tracked
- bugs or issues can be documented
- test summary can be created
- QA information can be included in the status report
- documentation explains the QA purpose

---

## Phase 10 – Professional Presentation

Goal:

Make the project ready for GitHub, LinkedIn, LIA and interviews.

Focus areas:

- improved README
- screenshots
- live demo link
- CI badge
- test status badge
- roadmap
- known limitations
- what I learned
- manual testing documentation
- Playwright documentation
- better visual polish

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

- the repository looks professional
- the app is easy to understand
- documentation explains both product and QA work
- tests and CI are visible
- the project can be used in LIA and job interviews

---

## 9. Risks

### 9.1 Product Risks

| Risk | Impact | Mitigation |
|---|---|---|
| The app becomes too similar to Trello, Jira or Taiga | The product loses its identity | Keep focus on clarity, responsibility, risks, decisions and status |
| Too many features are added too fast | The app becomes hard to maintain | Work in small MVP steps |
| Users do not understand where to start | Poor first impression | Improve empty states and setup checklist |
| Status report becomes too generic | Weak product value | Generate report from real project data |
| Attention needed becomes noisy | User ignores it | Keep rules simple and relevant |
| Project Health becomes misleading | User gets false confidence | Show reasons behind every health status |

### 9.2 Technical Risks

| Risk | Impact | Mitigation |
|---|---|---|
| localStorage data structure becomes hard to change | Future features become harder | Keep data model documented |
| Project data gets mixed between projects | Serious user trust problem | Test active project and project switching carefully |
| Old saved data breaks after model changes | App may crash | Add safe defaults and migration logic if needed |
| Owner references break when members change | Wrong or missing responsibility display | Handle missing member references gracefully |
| Playwright tests become brittle | CI becomes unreliable | Test behavior, not small visual details |
| Navigation becomes more complex | User gets lost | Keep active project and main actions visible |

### 9.3 QA Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Important flows are only tested manually | Regressions may be missed | Add Playwright tests for critical flows |
| Tests do not match real user behavior | Low confidence | Write tests around user journeys |
| Regression suite becomes too large | Hard to maintain | Prioritize high-risk flows |
| Documentation is not updated | Portfolio value decreases | Update docs as part of Definition of Done |

### 9.4 Portfolio Risks

| Risk | Impact | Mitigation |
|---|---|---|
| The app looks unfinished | Recruiters may not understand the value | Improve README, screenshots and demo flow |
| The QA value is not visible | The project looks like only frontend work | Document test strategy, test cases and CI |
| The product story is unclear | The project is harder to explain | Keep the message: project clarity, responsibility and status |
| The repo becomes messy | Lower professional impression | Keep commits small and documentation current |

### 9.5 localStorage Limitations

localStorage is useful for an MVP, but not suitable for multi-user collaboration or long-term production data.

Mitigation:

- Accept localStorage as an MVP choice.
- Keep the data model clean enough to move to a backend later.
- Document technical limitations clearly.

---

## 10. Definition of Done

A phase or feature is considered done when it meets the following criteria.

### 10.1 Product

- The feature supports project clarity, responsibility, risk awareness, decision tracking, status or QA value.
- The user flow is understandable.
- Empty states are helpful.
- Error states are handled.
- The feature works for the active project.
- The feature does not mix data between projects.
- The app still feels like Project Compass, not a generic task board.

### 10.2 UX

- The user can understand what to do next.
- Labels and headings are clear.
- Important information is visible.
- The active project is visible where relevant.
- The UI is consistent with the rest of the app.
- The feature works on normal desktop screen sizes.
- Basic mobile usability should not be broken.

### 10.3 Code

- The implementation is small enough to review.
- TypeScript types are updated if needed.
- Data structures are clear.
- Repeated logic is extracted when useful.
- The app builds successfully.
- Existing functionality still works.

### 10.4 Testing

- The feature has been manually tested.
- Happy path has been tested.
- Relevant edge cases have been tested.
- Negative cases have been considered.
- Existing regression areas have been checked.
- Playwright tests are added or updated if the feature affects an important flow.
- GitHub Actions should pass.

### 10.5 Documentation

- README is updated if the feature changes the product story.
- Roadmap or docs are updated if the feature changes future direction.
- Test documentation is updated when relevant.
- Known limitations are documented if the feature is intentionally incomplete.

### 10.6 Git Workflow

- Changes are committed with a clear commit message.
- The commit is pushed to GitHub.
- GitHub Actions should pass.
- Vercel deployment should be checked if relevant.

Example commit messages:

- Add project platform roadmap
- Improve active project handling
- Add My Projects overview
- Add project members page
- Add attention needed section
- Add project health indicator
- Improve status report summary
- Add Playwright test for project switching
- Update README with platform roadmap

---

## Recommended Next Implementation Step

The recommended next step after this document is:

Create or improve the My Projects overview.

Why:

- It supports the platform direction.
- It makes multiple saved projects visible.
- It improves the active project flow.
- It prepares the app for Attention needed and Project Health.
- It is easy to test manually and with Playwright.
- It gives the app a clearer platform feeling without copying Trello, Jira or Taiga.

Suggested first MVP:

- show all saved projects
- show which project is active
- allow the user to open or select a project
- show helpful empty state if there are no projects
- show basic project summary
- keep the design simple

This is a good next feature because it strengthens the foundation before adding more advanced project leadership features.

---

## First Manual Test Checklist for My Projects

When the first My Projects MVP is implemented, test the following manually:

- Can I open the My Projects page?
- Can I create a new project?
- Can I see the new project in the list?
- Can I open the project?
- Is the active project clearly shown?
- Can I reload the page and still see the project?
- Can I create a second project?
- Can I switch between projects?
- Does each project keep its own data?
- Does the no-project state help me understand what to do?
- Do existing Playwright tests still pass?

Recommended command after implementation:

```bash
npm run build
npx playwright test tests/landing-page.spec.ts
npx playwright test tests/main-flow.spec.ts --project=chromium
```

If navigation or project switching changes significantly, run:

```bash
npx playwright test
```
