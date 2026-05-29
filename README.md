![Playwright Tests](https://github.com/Zion8a/project-compass/actions/workflows/playwright.yml/badge.svg)

# Project Compass

Project Compass is a project thinking and project management MVP built with Next.js, TypeScript, Tailwind CSS and Playwright.

The goal of the project is to explore how a project tool can help users structure a project before it becomes only a list of tasks.

Many project tools start with tasks, boards and cards. Project Compass starts one step earlier:

* Why are we doing the project?
* What should become better?
* What should be delivered?
* What can go wrong?
* What decisions are needed?
* Who is involved?
* Who is responsible?
* What needs attention?
* How healthy is the project right now?
* What should happen next?

Project Compass has grown from a single-project MVP into a small project platform with support for saved projects, active project selection, project members, responsibility across tasks, risks and decisions, Attention Needed, Project Health, status reporting and Markdown export.

---

## Live demo

Project Compass is deployed on Vercel:

https://project-compass-seven.vercel.app/

The app currently uses localStorage, which means saved projects are stored locally in the browser used for testing.

---

## QA highlights

This project is built as both a product MVP and a software testing portfolio case.

It demonstrates:

* Product thinking before implementation
* Manual regression testing of the full MVP flow
* Exploratory testing with documented bug findings
* Bug fixing and regression verification
* Playwright end-to-end testing
* Cross-browser landing page testing
* Chromium-based core flow testing
* Focused Playwright tests for project overview, members, responsibility, Attention Needed and Markdown export
* GitHub Actions CI pipeline
* Playwright report artifact upload
* Written test strategy and manual test documentation
* Incremental feature development with clear commits
* Active project data model for saved projects
* Attention Needed logic based on project data
* Project Health MVP based on project signals
* UI language consistency improvement from mixed Swedish/English to standardized English
* Deployment to Vercel as a live portfolio demo

The goal is not only to build a working application, but to show how a tester can think about product quality, user flows, risk, regression, automation and maintainability.

---

## Portfolio value

This repository is intended to show practical QA and test automation skills in a realistic product context.

It demonstrates that I can:

* Understand and structure a product idea
* Identify important user flows
* Document scope, user stories and test strategy
* Think through product changes before coding
* Perform manual regression testing
* Find and document usability issues
* Verify bug fixes through regression testing
* Write Playwright end-to-end tests
* Make tests more precise when UI changes create ambiguity
* Mock browser APIs when needed for reliable E2E testing
* Connect automated tests to GitHub Actions
* Deploy a Next.js app to Vercel
* Use Git commits to document progress and technical decisions
* Refactor from separate localStorage keys toward an active project data model
* Build a product while continuously evaluating quality and risk

The project shows both a builder mindset and a tester mindset: creating a working MVP while continuously asking what could break, what should be verified and how quality can be made visible.

---

## Purpose

The purpose of Project Compass is to help users think clearly about a project before and during execution.

The app focuses on:

* Purpose
* Goals
* Deliverables
* Tasks
* Risks
* Decisions
* Members
* Responsibility
* Attention needed
* Project health
* Status
* Next steps
* Shareable reporting

Project Compass is not intended to be a copy of Trello, Jira, Taiga or Reqtest. The strength of the product is that it helps the user structure, understand and lead the project, not only track cards on a board.

---

## Product idea

Project Compass helps teams turn unclear work into a manageable project.

The product is designed for smaller projects where clarity, responsibility and follow-up matter more than advanced enterprise workflow features.

Examples of suitable use cases:

* Student projects
* Smaller project groups
* Associations
* Municipal working groups
* Education projects
* Early product ideas
* QA and testing projects
* Project leaders who need structure before the work becomes too large

The core product question is:

```text
Does this help the user understand, steer or improve the project?
```

If the answer is yes, the feature fits Project Compass.

---

## Current features

The current version includes:

* Landing page
* Project interview
* My Projects overview
* Multiple saved projects in localStorage
* Active project handling
* Active project summary on Project Map
* Project map
* Attention Needed summary on Project Map
* Project Health MVP with Stable, Needs attention and At risk levels
* Project board / Kanban-style task board
* Project members
* Task responsibility with responsible member selection
* Risk responsibility with responsible member selection
* Decision responsibility with responsible member selection
* Risk register
* Decision log
* Status report
* Project members shown in status report
* Responsibility overview in status report
* Attention Needed summary in status report
* Copy status report as Markdown
* Attention Needed included in Markdown export
* Local data persistence with localStorage
* Standardized English UI across the main application flow
* Manual regression test documentation
* Automated end-to-end tests with Playwright
* Live deployment on Vercel

---

## Project platform features

Project Compass now includes the first version of a project platform layer.

### My Projects

The user can:

* Create a new project
* Save multiple projects
* View saved projects
* See project status
* See number of members
* See number of tasks
* See number of risks
* See number of decisions
* Open a selected project
* Track the active project in the header

### Active project

The application stores an active project ID.

The active project is shown in the shared app header, which helps the user understand which project they are currently working with.

The active project now owns:

* Members
* Tasks
* Risks
* Decisions

This means that the main project data belongs to the selected project instead of being stored as separate global lists.

### Project members

Each project can have members with:

* Name
* Role
* Responsibility
* Comment

Members are saved per project and persist after page reload.

### Responsibility model

Tasks, risks and decisions can be connected to a responsible project member.

The first version of the responsibility model is intentionally simple:

* One responsible member per item
* Optional responsibility
* Clear display on cards
* Responsibility persists after reload
* Status report shows responsibility overview
* Unassigned items can be detected by Attention Needed

This supports the core project question:

```text
Who owns what right now?
```

### Task responsibility

Tasks in the workspace can have a responsible member.

The user can:

* Add members to the active project
* Create a task
* Assign the task to a project member
* See the responsible member on the task card
* Reload the page and keep the responsibility assignment

Tasks are stored in the active project data model.

### Risk responsibility

Risks in the risk register can have a responsible member.

The user can:

* Create a risk
* Assign the risk to a project member
* See the responsible member on the risk card
* Reload the page and keep the responsibility assignment

Risks are stored in the active project data model.

### Decision responsibility

Decisions in the decision log can have a responsible member.

The user can:

* Create a decision
* Assign the decision to a project member
* See the responsible member on the decision card
* Reload the page and keep the responsibility assignment

Decisions are stored in the active project data model.

### Attention Needed

Project Compass can highlight project items that need project leader attention.

The first version of Attention Needed checks the active project for:

* Blocked tasks
* Tasks without owner
* Risks without owner
* High risks
* Decisions without owner
* Open decisions

This helps the user move from simply storing project information to understanding what should be followed up next.

### Project Health

Project Compass includes a first Project Health MVP.

The Project Map can show one of three health levels:

* Stable
* Needs attention
* At risk

The health level is based on simple project signals such as:

* Blocked tasks
* High risks
* Open decisions
* Attention items

This is intentionally kept simple in the first version. The goal is to make project status visible and understandable without creating a complex scoring model too early.

### Status report responsibility overview

The status report includes a responsibility overview for:

* Tasks
* Risks
* Decisions

Each section shows:

* Title
* Status
* Responsible member

Unassigned items are shown clearly.

### Status report Attention Needed

The status report now includes an Attention Needed section.

This section helps the report show not only what exists in the project, but what should be followed up next.

Attention Needed is also included in the Markdown export.

### Markdown report export

The status report can be copied as Markdown.

The exported report includes:

* Project name
* Date
* Overall project status
* Summary metrics
* Attention Needed
* Purpose
* Goal
* Deliverables
* Project members
* Task responsibility
* Risk responsibility
* Decision responsibility
* Recommended next steps

This makes the report usable outside the app, for example in GitHub, Teams, documentation, school assignments or project meetings.

---

## Application flow

The current main product flow is:

1. Open the landing page
2. Go to My Projects
3. Create or open a project
4. Add project members
5. Open the project map
6. Review active project summary
7. Review Attention Needed
8. Review Project Health
9. Open the workspace
10. Create tasks
11. Assign task responsibility
12. Add risks to the risk register
13. Assign risk responsibility
14. Add decisions to the decision log
15. Assign decision responsibility
16. Open the status report
17. Review project status, members, responsibilities, risks, decisions and attention items
18. Copy the status report as Markdown

The original MVP flow from project interview to project map and status report still exists, but the current product direction is the project platform flow.

---

## Tech stack

* Next.js
* React
* TypeScript
* Tailwind CSS
* Playwright
* Git / GitHub
* GitHub Actions
* Vercel
* localStorage

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
│   ├── decision-responsibility.spec.ts
│   ├── landing-page.spec.ts
│   ├── main-flow.spec.ts
│   ├── project-map-attention.spec.ts
│   ├── project-members.spec.ts
│   ├── projects-overview.spec.ts
│   ├── risk-responsibility.spec.ts
│   ├── status-report-markdown.spec.ts
│   └── task-responsibility.spec.ts
├── playwright.config.ts
└── README.md
```

---

## Pages

### Landing page

The landing page introduces Project Compass and provides navigation to:

* My Projects
* Project interview
* Project map
* Workspace
* Status report

### My Projects

The project overview allows the user to:

* Create new projects
* View saved projects
* Open a selected project
* See which project is active
* See project member count
* See task count
* See risk count
* See decision count
* See when the project was last updated

### Project interview

The project interview collects basic project information:

* Project name
* Purpose
* Goal / desired effect
* Deliverables
* Risks
* Decisions

### Project map

The project map summarizes the project and gives the user an overview before moving into task work.

It includes:

* Project direction
* Active project summary
* Attention Needed
* Project Health
* Recommended next step

### Project members

The members page allows the user to add people to the active project.

Each member can have:

* Name
* Role
* Responsibility
* Comment

### Project board

The project board allows the user to create and move tasks between:

* Backlog
* Planned
* In progress
* Blocked
* Review
* Done

Tasks can also be assigned to a responsible project member.

### Risk view

The risk view allows the user to document project risks with:

* Title
* Description
* Probability
* Impact
* Action
* Responsible member
* Legacy owner note
* Status

### Decision view

The decision view allows the user to document decisions with:

* Title
* Description
* Responsible member
* Legacy owner note
* Deadline
* Status
* Consequence

### Status report

The status report summarizes:

* Overall project status
* Total tasks
* Done tasks
* Blocked tasks
* Open risks
* High risks
* Open decisions
* Number of members
* Attention Needed
* Project purpose
* Project goal
* Project members
* Task responsibility
* Risk responsibility
* Decision responsibility
* Recommended next steps

The status report can also be copied as Markdown and is intended to become the main communication artifact for a project. It now includes Attention Needed so the exported report can show not only what exists in the project, but what should be followed up next.

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

* `project-platform-roadmap.md` describes the move from single-project MVP to project platform.
* `responsibility-model-plan.md` describes how ownership should work for tasks, risks and decisions.

---

## Testing

Project Compass includes both manual and automated testing.

### Manual testing

Manual regression testing is documented in:

```text
docs/manual-test-run.md
```

Manual testing has been used to verify:

* Main MVP flow
* Navigation
* Project creation
* Project persistence
* Member creation
* Members after reload
* Member count in project overview
* Members in status report
* Task responsibility in workspace
* Task responsibility after reload
* Risk responsibility in risk view
* Risk responsibility after reload
* Decision responsibility in decision view
* Decision responsibility after reload
* Responsibility overview in status report
* Attention Needed on Project Map
* Project Health on Project Map
* Attention Needed in Status Report
* Markdown copy from status report
* Standardized English UI across the main application flow
* Vercel deployment smoke test

During manual exploratory testing, several usability and navigation issues were found and fixed, including:

* Missing navigation to the project board from the landing page
* Missing home navigation from project pages
* Missing edit interview navigation from the risk view
* Unclear project opening behavior
* Tests that were too tightly coupled to old UI text
* Ambiguous Playwright locators when several elements had similar text
* Navigation timing issues in the old main flow test
* Clipboard limitations in Playwright requiring a mocked clipboard implementation
* Mixed Swedish and English UI text before the English UI refactor
* Encoding issues from earlier copied text
* Windows / OneDrive `.next` file locking during local test runs

### Automated testing

Automated end-to-end tests are written with Playwright and located in:

```text
tests/landing-page.spec.ts
tests/main-flow.spec.ts
tests/projects-overview.spec.ts
tests/project-members.spec.ts
tests/task-responsibility.spec.ts
tests/risk-responsibility.spec.ts
tests/decision-responsibility.spec.ts
tests/project-map-attention.spec.ts
tests/status-report-markdown.spec.ts
```

Current automated tests include:

* Landing page and navigation test
* Main project data flow test
* Projects overview test
* Project members test
* Task responsibility test
* Risk responsibility test
* Decision responsibility test
* Project Map Attention Needed test
* Status report Markdown copy test

The landing page test is verified across:

* Chromium
* Firefox
* WebKit

Focused product tests are currently run in Chromium.

---

## Current Playwright coverage

### Landing page

Verifies that:

* Landing page loads
* Main heading is visible
* Navigation links are visible
* Main action links are visible

### Main flow

Verifies that:

* Stored project data can be shown in the project map
* Stored project data can be shown in the status report
* Project map and status report read the same saved project data

### Projects overview

Verifies that:

* User can open My Projects
* User can create a project
* Project appears in the list
* Project becomes active
* Project persists after reload
* Active project is shown in the header
* Project overview shows project summary metrics

### Project members

Verifies that:

* User can create a project
* User can add a member to the active project
* Member persists after reload
* Project overview shows member count
* Member appears in the status report

### Task responsibility

Verifies that:

* User can create a project
* User can add a project member
* User can create a task
* User can assign the task to a member
* Task card shows the responsible member
* Responsibility persists after reload

### Risk responsibility

Verifies that:

* User can create a project
* User can add a project member
* User can create a risk
* User can assign the risk to a member
* Risk card shows the responsible member
* Responsibility persists after reload

### Decision responsibility

Verifies that:

* User can create a project
* User can add a project member
* User can create a decision
* User can assign the decision to a member
* Decision card shows the responsible member
* Responsibility persists after reload

### Project Map Attention Needed

Verifies that:

* User can create a project
* User can create a blocked task without owner
* User can create a high risk without owner
* User can create an open decision without owner
* Project Map shows Attention Needed
* Attention Needed shows blocked task, missing ownership, high risk and open decision signals

### Status report Markdown export

Verifies that:

* Status report loads with stored active project data
* Copy status report as Markdown button is visible
* User can trigger Markdown copy
* Confirmation message is shown
* Exported Markdown contains project name, members, task, risk and decision data
* Exported Markdown contains Attention Needed

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

Run the risk responsibility test:

```bash
npx playwright test tests/risk-responsibility.spec.ts --project=chromium
```

Run the decision responsibility test:

```bash
npx playwright test tests/decision-responsibility.spec.ts --project=chromium
```

Run the Project Map Attention Needed test:

```bash
npx playwright test tests/project-map-attention.spec.ts --project=chromium
```

Run the status report Markdown test:

```bash
npx playwright test tests/status-report-markdown.spec.ts --project=chromium
```

Run the focused regression suite:

```bash
npx playwright test tests/projects-overview.spec.ts --project=chromium
npx playwright test tests/project-members.spec.ts --project=chromium
npx playwright test tests/task-responsibility.spec.ts --project=chromium
npx playwright test tests/risk-responsibility.spec.ts --project=chromium
npx playwright test tests/decision-responsibility.spec.ts --project=chromium
npx playwright test tests/project-map-attention.spec.ts --project=chromium
npx playwright test tests/status-report-markdown.spec.ts --project=chromium
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

## Deployment

Project Compass is deployed on Vercel:

https://project-compass-seven.vercel.app/

The project is connected to GitHub, so future pushes to the main branch can be deployed automatically by Vercel.

---

## Current status

The project is functional, deployed and has passed repeated manual and automated regression testing.

Completed:

* Project interview
* Project map
* Project board
* Risk register
* Decision log
* Status report
* Manual regression test documentation
* Playwright setup
* Landing page automated test
* Main flow automated test in Chromium
* Shared application header and improved navigation
* UX improvements across the full main flow
* Improved page introductions, help texts and visual hierarchy
* Project platform roadmap
* Multiple saved projects
* Active project ID
* My Projects overview
* Project members page
* Members shown in status report
* Project member Playwright coverage
* Active project data model for tasks, risks and decisions
* Task responsibility in workspace
* Task responsibility Playwright coverage
* Risk responsibility in risk view
* Risk responsibility Playwright coverage
* Decision responsibility in decision view
* Decision responsibility Playwright coverage
* Responsibility overview in status report
* Active project summary on Project Map
* Attention Needed on Project Map
* Project Health MVP on Project Map
* Project Map Attention Needed Playwright coverage
* Status Report uses active project data
* Attention Needed in Status Report
* Attention Needed in Markdown export
* Copy status report as Markdown
* Status report Markdown Playwright coverage
* Responsibility model plan
* Standardized English UI across the main application flow
* Updated Playwright tests after UI language refactor
* Cleaned up encoding issues from earlier copied text
* Vercel deployment
* Live demo link in README

Planned next steps:

* Continue improving migration and cleanup from older localStorage keys
* Improve validation and error handling
* Add more focused Playwright tests per module
* Improve accessibility
* Improve Project Health logic over time
* Reuse Attention Needed logic in more parts of the app
* Add delete and duplicate project actions
* Consider persistent backend storage in a later version
* Add screenshots to README
* Add a clearer “What I learned” section

---

## Learning focus

This project is also part of a software testing learning journey.

It demonstrates:

* Building a small product MVP
* Thinking in user flows
* Documenting test strategy
* Writing manual regression tests
* Finding and fixing usability bugs
* Installing and using Playwright
* Writing automated end-to-end tests
* Using Git commits to document progress
* Refactoring repeated navigation into a shared component
* Improving usability and visual consistency across an application
* Creating focused E2E tests for new features
* Adjusting tests when UI changes
* Using regression testing before commits
* Mocking clipboard behavior in Playwright
* Deploying a Next.js project to Vercel
* Thinking about responsibility, ownership and status reporting in projects
* Refactoring project data toward an active project model
* Building Attention Needed from actual project data
* Building a simple Project Health MVP
* Improving a status report so it becomes a useful communication artifact
