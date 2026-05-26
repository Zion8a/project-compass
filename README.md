![Playwright Tests](https://github.com/Zion8a/project-compass/actions/workflows/playwright.yml/badge.svg)

# Project Compass

Project Compass is a project thinking and project management MVP built with Next.js, TypeScript, Tailwind CSS and Playwright.

The goal of the project is to explore how a project tool can help users structure a project before it becomes only a list of tasks.

Many project tools start with tasks, boards and cards. Project Compass starts one step earlier:

- Why are we doing the project?
- What should become better?
- What should be delivered?
- What can go wrong?
- What decisions are needed?
- Who is involved?
- Who is responsible?
- What should happen next?

Project Compass has grown from a single-project MVP into a small project platform with support for saved projects, active project selection, project members and task responsibility.

---

## QA highlights

This project is built as both a product MVP and a software testing portfolio case.

It demonstrates:

- Product thinking before implementation
- Manual regression testing of the full MVP flow
- Exploratory testing with documented bug findings
- Bug fixing and regression verification
- Playwright end-to-end testing
- Cross-browser landing page testing
- Chromium-based core flow testing
- Focused Playwright tests for project overview, members and task responsibility
- GitHub Actions CI pipeline
- Playwright report artifact upload
- Written test strategy and manual test documentation
- Incremental feature development with clear commits

The goal is not only to build a working application, but to show how a tester can think about product quality, user flows, risk, regression, automation and maintainability.

---

## Portfolio value

This repository is intended to show practical QA and test automation skills in a realistic product context.

It demonstrates that I can:

- Understand and structure a product idea
- Identify important user flows
- Document scope, user stories and test strategy
- Think through product changes before coding
- Perform manual regression testing
- Find and document usability issues
- Verify bug fixes through regression testing
- Write Playwright end-to-end tests
- Make tests more precise when UI changes create ambiguity
- Connect automated tests to GitHub Actions
- Use Git commits to document progress and technical decisions
- Build a product while continuously evaluating quality and risk

The project shows both a builder mindset and a tester mindset: creating a working MVP while continuously asking what could break, what should be verified and how quality can be made visible.

---

## Purpose

The purpose of Project Compass is to help users think clearly about a project before and during execution.

The app focuses on:

- Purpose
- Goals
- Deliverables
- Tasks
- Risks
- Decisions
- Members
- Responsibility
- Status
- Next steps

Project Compass is not intended to be a copy of Trello, Jira or Taiga. The strength of the product is that it helps the user structure and understand the project, not only track cards on a board.

---

## Current features

The current version includes:

- Landing page
- Project interview
- My Projects overview
- Multiple saved projects in localStorage
- Active project handling
- Project map
- Project board / Kanban-style task board
- Project members
- Task responsibility with responsible member selection
- Risk register
- Decision log
- Status report
- Project members shown in status report
- Local data persistence with localStorage
- Manual regression test documentation
- Automated end-to-end tests with Playwright

---

## Project platform features

Project Compass now includes the first version of a project platform layer.

### My Projects

The user can:

- Create a new project
- Save multiple projects
- View saved projects
- See project status
- See number of members
- Open a selected project
- Track the active project in the header

### Active project

The application stores an active project ID.

The active project is shown in the shared app header, which helps the user understand which project they are currently working with.

### Project members

Each project can have members with:

- Name
- Role
- Responsibility
- Comment

Members are saved per project and persist after page reload.

### Task responsibility

Tasks in the workspace can now have a responsible member.

The user can:

- Add members to the active project
- Create a task
- Assign the task to a project member
- See the responsible member on the task card
- Reload the page and keep the responsibility assignment

This is the first implemented part of the responsibility model.

---

## Application flow

The current main product flow is:

1. Open the landing page
2. Go to My Projects
3. Create or open a project
4. Add project members
5. Open the project map
6. Open the workspace
7. Create tasks
8. Assign task responsibility
9. Add risks to the risk register
10. Add decisions to the decision log
11. Open the status report
12. Review project status, members, risks, decisions and next steps

The original MVP flow from project interview to project map and status report still exists and is covered by automated tests.

---

## Tech stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Playwright
- Git / GitHub
- GitHub Actions
- localStorage

---

## Project structure

```text
project-compass
├── docs
│   ├── manual-test-run.md
│   ├── mvp-scope.md
│   ├── product-vision.md
│   ├── project-platform-roadmap.md
│   ├── responsibility-model-plan.md
│   ├── test-strategy.md
│   └── user-stories.md
├── src
│   ├── app
│   │   ├── new-project
│   │   ├── project-board
│   │   ├── project-decisions
│   │   ├── project-map
│   │   ├── project-members
│   │   ├── project-report
│   │   ├── project-risks
│   │   └── projects
│   ├── components
│   │   └── AppHeader.tsx
│   └── lib
│       └── projectStorage.ts
├── tests
│   ├── landing-page.spec.ts
│   ├── main-flow.spec.ts
│   ├── project-members.spec.ts
│   ├── projects-overview.spec.ts
│   └── task-responsibility.spec.ts
├── playwright.config.ts
└── README.md
```

---

## Pages

### Landing page

The landing page introduces Project Compass and provides navigation to:

- My Projects
- Project interview
- Project map
- Workspace
- Status report

### My Projects

The project overview allows the user to:

- Create new projects
- View saved projects
- Open a selected project
- See which project is active
- See project member count

### Project interview

The project interview collects basic project information:

- Project name
- Purpose
- Goal / desired effect
- Deliverables
- Risks
- Decisions

### Project map

The project map summarizes the project and gives the user an overview before moving into task work.

### Project members

The members page allows the user to add people to the active project.

Each member can have:

- Name
- Role
- Responsibility
- Comment

### Project board

The project board allows the user to create and move tasks between:

- Backlog
- Planned
- In progress
- Blocked
- Review
- Done

Tasks can also be assigned to a responsible project member.

### Risk view

The risk view allows the user to document project risks with:

- Title
- Description
- Probability
- Impact
- Action
- Owner
- Status

Risk responsibility through the new member model is planned for a later iteration.

### Decision view

The decision view allows the user to document decisions with:

- Title
- Description
- Owner
- Deadline
- Status
- Consequence

Decision responsibility through the new member model is planned for a later iteration.

### Status report

The status report summarizes:

- Total tasks
- Done tasks
- Blocked tasks
- Open risks
- High risks
- Open decisions
- Number of members
- Project purpose
- Project goal
- Project members
- Recommended next steps

The status report is intended to become the main communication artifact for a project.

---

## Documentation

The repository includes product and QA documentation.

```text
docs/product-vision.md
docs/mvp-scope.md
docs/user-stories.md
docs/test-strategy.md
docs/manual-test-run.md
docs/project-platform-roadmap.md
docs/responsibility-model-plan.md
```

Important planning documents:

- `project-platform-roadmap.md` describes the move from single-project MVP to project platform.
- `responsibility-model-plan.md` describes how ownership should work for tasks, risks and decisions.

---

## Testing

Project Compass includes both manual and automated testing.

### Manual testing

Manual regression testing is documented in:

```text
docs/manual-test-run.md
```

Manual testing has been used to verify:

- Main MVP flow
- Navigation
- Project creation
- Project persistence
- Member creation
- Members after reload
- Member count in project overview
- Members in status report
- Task responsibility in workspace
- Task responsibility after reload

During manual exploratory testing, several usability and navigation issues were found and fixed, including:

- Missing navigation to the project board from the landing page
- Missing home navigation from project pages
- Missing edit interview navigation from the risk view
- Unclear project opening behavior
- Tests that were too tightly coupled to old UI text
- Ambiguous Playwright locators when several elements had similar text

### Automated testing

Automated end-to-end tests are written with Playwright and located in:

```text
tests/landing-page.spec.ts
tests/main-flow.spec.ts
tests/projects-overview.spec.ts
tests/project-members.spec.ts
tests/task-responsibility.spec.ts
```

Current automated tests include:

- Landing page and navigation test
- Main user flow test
- Projects overview test
- Project members test
- Task responsibility test

The landing page test is verified across:

- Chromium
- Firefox
- WebKit

Focused product tests are currently run in Chromium.

---

## Current Playwright coverage

### Landing page

Verifies that:

- Landing page loads
- Main heading is visible
- Navigation links are visible
- Main action links are visible

### Main flow

Verifies that:

- User can open the project interview
- User can fill in project information
- User can create a project map
- User can open the status report
- Project data appears in the report

### Projects overview

Verifies that:

- User can open My Projects
- User can create a project
- Project appears in the list
- Project becomes active
- Project persists after reload
- Active project is shown in the header

### Project members

Verifies that:

- User can create a project
- User can add a member to the active project
- Member persists after reload
- Project overview shows member count
- Member appears in the status report

### Task responsibility

Verifies that:

- User can create a project
- User can add a project member
- User can create a task
- User can assign the task to a member
- Task card shows the responsible member
- Responsibility persists after reload

---

## Test commands

Run all Playwright tests:

```bash
npx playwright test
```

Run the landing page test:

```bash
npx playwright test tests/landing-page.spec.ts
```

Run the main flow test in Chromium:

```bash
npx playwright test tests/main-flow.spec.ts --project=chromium
```

Run the project overview test:

```bash
npx playwright test tests/projects-overview.spec.ts --project=chromium
```

Run the project members test:

```bash
npx playwright test tests/project-members.spec.ts --project=chromium
```

Run the task responsibility test:

```bash
npx playwright test tests/task-responsibility.spec.ts --project=chromium
```

Run the focused regression suite:

```bash
npx playwright test tests/projects-overview.spec.ts --project=chromium
npx playwright test tests/project-members.spec.ts --project=chromium
npx playwright test tests/task-responsibility.spec.ts --project=chromium
npx playwright test tests/landing-page.spec.ts
npx playwright test tests/main-flow.spec.ts --project=chromium
```

Show the latest Playwright HTML report:

```bash
npx playwright show-report
```

---

## Run the project locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Build the project:

```bash
npm run build
```

---

## Current status

The project is functional and has passed repeated manual and automated regression testing.

Completed:

- Project interview
- Project map
- Project board
- Risk register
- Decision log
- Status report
- Manual regression test documentation
- Playwright setup
- Landing page automated test
- Main flow automated test in Chromium
- Shared application header and improved navigation
- UX improvements across the full main flow
- Improved page introductions, help texts and visual hierarchy
- Project platform roadmap
- Multiple saved projects
- Active project ID
- My Projects overview
- Project members page
- Members shown in status report
- Project member Playwright coverage
- Task responsibility in workspace
- Task responsibility Playwright coverage
- Responsibility model plan

Planned next steps:

- Show task responsibility in the status report
- Add risk responsibility
- Add decision responsibility
- Add responsibility overview in the status report
- Improve data migration from older localStorage keys to the new project platform structure
- Improve validation and error handling
- Add more focused Playwright tests per module
- Improve accessibility
- Deploy to Vercel
- Add live demo link to README
- Consider persistent backend storage in a later version

---

## Learning focus

This project is also part of a software testing learning journey.

It demonstrates:

- Building a small product MVP
- Thinking in user flows
- Documenting test strategy
- Writing manual regression tests
- Finding and fixing usability bugs
- Installing and using Playwright
- Writing automated end-to-end tests
- Using Git commits to document progress
- Refactoring repeated navigation into a shared component
- Improving usability and visual consistency across an application
- Creating focused E2E tests for new features
- Adjusting tests when UI changes
- Using regression testing before commits
- Thinking about responsibility, ownership and status reporting in projects