# Project Compass – Project Platform Roadmap

## 1. Background

Project Compass started as a small project application and project model developed during the course *Practical Project Work in Software Testing* at EC Utbildning.

The idea came from working with project methods, test planning, test processes, scope, test goals, test strategy, area tours, test suites, test cases, bug reports, regression test suites and presentation of test results.

During the group project, tools such as Trello and Taiga were useful, but their free-tier limitations also revealed a clear problem: many project tools quickly become either too restricted, too complex, or too focused on boards and tasks before the project itself has been properly understood.

Project Compass is not intended to be a copy of Trello, Jira or Taiga. Its strength should be that it helps the user think clearly before a project turns into a board full of cards.

The current MVP already includes:

- Landing page
- Project interview
- Project map
- Project workspace / board view
- Risk view
- Decision view
- Status report
- Shared application header and navigation
- LocalStorage-based data persistence
- Playwright E2E tests
- GitHub Actions CI
- Public GitHub repository with QA/portfolio-focused README

The next step is to evolve Project Compass from an app for one active project into a small project platform where the user can create, save, open and manage multiple projects.

---

## 2. Problem We Are Solving

The current version works mainly as a single-project application. This limits the product in several ways:

- The user cannot manage several projects at the same time.
- There is no clear overview of saved projects.
- The app does not yet have a concept of an active project ID.
- Project data is not clearly separated per project.
- Project members do not exist as a structured part of the project.
- Tasks, risks and decisions cannot be connected to responsible people.
- The status report cannot yet show ownership, team structure or accountability.
- The app is still closer to a single workflow than a reusable project platform.

This matters because real projects are not only collections of tasks. They also include people, responsibilities, risks, decisions, goals, deliverables, status and next steps.

Project Compass should help users answer questions such as:

- What is this project trying to achieve?
- Who is involved?
- Who is responsible for what?
- What are the main risks?
- What decisions have been made?
- What is the current status?
- What should happen next?

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

### 3.2 Simple Before Advanced

The application should stay understandable and lightweight.

Every feature should answer a real project need. Features should not be added only because larger project tools have them.

### 3.3 Project Model First

The data model should support the project logic.

Instead of only adding UI screens, the app should gradually develop a clear internal project model.

### 3.4 QA Mindset

Each change should be designed with testing in mind.

Before building a feature, we should consider:

- User flow
- Data structure
- Edge cases
- Acceptance criteria
- Regression risks
- Playwright test impact

### 3.5 Portfolio Quality

Project Compass is also a QA and software testing portfolio project.

The repository should demonstrate:

- Structured product thinking
- Clear documentation
- Incremental development
- Version control discipline
- Testable acceptance criteria
- Playwright E2E testing
- CI through GitHub Actions
- Professional README and documentation

---

## 4. Proposed Data Structure

The current localStorage structure needs to evolve from single-project data to multi-project data.

A future structure could look like this:

