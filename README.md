![Playwright Tests](https://github.com/Zion8a/project-compass/actions/workflows/playwright.yml/badge.svg)

# Project Compass

Project Compass is a small project management MVP built with Next.js, TypeScript and Tailwind CSS.

The goal of the project is to explore how a project management tool can help users structure a project before it becomes only a list of tasks.

The application guides the user from an initial project interview to a project map, task board, risk view, decision log and status report.

---

## Purpose

Many project tools start with tasks.

Project Compass starts one step earlier:

- Why are we doing the project?
- What should become better?
- What should be delivered?
- What can go wrong?
- What decisions are needed?
- What should we do next?

The purpose of the MVP is to test this idea in a simple, practical and usable way.

---

## Features

The current MVP includes:

- Landing page
- Project interview
- Project map
- Project board / Kanban-style task board
- Risk register
- Decision log
- Status report
- Local data persistence with localStorage
- Manual regression test documentation
- Automated end-to-end tests with Playwright

---

## Application flow

The main user flow is:

1. Open the landing page
2. Create a new project
3. Fill in the project interview
4. Generate a project map
5. Create tasks on the project board
6. Add risks to the risk register
7. Add decisions to the decision log
8. Open the status report
9. Review project status, open risks and open decisions

---

## Tech stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Playwright
- Git / GitHub

---

## Project structure

```text
project-compass
├── docs
│   ├── manual-test-run.md
│   ├── mvp-scope.md
│   ├── product-vision.md
│   ├── test-strategy.md
│   └── user-stories.md
├── src
│   └── app
│       ├── new-project
│       ├── project-board
│       ├── project-decisions
│       ├── project-map
│       ├── project-report
│       └── project-risks
├── tests
│   ├── landing-page.spec.ts
│   └── main-flow.spec.ts
├── playwright.config.ts
└── README.md
```

---

## Pages

### Landing page

The landing page introduces Project Compass and provides navigation to:

- Create a new project
- Open the project map
- Open the project board
- Open the status report

### Project interview

The project interview collects the basic project information:

- Project name
- Purpose
- Goal / desired effect
- Deliverables
- Risks
- Decisions

### Project map

The project map summarizes the answers from the project interview and gives the user an overview before moving into task work.

### Project board

The project board allows the user to create and move tasks between:

- Backlog
- Planned
- In progress
- Blocked
- Review
- Done

### Risk view

The risk view allows the user to document project risks with:

- Title
- Description
- Probability
- Impact
- Action
- Owner
- Status

### Decision view

The decision view allows the user to document decisions with:

- Title
- Description
- Owner
- Deadline
- Status
- Consequence

### Status report

The status report summarizes:

- Total tasks
- Done tasks
- Blocked tasks
- Open risks
- High risks
- Open decisions
- Project purpose
- Project goal
- Recommended next steps

---

## Testing

Project Compass includes both manual and automated testing.

### Manual testing

Manual regression testing is documented in:

```text
docs/manual-test-run.md
```

The manual regression test covers the full MVP flow from project creation to status report.

During manual exploratory testing, several usability and navigation issues were found and fixed, including:

- Missing navigation to the project board from the landing page
- Missing home navigation from project pages
- Missing edit interview navigation from the risk view

### Automated testing

Automated end-to-end tests are written with Playwright and located in:

```text
tests/landing-page.spec.ts
tests/main-flow.spec.ts
```

Current automated tests:

- Landing page test
- Main user flow test

The landing page test is verified across:

- Chromium
- Firefox
- WebKit

The main user flow test is currently verified in Chromium and covers the core MVP journey:

```text
Landing page
→ Project interview
→ Project map
→ Project board
→ Risk view
→ Decision view
→ Status report
```

Cross-browser hardening for the full main flow is planned for a later iteration.

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

---

## Current status

The MVP is functional and has passed manual regression testing.

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

Planned next steps:

- Improve cross-browser stability for the main flow test
- Add more focused Playwright tests per module
- Add GitHub Actions for automated test execution
- Improve accessibility
- Add stronger validation and error handling
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