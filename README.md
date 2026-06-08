![Playwright Tests](https://github.com/Zion8a/project-compass/actions/workflows/playwright.yml/badge.svg)

# Project Compass

Project Compass is a project clarity and project management MVP built with Next.js, TypeScript, Tailwind CSS and Playwright.

The goal of the project is to explore how a project tool can help users understand, structure and lead a project before it becomes only a list of tasks.

Many project tools start with boards, cards and task tracking. Project Compass starts one step earlier:

* Why are we doing this project?
* What should become better?
* What should be delivered?
* Who is involved?
* Who is responsible for what?
* What is blocked?
* Which risks need attention?
* Which decisions are still open?
* How healthy is the project right now?
* What should happen next?

Project Compass helps teams turn unclear work into a manageable project.

---

## Screenshots

### My Projects overview

The My Projects overview shows saved projects, active project status, Project Health, attention items and key project metrics.

![My Projects overview](public/screenshots/my-projects-overview.png)

### Project setup checklist

The Project setup checklist helps a new user understand what project structure already exists and what should be clarified next.

![Project setup checklist](public/screenshots/project-map-checklist.png)

### Project Health and Attention Needed

Project Compass interprets project signals and highlights blocked work, missing ownership, high risks and open decisions.

![Project Health and Attention Needed](public/screenshots/project-health-attention.png)

### Status Report

The Status Report summarizes project status, tasks, risks, decisions, members, Attention Needed and recommended next steps.

![Status Report](public/screenshots/status-report.png)

---

## Live demo

Project Compass is deployed on Vercel:

https://project-compass-seven.vercel.app/

The app currently uses `localStorage`, which means saved projects are stored locally in the browser used for testing.

---

## Product idea

Project Compass is not intended to be a copy of Trello, Jira, Taiga, Asana, ClickUp or Reqtest.

Its strength is project clarity.

The app is designed for smaller projects where direction, responsibility, risks, decisions and status matter more than advanced enterprise workflow features.

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

## Purpose

The purpose of Project Compass is to help users think clearly about a project before and during execution.

The app focuses on:

* Purpose
* Goals
* Deliverables
* Members
* Responsibility
* Tasks
* Risks
* Decisions
* Attention needed
* Project health
* Status
* Next steps
* Shareable reporting

The product should help the user move from unclear work to a structured, responsible and manageable project.

---

## Current status

Project Compass has grown from a single-project MVP into a small project platform.

The current version includes:

* Landing page
* Project interview
* My Projects overview
* Example project/demo data so visitors can quickly explore Project Compass without creating all content manually
* Form validation for project name, task title, risk title and decision title
* Improved form accessibility for project, task, risk and decision forms
* Improved empty states for Workspace, Risk View and Decision View
* Improved no active project handling for Workspace, Risk View, Decision View, Project Map and Status Report
* Multiple saved projects in `localStorage`
* Active project handling
* Active project shown in the app header
* Project setup checklist on Project Map
* Project Map
* Active project summary on Project Map
* Project board / Kanban-style task board
* Project members
* Task responsibility
* Risk responsibility
* Decision responsibility
* Missing task ownership highlighted in Workspace
* Missing risk ownership highlighted in Risk View
* Missing decision ownership highlighted in Decision View
* Risk register
* Decision log
* Status report
* Project members shown in status report
* Responsibility overview in status report
* Project Health in My Projects overview
* Project Health on Project Map
* Project Health in Status Report
* Attention Needed on Project Map
* Attention Needed in Status Report
* Attention Needed preview in My Projects overview
* Attention severity shown as High or Medium in Project Map
* Attention severity shown as High or Medium in Status Report
* Attention severity included in Markdown export
* Copy status report as Markdown
* Shared project insight logic for Attention Needed and Project Health
* Manual regression test documentation
* Automated end-to-end tests with Playwright
* GitHub Actions CI
* Live deployment on Vercel

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
* Focused Playwright tests for project overview, members, responsibility, Attention Needed, severity indicators, setup checklist and Markdown export
* Form validation tested with Playwright for projects, tasks, risks and decisions
* Negative input tests for missing required titles
* Accessibility-focused form improvements
* Playwright checks for required form fields
* Empty state behavior tested with Playwright
* No active project states tested with Playwright
* Attention Needed severity and Markdown export behavior tested with Playwright
* Missing ownership indicators for tasks, risks and decisions tested with Playwright
* Playwright test for creating and exploring the example project demo flow
* GitHub Actions CI pipeline
* Playwright report artifact upload
* Written test strategy and manual test documentation
* Incremental feature development with clear commits
* Active project data model for saved projects
* Attention Needed logic based on project data
* Project Health MVP based on project signals
* Project Health shown in My Projects, Project Map and Status Report
* Project setup checklist tested with Playwright
* Shared project insight logic for maintainability
* UI language consistency improvement from mixed Swedish/English to standardized English
* Deployment to Vercel as a live portfolio demo

The goal is not only to build a working application, but to show how a tester can think about product quality, user flows, risk, regression, automation and maintainability.

---

## Portfolio value

This repository is intended to show practical QA and test automation skills in a realistic product context.

The example project helps teachers, recruiters and LIA contacts understand the product idea, project flow and QA value within a few minutes.

It demonstrates that I can:

* Understand and structure a product idea
* Identify important user flows
* Document scope, user stories, roadmap and test strategy
* Think through product changes before coding
* Work in small, testable and committable steps
* Perform manual regression testing
* Find and document usability issues
* Verify bug fixes through regression testing
* Write Playwright end-to-end tests
* Make tests more precise when UI changes create ambiguity
* Mock browser APIs when needed for reliable E2E testing
* Connect automated tests to GitHub Actions
* Deploy a Next.js app to Vercel
* Use Git commits to document progress and technical decisions
* Refactor duplicated logic into shared helpers
* Build a product while continuously evaluating quality and risk
* Turn project data into actionable project leadership signals
* Improve status reporting so risks, blocked work and missing ownership become visible
* Make missing responsibility visible directly in the views where work, risks and decisions are managed
* Improve form validation and error handling from a user perspective
* Improve accessibility for important forms and error messages
* Improve empty states so new users understand what to do next
* Improve recovery paths when the user has no active project selected

The project shows both a builder mindset and a tester mindset: creating a working MVP while continuously asking what could break, what should be verified and how quality can be made visible.

---

## Current features

### My Projects overview

The My Projects page allows the user to:

* Create a new project
* Create an example project with demo data
* Explore members, tasks, risks, decisions, responsibility, Attention Needed and Project Health without entering all data manually
* See a validation message if project name is missing
* Save multiple projects
* View saved projects
* Open a selected project
* See which project is active
* See project status
* See calculated Project Health
* See a short health summary
* See number of attention items
* Preview the most important Attention Needed items directly in the project card
* See whether attention items are High or Medium priority
* See number of members
* See number of tasks
* See number of risks
* See number of decisions
* See when the project was last updated

This makes the overview more useful as a project leadership view, not only a list of saved projects.

### Form validation

Project Compass includes basic form validation for important user flows.

The app currently validates:

* Project name when creating a project
* Task title when creating a task
* Risk title when creating a risk
* Decision title when creating a decision

If a required title or name is missing, the app shows a clear validation message, for example:

```text
Project name is required.
Task title is required.
Risk title is required.
Decision title is required.
```

The relevant input is also marked with `aria-invalid="true"` while the validation error is active.

This improves usability, accessibility and testability. The validation behavior is covered by Playwright tests.

### Form accessibility

Project Compass includes accessibility improvements for the most important forms.

The current form accessibility improvements include:

* Labels connected to form fields
* Required project, task, risk and decision fields marked with `aria-required="true"`
* Validation state shown with `aria-invalid`
* Error messages connected to inputs with `aria-describedby`
* Error messages using `role="alert"` and `aria-live="polite"`
* Forms connected to headings and help text with `aria-labelledby` and `aria-describedby`

These improvements make validation errors easier to understand and support better use with assistive technologies.

The accessibility behavior is partly covered by Playwright tests that check required fields and validation states.

### Empty states

Project Compass includes improved empty states for the main project work views.

The app currently gives extra guidance when there are no:

* Tasks in Workspace
* Risks in Risk View
* Decisions in Decision View

Instead of only showing an empty list, the app explains what the user should add next and gives short practical tips.

The empty states help the user understand how to move the project forward and make the app easier to use when a project is still new.

### No active project handling

Project Compass includes clearer guidance when the user opens an important project page without an active project selected.

The app currently shows a no active project state on:

* Workspace
* Risk View
* Decision View
* Project Map
* Status Report

Instead of showing disabled forms, empty data or unclear fallback text, these pages now explain why an active project is needed and guide the user back to My Projects.

The no active project states include:

* A clear heading
* A short explanation of why the page needs an active project
* A link to My Projects
* A link to create a new project where relevant

This improves onboarding, error recovery and the overall user flow for new users.

### Active project

The application stores an active project ID.

The active project is shown in the shared app header, which helps the user understand which project they are currently working with.

The active project owns:

* Members
* Tasks
* Risks
* Decisions

This means that the main project data belongs to the selected project instead of being stored as separate global lists.

### Project setup checklist

Project Map includes a Project setup checklist.

The checklist helps a new user understand what structure the project already has and what should be added next.

The first version checks whether the project has:

* Project name
* Purpose or description
* Goal
* Deliverables
* Project members
* Tasks
* Risks
* Decisions
* Status report ready to review

The checklist is intentionally simple. It does not store separate checkbox state. Instead, it calculates progress from existing project data.

This keeps the feature lightweight, testable and aligned with the MVP approach.

### Project Map

The Project Map summarizes the active project and gives the user an overview before moving into detailed task work.

It includes:

* Project name
* Project description or purpose
* Project setup checklist
* Active project summary
* Project Health
* Attention Needed with High and Medium severity
* Project direction cards
* Recommended next step

The Project Map is one of the key product views because it helps the user understand the project before managing individual tasks.

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
* Missing ownership is highlighted directly in Workspace, Risk View and Decision View

When an item has no responsible person, the app shows:

```text
Responsible: Unassigned
Needs owner
```

This makes missing ownership visible where the work is managed, instead of only showing it later in a report.

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

If a task has no responsible member, Workspace shows `Unassigned` and a `Needs owner` badge.
Tasks are stored in the active project data model.

### Risk responsibility

Risks in the risk register can have a responsible member.

The user can:

* Create a risk
* Assign the risk to a project member
* See the responsible member on the risk card
* Reload the page and keep the responsibility assignment

If a risk has no responsible member or legacy owner note, Risk View shows `Unassigned` and a `Needs owner` badge.
Risks are stored in the active project data model.

### Decision responsibility

Decisions in the decision log can have a responsible member.

The user can:

* Create a decision
* Assign the decision to a project member
* See the responsible member on the decision card
* Reload the page and keep the responsibility assignment

If a decision has no responsible member or legacy owner note, Decision View shows `Unassigned` and a `Needs owner` badge.
Decisions are stored in the active project data model.

### Attention Needed

Project Compass can highlight project items that need project leader attention.

The current version of Attention Needed checks the active project for:

* Blocked tasks
* Tasks without owner
* Risks without owner
* High risks
* Decisions without owner
* Open decisions

Attention Needed is shown in:

* My Projects overview
* Project Map
* Status Report
* Markdown export

Attention items now include a severity level:

* High
* Medium

High severity is used for signals such as blocked tasks, high risks and open decisions.

Medium severity is used for missing ownership, such as tasks, risks or decisions without a responsible person.

This helps the user move from simply storing project information to understanding what should be followed up next and what should be prioritized first.

### Project Health

Project Compass includes a first Project Health MVP.

The app can show one of three health levels:

* Stable
* Needs attention
* At risk

The health level is based on simple project signals such as:

* Blocked tasks
* High risks
* Open decisions
* Attention items
* Missing ownership

Project Health is currently shown in:

* My Projects overview
* Project Map
* Status Report

This is intentionally kept simple in the first version. The goal is to make project status visible and understandable without creating a complex scoring model too early.

### Shared project insight logic

Attention Needed and Project Health are calculated through shared project insight logic in `src/lib/projectInsights.ts`.

This helper currently includes:

* `getAttentionItems(project)`
* `getProjectHealth(project, attentionItems)`

The purpose is to make sure that My Projects, Project Map and Status Report use the same interpretation of project data.

This reduces duplicated logic, improves maintainability and lowers the risk that different views show different project status information.

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
* Attention Needed with High and Medium severity
* Project purpose
* Project goal
* Project members
* Task responsibility
* Risk responsibility
* Decision responsibility
* Recommended next steps

The status report is intended to become the main communication artifact for a project.

### Markdown report export

The status report can be copied as Markdown.

The exported report includes:

* Project name
* Date
* Overall project status
* Summary metrics
* Attention Needed with High and Medium severity
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
3. Create, open or create an example project
4. Review Project Health and Attention Needed preview in My Projects
5. Open the project map
6. Review the Project setup checklist
7. Review active project summary
8. Review Attention Needed with severity
9. Review Project Health
10. Add project members
11. Open the workspace
12. Create tasks
13. Assign task responsibility
14. Add risks to the risk register
15. Assign risk responsibility
16. Add decisions to the decision log
17. Assign decision responsibility
18. Open the status report
19. Review project status, members, responsibilities, risks, decisions and attention items
20. Copy the status report as Markdown

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
├── public
│   └── screenshots
│       ├── my-projects-overview.png
│       ├── project-health-attention.png
│       ├── project-map-checklist.png
│       └── status-report.png
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
│       ├── exampleProject.ts
│       ├── projectInsights.ts
│       └── projectStorage.ts
├── tests
│   ├── decision-responsibility.spec.ts
│   ├── example-project.spec.ts
│   ├── landing-page.spec.ts
│   ├── main-flow.spec.ts
│   ├── project-map-attention.spec.ts
│   ├── project-members.spec.ts
│   ├── project-setup-checklist.spec.ts
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
* Create an example project with ready-made demo data
* Quickly explore the app with members, tasks, risks, decisions and project status data
* See a validation message if project name is missing
* View saved projects
* Open a selected project
* See which project is active
* See project health
* See health summary
* See attention item count
* Preview the most important Attention Needed items directly in the project card
* See whether attention items are High or Medium priority
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
* Project setup checklist
* Active project summary
* Attention Needed with High and Medium severity
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
Tasks without a responsible member are marked with `Needs owner`.

When no tasks exist, Workspace shows a guided empty state that explains how to create a useful first task.

When no active project exists, Workspace shows a clear no active project state and links the user back to My Projects.

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

Risks without a responsible member or legacy owner note are marked with `Needs owner`.

When no risks exist, Risk View shows a guided empty state that explains how to identify uncertainty, think about probability and impact, and add an action.

When no active project exists, Risk View shows a clear no active project state and links the user back to My Projects.

### Decision view

The decision view allows the user to document decisions with:

* Title
* Description
* Responsible member
* Legacy owner note
* Deadline
* Status
* Consequence

Decisions without a responsible member or legacy owner note are marked with `Needs owner`.

When no decisions exist, Decision View shows a guided empty state that explains how to clarify what is undecided, describe consequences and assign responsibility.

When no active project exists, Decision View shows a clear no active project state and links the user back to My Projects.

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
* Attention Needed with High and Medium severity
* Project purpose
* Project goal
* Project members
* Task responsibility
* Risk responsibility
* Decision responsibility
* Recommended next steps

The status report can also be copied as Markdown.

When no active project exists, Status Report shows a clear no active project state and links the user back to My Projects.

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
* `test-strategy.md` describes the testing approach.
* `manual-test-run.md` documents manual regression testing.
* `mvp-scope.md` describes the original MVP and the current MVP+ scope.

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
* Example project creation from My Projects
* Project name validation
* Task title validation
* Risk title validation
* Decision title validation
* Form accessibility for project, task, risk and decision forms
* No active project handling in Workspace, Risk View, Decision View, Project Map and Status Report
* Workspace empty state
* Risk View empty state
* Decision View empty state
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
* Attention Needed preview in My Projects
* Attention Needed severity in Project Map
* Attention Needed severity in Status Report
* Attention Needed severity in Markdown export
* Project Health on Project Map
* Project Health in My Projects
* Project setup checklist on Project Map
* Markdown copy from status report
* Standardized English UI across the main application flow
* Vercel deployment smoke test
* Missing task ownership shown in Workspace
* Missing risk ownership shown in Risk View
* Missing decision ownership shown in Decision View

During manual exploratory testing, several usability and navigation issues were found and fixed, including:

* Missing navigation to the project board from the landing page
* Missing home navigation from project pages
* Missing edit interview navigation from the risk view
* Unclear project opening behavior
* Missing validation feedback when trying to create a project without a name
* Empty work views that did not clearly guide the user toward the next step
* No active project states that needed clearer recovery paths
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
tests/decision-responsibility.spec.ts
tests/example-project.spec.ts
tests/landing-page.spec.ts
tests/main-flow.spec.ts
tests/project-map-attention.spec.ts
tests/project-members.spec.ts
tests/project-setup-checklist.spec.ts
tests/projects-overview.spec.ts
tests/risk-responsibility.spec.ts
tests/status-report-markdown.spec.ts
tests/task-responsibility.spec.ts
```

Current automated tests include:

* Landing page and navigation test
* Main project data flow test
* Projects overview test
* Example project demo flow test
* Project name validation test
* Project members test
* Task responsibility test
* Task title validation test
* Task title accessibility check
* Workspace empty state test
* Workspace no active project state test
* Risk responsibility test
* Risk title validation test
* Risk title accessibility check
* Risk View empty state test
* Risk View no active project state test
* Decision responsibility test
* Decision title validation test
* Decision title accessibility check
* Decision View empty state test
* Decision View no active project state test
* Project Map Attention Needed test
* Project Map severity-aware Attention Needed test
* Project setup checklist test
* Project Map no active project state test
* Status report Markdown copy test
* Status Report severity-aware Attention Needed test
* Status Report Markdown severity export test
* Status Report no active project state test

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
* User sees a validation message when project name is missing
* Project name input is marked invalid when validation fails
* Project name input is marked as required for assistive technology
* Validation message disappears when the user enters a project name
* User can create a project
* Project appears in the list
* Project becomes active
* Project persists after reload
* Active project is shown in the header
* Project overview shows project summary metrics
* Project overview shows Project Health information
* Project overview shows an Attention Needed preview
* Project overview shows stable projects with no current attention items

### Example project demo flow

Verifies that:

* User can create an example project from My Projects
* Example project appears in the saved projects list
* Example project becomes the active project
* User can open the example project in Project Map
* Project Map shows demo project data, Attention Needed and Project Health
* Status Report shows example members, tasks, risks and decisions

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
* User can see a no active project state when Workspace is opened without an active project
* User can see Workspace empty state when no tasks exist
* User can create a task
* User can assign the task to a member
* Task card shows the responsible member
* Responsibility persists after reload
* User sees a validation message when task title is missing
* Task title input is marked invalid when validation fails
* Task title input is marked as required for assistive technology
* Validation message disappears when the user enters a task title
* Tasks without responsible member show Unassigned
* Tasks without responsible member show Needs owner
* Tasks with responsible member do not show Needs owner

### Risk responsibility

Verifies that:

* User can create a project
* User can add a project member
* User can see a no active project state when Risk View is opened without an active project
* User can see Risk View empty state when no risks exist
* User can create a risk
* User can assign the risk to a member
* Risk card shows the responsible member
* Responsibility persists after reload
* User sees a validation message when risk title is missing
* Risk title input is marked invalid when validation fails
* Risk title input is marked as required for assistive technology
* Validation message disappears when the user enters a risk title
* Risks without responsible member show Unassigned
* Risks without responsible member show Needs owner
* Risks with responsible member do not show Needs owner

### Decision responsibility

Verifies that:

* User can create a project
* User can add a project member
* User can see a no active project state when Decision View is opened without an active project
* User can see Decision View empty state when no decisions exist
* User can create a decision
* User can assign the decision to a member
* Decision card shows the responsible member
* Responsibility persists after reload
* User sees a validation message when decision title is missing
* Decision title input is marked invalid when validation fails
* Decision title input is marked as required for assistive technology
* Validation message disappears when the user enters a decision title
* Decisions without responsible member show Unassigned
* Decisions without responsible member show Needs owner
* Decisions with responsible member do not show Needs owner

### Project Map Attention Needed

Verifies that:

* User can create a project
* User can create a blocked task without owner
* User can create a high risk without owner
* User can create an open decision without owner
* Project Map shows Attention Needed
* Attention Needed shows blocked task, missing ownership, high risk and open decision signals
* Attention Needed items show severity labels
* High and Medium severity indicators are visible

### Project setup checklist

Verifies that:

* User sees a no active project state when Project Map is opened without an active project
* User can create a project
* User can open Project Map
* Project setup checklist is visible
* Checklist shows setup progress
* Checklist shows expected setup steps
* Checklist helps the user understand what should be clarified next

### Status report Markdown export

Verifies that:

* User sees a no active project state when Status Report is opened without an active project
* Status report loads with stored active project data
* Copy status report as Markdown button is visible
* User can trigger Markdown copy
* Confirmation message is shown
* Exported Markdown contains project name, members, task, risk and decision data
* Exported Markdown contains Attention Needed
* Status Report shows Attention Needed severity labels
* Exported Markdown contains Attention Needed severity
* Exported Markdown distinguishes High and Medium attention items

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

Run the project overview and project validation test:

```bash
npx playwright test tests/projects-overview.spec.ts --project=chromium
```

Run the example project demo flow test:

```bash
npx playwright test tests/example-project.spec.ts --project=chromium
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

Run the Project setup checklist test:

```bash
npx playwright test tests/project-setup-checklist.spec.ts --project=chromium
```

Run the status report Markdown test:

```bash
npx playwright test tests/status-report-markdown.spec.ts --project=chromium
```

Run the focused regression suite:

```bash
npx playwright test tests/projects-overview.spec.ts --project=chromium
npx playwright test tests/example-project.spec.ts --project=chromium
npx playwright test tests/project-members.spec.ts --project=chromium
npx playwright test tests/task-responsibility.spec.ts --project=chromium
npx playwright test tests/risk-responsibility.spec.ts --project=chromium
npx playwright test tests/decision-responsibility.spec.ts --project=chromium
npx playwright test tests/project-map-attention.spec.ts --project=chromium
npx playwright test tests/project-setup-checklist.spec.ts --project=chromium
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

## Known limitations

The current version is an MVP/portfolio project.

Known limitations:

* Data is stored in browser `localStorage`
* There are no user accounts
* There is no backend database
* There is no real-time collaboration
* Data is not shared between devices
* There is no role-based access control
* Old legacy project interview data still exists beside the newer active project model
* Some project fields are still simpler than the long-term roadmap model
* Editing and deleting all object types is not fully implemented yet

These limitations are intentional at this stage. The focus is on product clarity, QA value, testability and a strong portfolio case.

---

## Current status

The project is functional, deployed and has passed repeated manual and automated regression testing.

Completed:

* Project interview
* Project map
* Project setup checklist on Project Map
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
* Example project/demo data
* Project name validation on My Projects
* Project name validation Playwright coverage
* Task title validation in Workspace
* Task title validation Playwright coverage
* Risk title validation in Risk View
* Risk title validation Playwright coverage
* Decision title validation in Decision View
* Decision title validation Playwright coverage
* Project form accessibility improvement
* Task form accessibility improvement
* Risk form accessibility improvement
* Decision form accessibility improvement
* Workspace empty state improvement
* Workspace empty state Playwright coverage
* Risk View empty state improvement
* Risk View empty state Playwright coverage
* Decision View empty state improvement
* Decision View empty state Playwright coverage
* Workspace no active project state improvement
* Workspace no active project state Playwright coverage
* Risk View no active project state improvement
* Risk View no active project state Playwright coverage
* Decision View no active project state improvement
* Decision View no active project state Playwright coverage
* Project Map no active project state improvement
* Project Map no active project state Playwright coverage
* Status Report no active project state improvement
* Status Report no active project state Playwright coverage
* Project Health shown in My Projects overview
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
* Missing task owner indicator in Workspace
* Missing task owner Playwright coverage
* Missing risk owner indicator in Risk View
* Missing risk owner Playwright coverage
* Missing decision owner indicator in Decision View
* Missing decision owner Playwright coverage
* Responsibility overview in status report
* Active project summary on Project Map
* Attention Needed preview in My Projects overview
* Attention Needed on Project Map
* Attention severity in Project Map
* Attention Needed in Status Report
* Attention severity in Status Report
* Attention severity in Markdown export
* Project Health MVP on Project Map
* Shared project insight logic for Attention Needed and Project Health
* Project Map Attention Needed Playwright coverage
* Project Map severity-aware Attention Needed Playwright coverage
* Project setup checklist Playwright coverage
* Status Report uses active project data
* Project Health in Status Report
* Attention Needed in Markdown export
* Copy status report as Markdown
* Status report Markdown Playwright coverage
* Status Report severity-aware Attention Needed Playwright coverage
* Markdown export severity Playwright coverage
* Example project demo flow Playwright coverage
* Responsibility model plan
* Standardized English UI across the main application flow
* Updated Playwright tests after UI language refactor
* Cleaned up encoding issues from earlier copied text
* Vercel deployment
* Live demo link in README
* Screenshots in README

Planned next steps:

* Continue improving migration and cleanup from older `localStorage` keys
* Continue improving form validation and error handling
* Continue improving empty states and onboarding support
* Continue improving accessibility
* Improve Project Health logic over time
* Continue improving shared project insight logic over time
* Add more focused Playwright tests per module
* Add delete and duplicate project actions
* Add edit/delete for all main objects
* Add filtering and sorting
* Consider persistent backend storage in a later version
* Add a clearer “What I learned” section
* Add a QA/test module in a later version

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
* Extracting shared project insight logic
* Adding onboarding support through a setup checklist
* Adding demo data so new users and reviewers can understand the app faster
* Improving empty states so new users understand the next step
* Improving recovery paths when required project context is missing
* Adding form validation for projects, tasks, risks and decisions
* Improving form accessibility with ARIA attributes and clearer error messages
* Testing negative input cases with Playwright
* Turning Attention Needed into clearer project leadership signals
* Showing priority through High and Medium severity indicators
* Testing status and reporting improvements with focused Playwright tests
* Making missing ownership visible directly in the user interface
* Testing ownership visibility with focused Playwright tests
* Improving a status report so it becomes a useful communication artifact
* Connecting product thinking, QA thinking and portfolio value in one project

---

## Development workflow

The project is developed in small steps.

A typical change should include:

1. Describe why the change is needed
2. Describe the user flow
3. Define simple acceptance criteria
4. Implement the MVP version
5. Test manually
6. Add or update Playwright tests if the flow is important
7. Run relevant tests
8. Run `npm run build`
9. Update README, roadmap or test documentation when relevant
10. Commit with a clear message
11. Push to GitHub

This workflow is part of the portfolio value of the project. It shows not only the final application, but also how the work is planned, tested, documented and improved over time.

---

## Copyright

© 2026 Johan Larsson. Project Compass is a portfolio project created by Johan Larsson.

The source code, documentation, screenshots and product concept material in this repository are part of Johan Larsson’s software testing and QA portfolio.

Unless a separate license is added, all rights are reserved. This repository may be viewed for evaluation, learning and recruitment purposes, but the project may not be copied, redistributed, published or presented as someone else’s work without written permission.

See [NOTICE.md](NOTICE.md) for more information.