```ts
type Project = {
  id: string;
  name: string;
  description?: string;
  status: "not-started" | "in-progress" | "at-risk" | "completed";
  createdAt: string;
  updatedAt: string;

  interview: ProjectInterview;
  map: ProjectMap;
  tasks: ProjectTask[];
  risks: ProjectRisk[];
  decisions: ProjectDecision[];
  members: ProjectMember[];
};

type ProjectMember = {
  id: string;
  name: string;
  role?: string;
  responsibility?: string;
  comment?: string;
  createdAt: string;
  updatedAt: string;
};

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

LocalStorage could store the platform state like this:

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

- Store multiple projects.
- Open a selected project.
- Track the active project.
- Keep project data separated.
- Add members per project.
- Connect responsibility to tasks, risks and decisions.
- Build a stronger status report.

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

As a user, I want to connect decisions to members, so that important decisions have traceability and responsibility.

### 5.10 Status Report

As a user, I want the status report to show members, responsibilities, risks, decisions and next steps, so that I can quickly communicate the project situation.

### 5.11 Export Status Report

As a user, I want to export or copy the status report, so that I can share it outside the app.

---

## 6. Acceptance Criteria

### 6.1 Multiple Projects

- The user can create more than one project.
- Each project has a unique ID.
- Each project has a name.
- Each project stores its own project data.
- Projects are saved in localStorage.
- Reloading the browser does not remove saved projects.

### 6.2 Project Overview Page

- A new page called "My Projects" exists.
- The page lists all saved projects.
- Each project card shows at least:
  - Project name
  - Project status
  - Last updated date
- The user can open a project from the project overview.
- The active project is visually clear.

### 6.3 Active Project

- The application stores an `activeProjectId`.
- When a project is opened, it becomes the active project.
- Project-specific pages use the active project data.
- If no active project exists, the user is guided to create or open a project.

### 6.4 Project Members

- A project can have members.
- A member has at least a name.
- A member can optionally have:
  - Role
  - Responsibility
  - Comment
- Members belong to one project.
- Members are saved in localStorage.
- Reloading the browser does not remove members.

### 6.5 Responsibility

- Tasks can have an assigned member.
- Risks can have an assigned member.
- Decisions can have an assigned member.
- If a member is removed in the future, ownership should be handled safely.
- Responsibility should be visible where it helps the user understand the project.

### 6.6 Status Report

- The status report shows key project information.
- The status report shows project members.
- The status report shows responsibilities.
- The status report shows risks and decisions.
- The status report gives recommended next steps.
- The report should be useful as a real project communication artifact.

### 6.7 Testing

- Existing Playwright tests should continue to pass.
- New core flows should be covered by Playwright tests.
- At minimum, tests should cover:
  - Landing page loads
  - Main flow still works
  - User can create a project
  - User can open a project
  - Project data persists after reload
  - User can add a member
  - Member appears in status report

---

## 7. Test Strategy for the Change

This change affects both product structure and user flow. It should therefore be tested carefully.

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

### 7.2 New E2E Tests

New Playwright tests should be added gradually.

Suggested test files:

```txt
tests/projects-overview.spec.ts
tests/project-members.spec.ts
tests/status-report-responsibility.spec.ts
```

### 7.3 Suggested Test Scenarios

#### Project Overview

- User can navigate to My Projects.
- User can see the project overview page.
- User can create a new project.
- New project appears in the project list.
- User can open a project.

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

#### Status Report

- User adds members, risks and decisions.
- User opens the status report.
- Status report shows members and responsibilities.
- Status report gives a useful project overview.

### 7.4 Manual Exploratory Testing

Manual testing should also be used because the app is still evolving.

Focus areas:

- Does the flow feel logical?
- Is it clear which project is active?
- Is the navigation understandable?
- Can the user recover if no project exists?
- Is data saved as expected?
- Does the product still feel simple?
- Does the app support project thinking instead of only task tracking?

---

## 8. Implementation in Phases

## Phase 1: Project Platform

Goal: Introduce multiple projects and a project overview.

Main tasks:

- Create a new "My Projects" page.
- Add a multi-project localStorage structure.
- Add `activeProjectId`.
- Allow the user to create a project.
- Allow the user to open a project.
- Show basic project status in the project list.
- Make sure existing project pages use active project data.

Expected result:

Project Compass becomes a small platform where several projects can exist side by side.

---

## Phase 2: Members

Goal: Add project members as a first-class part of the project.

Main tasks:

- Create a new "Members" page.
- Add members to the project data model.
- Allow user to add members.
- Store name, role, responsibility and comment.
- Show members in the status report.
- Add basic Playwright coverage for member flow.

Expected result:

Each project can have its own team structure.

---

## Phase 3: Responsibility

Goal: Connect work, risks and decisions to people.

Main tasks:

- Add `ownerId` to tasks.
- Add `ownerId` to risks.
- Add `ownerId` to decisions.
- Add member selection in relevant views.
- Show responsible person in task, risk and decision displays.
- Update status report to show responsibility clearly.

Expected result:

Project Compass can show not only what exists in the project, but also who is responsible.

---

## Phase 4: Export and Demo

Goal: Make the project easier to present and share.

Main tasks:

- Add export/copy function for status report as Markdown.
- Prepare app for deployment.
- Deploy to Vercel.
- Add live demo link to README.
- Update README with product/platform description.
- Make sure GitHub Actions CI still passes.

Expected result:

Project Compass can be shared as a live QA/product portfolio project.

---

## Phase 5: Refinement

Goal: Improve quality, usability and long-term maintainability.

Possible improvements:

- Better validation.
- Delete project.
- Duplicate project.
- Archive project.
- Better empty states.
- More Playwright tests.
- Accessibility review.
- Keyboard navigation review.
- More structured error handling.
- Improved localStorage migration strategy.
- Better visual consistency.

Expected result:

Project Compass becomes more robust, more professional and easier to maintain.

---

## 9. Risks

### 9.1 Data Migration Risk

Changing from single-project storage to multi-project storage may break existing saved localStorage data.

Mitigation:

- Keep the first migration simple.
- Consider a fallback if old data exists.
- Test with empty localStorage and existing localStorage.

### 9.2 Scope Creep

There is a risk that Project Compass becomes too similar to Trello, Jira or Taiga.

Mitigation:

- Keep the product principles visible.
- Prioritize project thinking before task tracking.
- Avoid adding advanced features without a clear purpose.

### 9.3 Navigation Complexity

Adding more pages may make the app harder to understand.

Mitigation:

- Keep navigation simple.
- Make the active project visible.
- Use clear page titles and helper texts.

### 9.4 Test Fragility

New user flows may make Playwright tests more fragile.

Mitigation:

- Test stable user flows.
- Prefer accessible locators.
- Avoid testing implementation details.
- Update tests when product flows intentionally change.

### 9.5 LocalStorage Limitations

LocalStorage is useful for an MVP, but not suitable for multi-user collaboration or long-term production data.

Mitigation:

- Accept localStorage as an MVP choice.
- Keep the data model clean enough to move to a backend later.
- Document technical limitations clearly.

---

## 10. Definition of Done

A phase or feature is considered done when:

- The user flow is clear.
- The feature supports the product principles.
- The data structure is understandable.
- Relevant edge cases have been considered.
- Existing tests still pass.
- New important flows have Playwright coverage where appropriate.
- The UI has clear headings, helper text and empty states.
- The feature is committed with a clear Git commit message.
- The README or documentation is updated when needed.
- The app still feels like Project Compass, not a generic task board.

For the first platform phase, Definition of Done means:

- `docs/project-platform-roadmap.md` exists.
- A "My Projects" page exists.
- The user can create a project.
- The user can open a project.
- The app stores an active project ID.
- Projects persist in localStorage.
- Existing Playwright tests pass.
- At least one Playwright test covers the new project overview flow.
- Changes are committed and pushed to GitHub.